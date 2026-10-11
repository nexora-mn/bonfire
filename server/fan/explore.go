package fan

import (
	"context"
	"strings"

	"encore.app/persistence"
	"encore.app/search"
	"encore.dev/rlog"
)

const explorePageSize = 24

type ExploreParams struct {
	// Matches creator names and page URLs.
	Q string `query:"q"`
	// Zero-based page number.
	Page int `query:"page"`
}

type ExploreCreator struct {
	Slug          string  `json:"slug"`
	DisplayName   string  `json:"displayName"`
	AvatarURL     *string `json:"avatarUrl"`
	About         string  `json:"about"`
	CoverURL    *string `json:"coverUrl"`
}

type ExploreResponse struct {
	Creators []ExploreCreator `json:"creators"`
	HasMore  bool             `json:"hasMore"`
}

// likeEscaper keeps user input from acting as ILIKE wildcards.
var likeEscaper = strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)

// Explore lists creators, most relevant (or most clicked, without a
// query) first, from the search index. If search is down it falls back to
// a plain name match in the database. Auth is optional.
//
//encore:api public method=GET path=/explore
func (s *Service) Explore(ctx context.Context, p *ExploreParams) (*ExploreResponse, error) {
	page := max(p.Page, 0)
	res, err := search.SearchCreators(ctx, &search.CreatorSearchParams{Q: p.Q, Page: page})
	if err != nil {
		rlog.Warn("explore: search unavailable, using database", "err", err)
		return s.exploreDB(ctx, p.Q, page)
	}
	out := make([]ExploreCreator, len(res.Creators))
	for i, c := range res.Creators {
		out[i] = ExploreCreator{
			Slug:          c.Slug,
			DisplayName:   c.DisplayName,
			AvatarURL:     c.AvatarURL,
			About:         c.About,
			CoverURL:      c.CoverURL,
		}
	}
	return &ExploreResponse{Creators: out, HasMore: res.HasMore}, nil
}

func (s *Service) exploreDB(ctx context.Context, query string, page int) (*ExploreResponse, error) {
	var q *string
	if t := strings.TrimSpace(query); t != "" {
		escaped := likeEscaper.Replace(t)
		q = &escaped
	}
	rows, err := s.q.ExploreCreators(ctx, persistence.ExploreCreatorsParams{
		Q:          q,
		PageOffset: int32(page * explorePageSize),
		// One extra row tells us whether another page exists.
		PageSize: explorePageSize + 1,
	})
	if err != nil {
		return nil, err
	}
	hasMore := len(rows) > explorePageSize
	rows = rows[:min(len(rows), explorePageSize)]

	out := make([]ExploreCreator, len(rows))
	for i, r := range rows {
		out[i] = ExploreCreator{
			Slug:          r.Slug,
			DisplayName:   r.DisplayName,
			AvatarURL:     mediaURL(r.AvatarKey),
			About:         r.About,
			CoverURL:      mediaURL(r.CoverKey),
		}
	}
	return &ExploreResponse{Creators: out, HasMore: hasMore}, nil
}
