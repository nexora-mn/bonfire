package fan

import (
	"context"
	"time"
)

type MySupport struct {
	ID        string         `json:"id"`
	Creator   CreatorSummary `json:"creator"`
	Kind      string         `json:"kind"`
	TierName  *string        `json:"tierName"`
	Amount    int64          `json:"amount"`
	Message   string         `json:"message"`
	Status    string         `json:"status"`
	CreatedAt time.Time      `json:"createdAt"`
}

type MySupports struct {
	Supports []MySupport `json:"supports"`
}

// ListMySupports returns memberships and one-time supports the signed-in
// user paid for. Empty until the payment integration records supporters.
//
//encore:api auth method=GET path=/me/supports
func (s *Service) ListMySupports(ctx context.Context) (*MySupports, error) {
	uid, err := me()
	if err != nil {
		return nil, err
	}
	rows, err := s.q.ListSupportsByUser(ctx, &uid)
	if err != nil {
		return nil, err
	}
	out := make([]MySupport, len(rows))
	for i, r := range rows {
		out[i] = MySupport{
			ID: r.ID.String(),
			Creator: CreatorSummary{
				Slug:        r.Slug,
				DisplayName: r.DisplayName,
				AvatarURL:   mediaURL(r.AvatarKey),
			},
			Kind:      r.Kind,
			TierName:  r.TierName,
			Amount:    r.Amount,
			Message:   r.Message,
			Status:    r.Status,
			CreatedAt: r.CreatedAt,
		}
	}
	return &MySupports{Supports: out}, nil
}
