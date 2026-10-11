package search

import (
	"context"
	"fmt"
	"strings"
)

const postsPerPage = 20

var postSorts = map[string]string{
	"relevance": "_text_match(buckets: 10):desc,like_count:desc,created_at:desc",
	"newest":    "created_at:desc,_text_match:desc",
	"likes":     "like_count:desc,created_at:desc",
}

type PostSearchParams struct {
	// Matches titles and the bodies of public posts. Empty lists all posts.
	Q string `query:"q"`
	// Only posts by the creator with this slug.
	Creator string `query:"creator"`
	// "public" or "members".
	Visibility string `query:"visibility"`
	// Only posts with an image.
	HasImage bool `query:"hasImage"`
	// "relevance" (default), "newest" or "likes".
	Sort string `query:"sort"`
	// Zero-based page number.
	Page int `query:"page"`
}

func (p *PostSearchParams) Validate() error {
	if len(p.Q) > 200 {
		return invalid("query is too long")
	}
	if p.Sort == "" {
		p.Sort = "relevance"
	}
	if _, ok := postSorts[p.Sort]; !ok {
		return invalid("unknown sort")
	}
	if p.Visibility != "" && p.Visibility != "public" && p.Visibility != "members" {
		return invalid("visibility must be public or members")
	}
	if p.Page < 0 || p.Page > maxPage {
		return invalid(fmt.Sprintf("page must be between 0 and %d", maxPage))
	}
	return nil
}

type PostResults struct {
	Posts   []PostHit `json:"posts"`
	Found   int       `json:"found"`
	HasMore bool      `json:"hasMore"`
	Facets  []Facet   `json:"facets"`
}

// postQuery is the shared ranking setup for post searches. Each hit is
// joined to its creator, so names and avatars are always current.
func (s *Service) postQuery(q string) query {
	q = strings.TrimSpace(q)
	if q == "" {
		q = "*"
	}
	out := query{
		Collection:     s.c.Posts,
		Q:              q,
		QueryBy:        "title,body",
		QueryByWeights: "4,1",
		TextMatchType:  "max_weight",
		Stopwords:      stopwordsSet,
		IncludeFields:  s.creatorJoin(),
		ExcludeFields:  "embedding",
		// Long bodies are snippeted around the match.
		SnippetThreshold: 40,
		UseCache:         true,
		CacheTTL:         30,
	}
	if s.semantic() {
		out.QueryBy += ",embedding"
		out.QueryByWeights += ",1"
		out.VectorQuery = fmt.Sprintf("embedding:([], distance_threshold: %g)", hybridMaxDistance)
		out.RerankHybridMatches = true
	}
	return withHighlights(out)
}

// creatorJoin includes every post field plus its creator under "creator".
func (s *Service) creatorJoin() string {
	return "*, $" + s.c.Creators + "(slug, display_name, avatar_key, strategy: nest) as creator"
}

// SearchPosts finds posts. Members-only posts match on their title only
// and come back locked. Auth is optional; signed-in viewers see which
// posts they liked.
//
//encore:api public method=GET path=/search/posts
func (s *Service) SearchPosts(ctx context.Context, p *PostSearchParams) (*PostResults, error) {
	q := s.postQuery(p.Q)
	sort := postSorts[p.Sort]
	if q.Q == "*" && p.Sort == "relevance" {
		sort = postSorts["newest"]
	}
	q.SortBy = sort
	q.FilterBy = and(
		// Filters on the joined creator document.
		ifSet(p.Creator, "$"+s.c.Creators+"(slug:="+quote(p.Creator)+")"),
		ifSet(p.Visibility, "visibility:="+p.Visibility),
		ifSet(p.HasImage, "has_image:true"),
	)
	q.FacetBy = "visibility,has_image"
	q.Page = p.Page + 1
	q.PerPage = postsPerPage

	r, err := search[postDoc](withAnalyticsUser(ctx, analyticsUser()), s.ts, q)
	if err != nil {
		return nil, unavailable(err)
	}
	hits := make([]PostHit, len(r.Hits))
	for i, h := range r.Hits {
		hits[i] = toPostHit(h)
	}
	if err := s.markLiked(ctx, hits); err != nil {
		return nil, err
	}
	return &PostResults{
		Posts:   hits,
		Found:   r.Found,
		HasMore: (p.Page+1)*postsPerPage < r.Found && p.Page < maxPage,
		Facets:  toFacets(r.FacetCounts),
	}, nil
}

// ifSet returns clause when v is non-zero.
func ifSet[T comparable](v T, clause string) string {
	var zero T
	if v == zero {
		return ""
	}
	return clause
}
