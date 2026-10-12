package creator

import (
	"context"
	"slices"
	"time"

	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
)

type Link struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
}

type OneTimeSettings struct {
	Enabled bool `json:"enabled"`
	// Smallest amount a supporter can send, in MNT.
	Min int64 `json:"min"`
	// Quick-pick amounts shown on the page, in MNT.
	Presets []int64 `json:"presets"`
	// Shown to the supporter after they pay.
	Thanks string `json:"thanks"`
}

// Creator is the owner's view of their page.
type Creator struct {
	ID   string `json:"id"`
	Slug string `json:"slug"`
	// Permanent code behind the QR code; resolve with GET /c/:code.
	Code        string          `json:"code"`
	DisplayName string          `json:"displayName"`
	About       string          `json:"about"`
	AvatarURL   *string         `json:"avatarUrl"`
	CoverURL    *string         `json:"coverUrl"`
	Links       []Link          `json:"links"`
	OneTime     OneTimeSettings `json:"oneTime"`
	CreatedAt   time.Time       `json:"createdAt"`
}

func (s *Service) toCreator(ctx context.Context, c persistence.Creator) (*Creator, error) {
	rows, err := s.q.ListCreatorLinks(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	links := make([]Link, len(rows))
	for i, r := range rows {
		links[i] = Link{Platform: r.Platform, URL: r.Url}
	}
	return &Creator{
		ID:          c.ID.String(),
		Slug:        c.Slug,
		Code:        c.Code,
		DisplayName: c.DisplayName,
		About:       c.About,
		AvatarURL:   mediaURL(c.AvatarKey),
		CoverURL:    mediaURL(c.CoverKey),
		Links:       links,
		OneTime: OneTimeSettings{
			Enabled: c.OneTimeEnabled,
			Min:     c.OneTimeMin,
			Presets: c.OneTimePresets,
			Thanks:  c.OneTimeThanks,
		},
		CreatedAt: c.CreatedAt,
	}, nil
}

type MineResponse struct {
	// Null when the user has not become a creator yet.
	Creator *Creator `json:"creator"`
}

// GetMine returns the signed-in user's creator page, if any.
//
//encore:api auth method=GET path=/creator/me
func (s *Service) GetMine(ctx context.Context) (*MineResponse, error) {
	c, err := s.mine(ctx)
	if err == errNoCreator {
		return &MineResponse{}, nil
	} else if err != nil {
		return nil, err
	}
	out, err := s.toCreator(ctx, c)
	if err != nil {
		return nil, err
	}
	return &MineResponse{Creator: out}, nil
}

type ProfileParams struct {
	Slug        string `json:"slug"`
	DisplayName string `json:"displayName"`
	About       string `json:"about"`
	Links       []Link `json:"links"`
}

func (p *ProfileParams) Validate() error {
	if err := validateSlug(p.Slug); err != nil {
		return err
	}
	if err := checkLen("display name", &p.DisplayName, 1, 80); err != nil {
		return err
	}
	if err := checkLen("about", &p.About, 0, 5000); err != nil {
		return err
	}
	return validateLinks(p.Links)
}

var errSlugTaken = &errs.Error{Code: errs.AlreadyExists, Message: "slug is taken"}

// Become turns the signed-in user into a creator.
//
//encore:api auth method=POST path=/creator
func (s *Service) Become(ctx context.Context, p *ProfileParams) (*Creator, error) {
	uid, err := userID()
	if err != nil {
		return nil, err
	}

	var created persistence.Creator
	// A fresh code collides with an existing one about once in 10^11 tries.
	for attempt := 0; ; attempt++ {
		err = s.inTx(ctx, func(q *persistence.Queries) error {
			c, err := q.CreateCreator(ctx, persistence.CreateCreatorParams{
				UserID:      uid,
				Slug:        p.Slug,
				Code:        newCode(),
				DisplayName: p.DisplayName,
				About:       p.About,
			})
			if err != nil {
				return err
			}
			created = c
			return replaceLinks(ctx, q, c, p.Links)
		})
		if persistence.UniqueViolation(err) == "creators_code_key" && attempt < 3 {
			continue
		}
		break
	}
	switch persistence.UniqueViolation(err) {
	case "":
	case "creators_user_id_key":
		return nil, &errs.Error{Code: errs.AlreadyExists, Message: "you already have a creator page"}
	case "creators_slug_key":
		return nil, errSlugTaken
	}
	if err != nil {
		return nil, err
	}
	rlog.Info("creator created", "creator_id", created.ID, "slug", created.Slug)
	return s.toCreator(ctx, created)
}

// UpdateProfile edits the page's URL, name, about text and links.
// Changing the slug keeps the QR code working, since it points at the code.
//
//encore:api auth method=PUT path=/creator/me
func (s *Service) UpdateProfile(ctx context.Context, p *ProfileParams) (*Creator, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	err = s.inTx(ctx, func(q *persistence.Queries) error {
		c, err = q.UpdateCreatorProfile(ctx, persistence.UpdateCreatorProfileParams{
			ID:          c.ID,
			Slug:        p.Slug,
			DisplayName: p.DisplayName,
			About:       p.About,
		})
		if err != nil {
			return err
		}
		return replaceLinks(ctx, q, c, p.Links)
	})
	if persistence.UniqueViolation(err) == "creators_slug_key" {
		return nil, errSlugTaken
	} else if err != nil {
		return nil, err
	}
	return s.toCreator(ctx, c)
}

func replaceLinks(ctx context.Context, q *persistence.Queries, c persistence.Creator, links []Link) error {
	if err := q.DeleteCreatorLinks(ctx, c.ID); err != nil {
		return err
	}
	for i, l := range links {
		err := q.InsertCreatorLink(ctx, persistence.InsertCreatorLinkParams{
			CreatorID: c.ID,
			Position:  int32(i),
			Platform:  l.Platform,
			Url:       l.URL,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func (p *OneTimeSettings) Validate() error {
	if p.Min < 100 || p.Min > 10_000_000 {
		return invalid("minimum must be between 100 and 10,000,000")
	}
	if len(p.Presets) > 4 {
		return invalid("at most 4 preset amounts")
	}
	for _, v := range p.Presets {
		if v < p.Min || v > 10_000_000 {
			return invalid("preset amounts must be at least the minimum")
		}
	}
	slices.Sort(p.Presets)
	p.Presets = slices.Compact(p.Presets)
	if p.Presets == nil {
		p.Presets = []int64{}
	}
	return checkLen("thank-you message", &p.Thanks, 0, 500)
}

// UpdateOneTime configures one-time support on the page.
//
//encore:api auth method=PUT path=/creator/me/one-time
func (s *Service) UpdateOneTime(ctx context.Context, p *OneTimeSettings) (*Creator, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	c, err = s.q.UpdateOneTimeSettings(ctx, persistence.UpdateOneTimeSettingsParams{
		ID:             c.ID,
		OneTimeEnabled: p.Enabled,
		OneTimeMin:     p.Min,
		OneTimePresets: p.Presets,
		OneTimeThanks:  p.Thanks,
	})
	if err != nil {
		return nil, err
	}
	return s.toCreator(ctx, c)
}

type SlugAvailability struct {
	Available bool `json:"available"`
}

// SlugAvailable checks a slug before the user submits it. The caller's own
// current slug counts as available.
//
//encore:api auth method=GET path=/creator/slug/:slug
func (s *Service) SlugAvailable(ctx context.Context, slug string) (*SlugAvailability, error) {
	if validateSlug(slug) != nil {
		return &SlugAvailability{Available: false}, nil
	}
	other, err := s.q.GetCreatorBySlug(ctx, slug)
	if persistence.IsNotFound(err) {
		return &SlugAvailability{Available: true}, nil
	} else if err != nil {
		return nil, err
	}
	uid, err := userID()
	if err != nil {
		return nil, err
	}
	return &SlugAvailability{Available: other.UserID == uid}, nil
}
