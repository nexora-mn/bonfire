package creator

import (
	"context"
	"time"

	"encore.app/events"
	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

const maxTiers = 10

type Tier struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	// Price per month, in MNT.
	MonthlyPrice int64     `json:"monthlyPrice"`
	Position     int32     `json:"position"`
	IsActive     bool      `json:"isActive"`
	ImageKey     *string   `json:"imageKey"`
	ImageURL     *string   `json:"imageUrl"`
	CreatedAt    time.Time `json:"createdAt"`
}

func toTier(t persistence.Tier) Tier {
	return Tier{
		ID:           t.ID.String(),
		Name:         t.Name,
		Description:  t.Description,
		MonthlyPrice: t.MonthlyPrice,
		Position:     t.Position,
		IsActive:     t.IsActive,
		ImageKey:     t.ImageKey,
		ImageURL:     mediaURL(t.ImageKey),
		CreatedAt:    t.CreatedAt,
	}
}

func toTiers(rows []persistence.Tier) []Tier {
	out := make([]Tier, len(rows))
	for i, t := range rows {
		out[i] = toTier(t)
	}
	return out
}

type TierList struct {
	Tiers []Tier `json:"tiers"`
}

// ListTiers returns all of the page's tiers, including inactive ones.
//
//encore:api auth method=GET path=/creator/me/tiers
func (s *Service) ListTiers(ctx context.Context) (*TierList, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	rows, err := s.q.ListTiers(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	return &TierList{Tiers: toTiers(rows)}, nil
}

type TierParams struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	MonthlyPrice int64  `json:"monthlyPrice"`
	Position     int32  `json:"position"`
	IsActive     bool   `json:"isActive"`
	// Key returned by POST /creator/me/media/tier, or null for no image.
	ImageKey *string `json:"imageKey"`
}

func (p *TierParams) Validate() error {
	if err := checkLen("name", &p.Name, 1, 60); err != nil {
		return err
	}
	if err := checkLen("description", &p.Description, 0, 1000); err != nil {
		return err
	}
	if p.MonthlyPrice < 1000 || p.MonthlyPrice > 10_000_000 {
		return invalid("monthly price must be between 1,000 and 10,000,000")
	}
	return nil
}

// CreateTier adds a monthly membership tier.
//
//encore:api auth method=POST path=/creator/me/tiers
func (s *Service) CreateTier(ctx context.Context, p *TierParams) (*Tier, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	n, err := s.q.CountTiers(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	if n >= maxTiers {
		return nil, &errs.Error{Code: errs.ResourceExhausted, Message: "at most 10 tiers"}
	}
	if err := checkImage(c, "tier", p.ImageKey); err != nil {
		return nil, err
	}
	t, err := s.q.CreateTier(ctx, persistence.CreateTierParams{
		CreatorID:    c.ID,
		Name:         p.Name,
		Description:  p.Description,
		MonthlyPrice: p.MonthlyPrice,
		Position:     p.Position,
		IsActive:     p.IsActive,
		ImageKey:     p.ImageKey,
	})
	if err != nil {
		return nil, err
	}
	// Tier names and prices are searchable.
	events.CreatorUpdated(ctx, c.ID, false)
	out := toTier(t)
	return &out, nil
}

var errTierNotFound = &errs.Error{Code: errs.NotFound, Message: "tier not found"}

// UpdateTier edits a tier. Existing supporters keep the price they joined at
// (enforced by the payment integration, once it exists).
//
//encore:api auth method=PUT path=/creator/me/tiers/:id
func (s *Service) UpdateTier(ctx context.Context, id uuid.UUID, p *TierParams) (*Tier, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	if err := checkImage(c, "tier", p.ImageKey); err != nil {
		return nil, err
	}
	old, err := s.q.GetTier(ctx, persistence.GetTierParams{ID: id, CreatorID: c.ID})
	if persistence.IsNotFound(err) {
		return nil, errTierNotFound
	} else if err != nil {
		return nil, err
	}
	t, err := s.q.UpdateTier(ctx, persistence.UpdateTierParams{
		ID:           id,
		CreatorID:    c.ID,
		Name:         p.Name,
		Description:  p.Description,
		MonthlyPrice: p.MonthlyPrice,
		Position:     p.Position,
		IsActive:     p.IsActive,
		ImageKey:     p.ImageKey,
	})
	if err != nil {
		return nil, err
	}
	deleteReplaced(ctx, old.ImageKey, p.ImageKey)
	events.CreatorUpdated(ctx, c.ID, false)
	out := toTier(t)
	return &out, nil
}

// DeleteTier removes a tier and its image. Past supports keep their
// history (tier_id is set to null).
//
//encore:api auth method=DELETE path=/creator/me/tiers/:id
func (s *Service) DeleteTier(ctx context.Context, id uuid.UUID) error {
	c, err := s.mine(ctx)
	if err != nil {
		return err
	}
	imageKey, err := s.q.DeleteTier(ctx, persistence.DeleteTierParams{ID: id, CreatorID: c.ID})
	if persistence.IsNotFound(err) {
		return errTierNotFound
	} else if err != nil {
		return err
	}
	deleteObject(ctx, imageKey)
	events.CreatorUpdated(ctx, c.ID, false)
	return nil
}
