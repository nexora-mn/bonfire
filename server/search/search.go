package search

import (
	"context"
	"html"
	"net/http"
	"strings"
)

const overviewSize = 6

type SearchParams struct {
	Q string `query:"q"`
}

func (p *SearchParams) Validate() error {
	if len(p.Q) > 200 {
		return invalid("query is too long")
	}
	return nil
}

type SearchResponse struct {
	Creators      []CreatorHit `json:"creators"`
	CreatorsFound int          `json:"creatorsFound"`
	Posts         []PostHit    `json:"posts"`
	PostsFound    int          `json:"postsFound"`
}

// Search returns the top creators and posts for a query in one round trip,
// for an "all results" page; follow up with /search/creators or
// /search/posts for filters and more pages. Auth is optional.
//
//encore:api public method=GET path=/search
func (s *Service) Search(ctx context.Context, p *SearchParams) (*SearchResponse, error) {
	cq := s.creatorQuery(p.Q)
	cq.SortBy = creatorSorts["relevance"]
	cq.PerPage = overviewSize
	pq := s.postQuery(p.Q)
	pq.SortBy = postSorts["relevance"]
	if pq.Q == "*" {
		pq.SortBy = postSorts["newest"]
	}
	pq.PerPage = overviewSize

	raw, err := s.ts.multiSearch(withAnalyticsUser(ctx, analyticsUser()), cq, pq)
	if err != nil {
		return nil, unavailable(err)
	}
	cr, err := decodeResult[creatorDoc](raw[0])
	if err != nil {
		return nil, unavailable(err)
	}
	pr, err := decodeResult[postDoc](raw[1])
	if err != nil {
		return nil, unavailable(err)
	}

	out := &SearchResponse{
		Creators:      make([]CreatorHit, len(cr.Hits)),
		CreatorsFound: cr.Found,
		Posts:         make([]PostHit, len(pr.Hits)),
		PostsFound:    pr.Found,
	}
	for i, h := range cr.Hits {
		out.Creators[i] = toCreatorHit(h)
	}
	for i, h := range pr.Hits {
		out.Posts[i] = toPostHit(h)
	}
	if err := s.markLiked(ctx, out.Posts); err != nil {
		return nil, err
	}
	return out, nil
}

type SuggestParams struct {
	// What the user has typed so far.
	Q string `query:"q"`
}

type Suggestion struct {
	// "query" (a popular search to run) or "creator" (a page to open).
	Kind string `json:"kind"`
	// Text to search for when picked; the creator's name for creators.
	Text string `json:"text"`
	// Text with the typed prefix wrapped in <mark>, HTML-escaped.
	Highlighted string `json:"highlighted"`
	// Set for creator suggestions.
	Creator *CreatorSummary `json:"creator,omitempty"`
}

type SuggestResponse struct {
	Suggestions []Suggestion `json:"suggestions"`
}

// suggestDoc covers both collections in the union: query documents have
// q, creator documents the rest.
type suggestDoc struct {
	Q string `json:"q"`
	creatorDoc
}

// Suggest powers search-as-you-type: popular past searches and matching
// creators, ranked together in one list by a union search.
//
//encore:api public method=GET path=/search/suggest
func (s *Service) Suggest(ctx context.Context, p *SuggestParams) (*SuggestResponse, error) {
	q := strings.TrimSpace(p.Q)
	if q == "" || len(q) > 100 {
		return &SuggestResponse{Suggestions: []Suggestion{}}, nil
	}
	off := new(bool)
	// A union needs the same sort field types in every search.
	queries := withHighlights(query{
		Collection:      s.c.Queries,
		Q:               q,
		QueryBy:         "q",
		SortBy:          "_text_match:desc,count:desc",
		EnableAnalytics: off,
		UseCache:        true,
		CacheTTL:        60,
	})
	creators := withHighlights(query{
		Collection:      s.c.Creators,
		Q:               q,
		QueryBy:         "display_name,slug",
		QueryByWeights:  "2,1",
		Infix:           "off,fallback",
		SortBy:          "_text_match:desc,popularity(missing_values: last):desc",
		IncludeFields:   "id,slug,display_name,avatar_key",
		HighlightFields: "display_name",
		// Keystrokes aren't searches; only completed ones count as popular.
		EnableAnalytics: off,
		UseCache:        true,
		CacheTTL:        60,
	})

	r, err := unionSearch[suggestDoc](ctx, s.ts, 8, queries, creators)
	if err != nil {
		return nil, unavailable(err)
	}
	out := make([]Suggestion, 0, len(r.Hits))
	for _, h := range r.Hits {
		d := h.Document
		field, text := "q", d.Q
		sg := Suggestion{Kind: "query"}
		if h.SearchIndex == 1 {
			field, text = "display_name", d.DisplayName
			sg.Kind = "creator"
			sg.Creator = &CreatorSummary{Slug: d.Slug, DisplayName: d.DisplayName, AvatarURL: mediaURL(d.AvatarKey)}
		}
		sg.Text = text
		sg.Highlighted = html.EscapeString(text)
		if hl, ok := h.snippets()[field]; ok {
			sg.Highlighted = markup.Replace(html.EscapeString(hl))
		}
		out = append(out, sg)
	}
	return &SuggestResponse{Suggestions: out}, nil
}

type PopularQueries struct {
	// Most searched queries first, aggregated by Typesense analytics.
	Queries []string `json:"queries"`
}

// Popular lists trending searches, e.g. for an empty search box.
//
//encore:api public method=GET path=/search/popular
func (s *Service) Popular(ctx context.Context) (*PopularQueries, error) {
	r, err := search[struct {
		Q string `json:"q"`
	}](ctx, s.ts, query{
		Collection: s.c.Queries,
		Q:          "*",
		SortBy:     "count:desc",
		PerPage:    10,
		UseCache:   true,
		CacheTTL:   300,
	})
	if err != nil {
		return nil, unavailable(err)
	}
	out := make([]string, len(r.Hits))
	for i, h := range r.Hits {
		out[i] = h.Document.Q
	}
	return &PopularQueries{Queries: out}, nil
}

type ClickParams struct {
	// "creator" or "post".
	Kind string `json:"kind"`
	// The hit's id.
	ID string `json:"id"`
}

func (p *ClickParams) Validate() error {
	if p.Kind != "creator" && p.Kind != "post" {
		return invalid("kind must be creator or post")
	}
	if p.ID == "" || len(p.ID) > 64 {
		return invalid("invalid id")
	}
	return nil
}

// Click records that a search or recommendation result was opened.
// Typesense counts clicks into the document's popularity, which ranks
// often-picked results higher. Auth is optional.
//
//encore:api public method=POST path=/search/clicks
func (s *Service) Click(ctx context.Context, p *ClickParams) error {
	rule := creatorClicks
	if p.Kind == "post" {
		rule = postClicks
	}
	err := s.ts.do(ctx, http.MethodPost, "/analytics/events", nil, map[string]any{
		"name":       rule,
		"event_type": "click",
		"data":       map[string]string{"doc_id": p.ID, "user_id": analyticsUser()},
	}, nil)
	if err != nil {
		return unavailable(err)
	}
	return nil
}
