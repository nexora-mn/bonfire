package payout

import (
	"context"
	"math/rand/v2"
	"time"

	"encore.app/persistence"
	"encore.dev"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

var (
	seedNames    = []string{"Бат", "Сараа", "Тэмүүлэн", "Номин", "Анударь", "Ганбаатар", "Хулан", ""}
	seedMessages = []string{"Амжилт хүсье!", "Үргэлжлүүлээрэй 🔥", "Таны бүтээл гоё байна", "", ""}
)

type SeedResult struct {
	Inserted int `json:"inserted"`
}

// SeedSupports fills the caller's page with fake, already-succeeded supports
// spread over the last six months, so earnings and payouts can be tried
// before payments exist. The caller is recorded as the supporter, so their
// fan board's "my supports" fills too. Refused outside local and development.
//
//encore:api auth method=POST path=/dev/seed-supports
func (s *Service) SeedSupports(ctx context.Context) (*SeedResult, error) {
	env := encore.Meta().Environment
	if env.Cloud != encore.CloudLocal && env.Type != encore.EnvDevelopment {
		return nil, &errs.Error{Code: errs.PermissionDenied, Message: "seeding is only available in development"}
	}
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	tiers, err := s.q.ListTiers(ctx, c.ID)
	if err != nil {
		return nil, err
	}

	const n = 40
	now := time.Now()
	for range n {
		p := persistence.InsertSupportParams{
			CreatorID:       c.ID,
			SupporterUserID: &c.UserID,
			Kind:            "one_time",
			SupporterName:   seedNames[rand.IntN(len(seedNames))],
			Message:         seedMessages[rand.IntN(len(seedMessages))],
			Amount:          int64(rand.IntN(10)+1) * 5000,
			CreatedAt:       now.Add(-time.Duration(rand.IntN(180*24)) * time.Hour),
		}
		if len(tiers) > 0 && rand.IntN(2) == 0 {
			t := tiers[rand.IntN(len(tiers))]
			p.Kind = "membership"
			p.TierID = (*uuid.UUID)(&t.ID)
			p.Amount = t.MonthlyPrice
		}
		if err := s.q.InsertSupport(ctx, p); err != nil {
			return nil, err
		}
	}
	return &SeedResult{Inserted: n}, nil
}
