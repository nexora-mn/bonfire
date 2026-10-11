package payout

import (
	"context"
	"time"

	"encore.app/persistence"
)

type MonthEarnings struct {
	// YYYY-MM.
	Month      string `json:"month"`
	OneTime    int64  `json:"oneTime"`
	Membership int64  `json:"membership"`
}

type SupportItem struct {
	ID            string    `json:"id"`
	Kind          string    `json:"kind"`
	SupporterName string    `json:"supporterName"`
	Message       string    `json:"message"`
	Amount        int64     `json:"amount"`
	TierName      *string   `json:"tierName"`
	CreatedAt     time.Time `json:"createdAt"`
}

type Earnings struct {
	AllTime        int64 `json:"allTime"`
	ThisMonth      int64 `json:"thisMonth"`
	SupportCount   int64 `json:"supportCount"`
	SupporterCount int64 `json:"supporterCount"`
	// The last 12 months, oldest first, including months with no income.
	Monthly []MonthEarnings `json:"monthly"`
	Recent  []SupportItem   `json:"recent"`
}

// GetEarnings reports the signed-in creator's income.
//
//encore:api auth method=GET path=/creator/me/earnings
func (s *Service) GetEarnings(ctx context.Context) (*Earnings, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	thisMonth := monthStart(time.Now())
	since := thisMonth.AddDate(0, -11, 0)

	totals, err := s.q.EarningsTotals(ctx, persistence.EarningsTotalsParams{CreatorID: c.ID, MonthStart: thisMonth})
	if err != nil {
		return nil, err
	}
	rows, err := s.q.EarningsByMonth(ctx, persistence.EarningsByMonthParams{CreatorID: c.ID, Since: since})
	if err != nil {
		return nil, err
	}
	recent, err := s.q.RecentSupports(ctx, persistence.RecentSupportsParams{CreatorID: c.ID, Limit: 10})
	if err != nil {
		return nil, err
	}

	byMonth := make(map[string]persistence.EarningsByMonthRow, len(rows))
	for _, r := range rows {
		byMonth[r.Month.Format("2006-01")] = r
	}
	monthly := make([]MonthEarnings, 12)
	for i := range monthly {
		key := since.AddDate(0, i, 0).Format("2006-01")
		r := byMonth[key]
		monthly[i] = MonthEarnings{Month: key, OneTime: r.OneTime, Membership: r.Membership}
	}

	items := make([]SupportItem, len(recent))
	for i, r := range recent {
		items[i] = SupportItem{
			ID:            r.ID.String(),
			Kind:          r.Kind,
			SupporterName: r.SupporterName,
			Message:       r.Message,
			Amount:        r.Amount,
			TierName:      r.TierName,
			CreatedAt:     r.CreatedAt,
		}
	}

	return &Earnings{
		AllTime:        totals.AllTime,
		ThisMonth:      totals.ThisMonth,
		SupportCount:   totals.SupportCount,
		SupporterCount: totals.SupporterCount,
		Monthly:        monthly,
		Recent:         items,
	}, nil
}
