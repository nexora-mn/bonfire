package creator

import (
	"context"
	"strings"
	"time"

	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

// PublicPost is a post as visitors see it. Members-only posts are listed
// as locked teasers without their body or image.
type PublicPost struct {
	ID         string  `json:"id"`
	Title      string  `json:"title"`
	Body       string  `json:"body"`
	ImageURL   *string `json:"imageUrl"`
	Visibility string  `json:"visibility"`
	Locked     bool    `json:"locked"`
	LikeCount  int64   `json:"likeCount"`
	// Whether the signed-in viewer liked it; false for anonymous visitors.
	Liked     bool      `json:"liked"`
	CreatedAt time.Time `json:"createdAt"`
}

type PublicProfile struct {
	Slug          string          `json:"slug"`
	DisplayName   string          `json:"displayName"`
	About         string          `json:"about"`
	AvatarURL     *string         `json:"avatarUrl"`
	CoverURL      *string         `json:"coverUrl"`
	Links         []Link          `json:"links"`
	OneTime       OneTimeSettings `json:"oneTime"`
	Tiers         []Tier          `json:"tiers"`
	Posts         []PublicPost    `json:"posts"`
	CreatedAt time.Time `json:"createdAt"`
}

var errCreatorNotFound = &errs.Error{Code: errs.NotFound, Message: "creator not found"}

// GetPublic returns a creator's public page. Auth is optional; when signed
// in, the response says which posts the viewer liked.
//
//encore:api public method=GET path=/creators/:slug
func (s *Service) GetPublic(ctx context.Context, slug string) (*PublicProfile, error) {
	c, err := s.q.GetCreatorBySlug(ctx, slug)
	if persistence.IsNotFound(err) {
		return nil, errCreatorNotFound
	} else if err != nil {
		return nil, err
	}
	full, err := s.toCreator(ctx, c)
	if err != nil {
		return nil, err
	}
	tiers, err := s.q.ListActiveTiers(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	posts, err := s.q.ListPosts(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	me := viewer()
	likeRows, err := s.q.CreatorPostLikes(ctx, persistence.CreatorPostLikesParams{CreatorID: c.ID, Viewer: me})
	if err != nil {
		return nil, err
	}
	likes := make(map[uuid.UUID]persistence.CreatorPostLikesRow, len(likeRows))
	for _, l := range likeRows {
		likes[l.PostID] = l
	}

	// Supporter sign-in comes with payments; until then nobody is a member.
	public := make([]PublicPost, len(posts))
	for i, p := range posts {
		pp := PublicPost{
			ID:         p.ID.String(),
			Title:      p.Title,
			Visibility: p.Visibility,
			LikeCount:  likes[p.ID].LikeCount,
			Liked:      likes[p.ID].Liked,
			CreatedAt:  p.CreatedAt,
		}
		if p.Visibility == "members" {
			pp.Locked = true
		} else {
			pp.Body = p.Body
			pp.ImageURL = mediaURL(p.ImageKey)
		}
		public[i] = pp
	}

	return &PublicProfile{
		Slug:          full.Slug,
		DisplayName:   full.DisplayName,
		About:         full.About,
		AvatarURL:     full.AvatarURL,
		CoverURL:      full.CoverURL,
		Links:         full.Links,
		OneTime:       full.OneTime,
		Tiers:         toTiers(tiers),
		Posts:         public,
		CreatedAt:     full.CreatedAt,
	}, nil
}

type ResolvedCode struct {
	Slug string `json:"slug"`
}

// ResolveCode maps a QR code's permanent code to the creator's current slug.
//
//encore:api public method=GET path=/c/:code
func (s *Service) ResolveCode(ctx context.Context, code string) (*ResolvedCode, error) {
	// Codes are uppercase; accept them however they were typed.
	c, err := s.q.GetCreatorByCode(ctx, strings.ToUpper(code))
	if persistence.IsNotFound(err) {
		return nil, errCreatorNotFound
	} else if err != nil {
		return nil, err
	}
	return &ResolvedCode{Slug: c.Slug}, nil
}
