package payout

import (
	"context"
	"testing"
	"time"

	"encore.app/persistence"
	"encore.dev/types/uuid"
)

func TestMonthlyPayouts(t *testing.T) {
	ctx := context.Background()
	q, _ := persistence.Open(db)

	newCreator := func(slug string) uuid.UUID {
		c, err := q.CreateCreator(ctx, persistence.CreateCreatorParams{
			UserID: uuid.Must(uuid.NewV4()), Slug: slug, Code: slug, DisplayName: slug,
		})
		if err != nil {
			t.Fatal(err)
		}
		return c.ID
	}
	support := func(creator uuid.UUID, amount int64, at time.Time) {
		if err := q.InsertSupport(ctx, persistence.InsertSupportParams{
			CreatorID: creator, Kind: "one_time", Amount: amount, CreatedAt: at,
		}); err != nil {
			t.Fatal(err)
		}
	}
	addAccount := func(creator uuid.UUID) {
		if _, err := q.UpsertPayoutAccount(ctx, persistence.UpsertPayoutAccountParams{
			CreatorID: creator, BankCode: "khan", AccountHolder: "Test", AccountNumber: "5000123456",
		}); err != nil {
			t.Fatal(err)
		}
	}
	run := func(month string) *MonthResult {
		res, err := Run(ctx, &RunParams{Month: month})
		if err != nil {
			t.Fatal(err)
		}
		return res
	}
	payouts := func(creator uuid.UUID) []persistence.Payout {
		ps, err := q.ListPayouts(ctx, creator)
		if err != nil {
			t.Fatal(err)
		}
		return ps
	}
	jan := time.Date(2025, 1, 15, 12, 0, 0, 0, ulaanbaatar)
	feb := jan.AddDate(0, 1, 0)

	paid := newCreator("paid-creator")
	addAccount(paid)
	support(paid, 50000, jan)
	support(paid, 3000, jan)
	support(paid, 17000, feb) // after January's cut-off

	late := newCreator("late-account")
	support(late, 20000, jan)

	small := newCreator("small-balance")
	addAccount(small)
	support(small, 5000, jan)

	if res := run("2025-01"); res.Created != 1 || res.Paid != 1 {
		t.Fatalf("January run = %+v, want 1 created and paid", res)
	}
	ps := payouts(paid)
	if len(ps) != 1 {
		t.Fatalf("got %d payouts, want 1", len(ps))
	}
	janPayout := ps[0]
	if p := janPayout; p.Gross != 53000 || p.Fee != 2650 || p.Amount != 50350 || p.Status != "paid" || !p.Sandbox || p.BankRef == nil {
		t.Fatalf("January payout = %+v", p)
	}
	if len(payouts(late)) != 0 || len(payouts(small)) != 0 {
		t.Fatal("no account or below the minimum should not be paid")
	}

	// A rerun attaches to the finished workflow instead of paying again.
	run("2025-01")
	if n := len(payouts(paid)); n != 1 {
		t.Fatalf("rerun left %d payouts, want 1", n)
	}

	// The unpaid balances carry over into February.
	addAccount(late)
	support(small, 10000, feb)
	run("2025-02")
	for creator, want := range map[uuid.UUID]int64{paid: 17000, late: 20000, small: 15000} {
		ps := payouts(creator)
		if len(ps) == 0 || ps[0].Gross != want {
			t.Fatalf("February payouts for %s = %+v, want gross %d", creator, ps, want)
		}
	}

	// A failed transfer's money goes back into the balance.
	if _, err := db.Exec(ctx, "UPDATE payouts SET status = 'failed' WHERE id = $1", janPayout.ID); err != nil {
		t.Fatal(err)
	}
	run("2025-03")
	if ps := payouts(paid); ps[0].Gross != 53000 {
		t.Fatalf("March payout gross = %d, want the failed 53000 again", ps[0].Gross)
	}
}
