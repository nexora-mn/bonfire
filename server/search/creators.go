package search

import (
	"context"
	"fmt"
	"slices"
	"strings"
)

const (
	creatorsPerPage = 24
	// Deep pages cost Typesense more and nobody reads them.
	maxPage = 40
	// Vector matches farther than this are dropped from hybrid results, so
	// a query with no real match doesn't return arbitrary "similar" pages.
	// Cosine distance, tuned for the e5 family of models.
	hybridMaxDistance = 0.2
)

type priceBand struct {
	Name     string
	Min, Max int64 // [Min, Max) in MNT; Max 0 means no upper bound
}

// priceBands bucket creators by their cheapest tier.
var priceBands = []priceBand{
	{"under10k", 1, 10_000},
	{"10k-50k", 10_000, 50_000},
	{"over50k", 50_000, 0},
}

func (b priceBand) facet() string {
	if b.Max == 0 {
		return fmt.Sprintf("%s:[%d,]", b.Name, b.Min)
	}
	return fmt.Sprintf("%s:[%d,%d]", b.Name, b.Min, b.Max)
}

func (b priceBand) filter() string {
	if b.Max == 0 {
		return fmt.Sprintf("min_tier_price:>=%d", b.Min)
	}
	return fmt.Sprintf("min_tier_price:[%d..%d]", b.Min, b.Max-1)
}

var creatorSorts = map[string]string{
	// Bucketing groups near-equal relevance, then clicks and recent posts
	// decide the order inside each bucket.
	"relevance": "_text_match(buckets: 10):desc,popularity(missing_values: last):desc,last_post_at:desc",
	"popular":   "popularity(missing_values: last):desc,_text_match:desc",
	"newest":    "created_at:desc,_text_match:desc",
	"active":    "last_post_at:desc,_text_match:desc",
}

type CreatorSearchParams struct {
	// Matches names, page URLs, tier names and about text, with typo
	// tolerance and Mongolian/English synonyms. Empty lists everyone.
	Q string `query:"q"`
	// Link platforms (e.g. "youtube"); creators with any of them match.
	Platforms []string `query:"platform"`
	// Only creators with membership tiers.
	HasTiers bool `query:"hasTiers"`
	// Only creators accepting one-time support.
	OneTime bool `query:"oneTime"`
	// Cheapest-tier band: "under10k", "10k-50k" or "over50k".
	Price string `query:"price"`
	// "relevance" (default), "popular", "newest" or "active".
	Sort string `query:"sort"`
	// Zero-based page number.
	Page int `query:"page"`
}

func (p *CreatorSearchParams) Validate() error {
	if len(p.Q) > 200 {
		return invalid("query is too long")
	}
	if p.Sort == "" {
		p.Sort = "relevance"
	}
	if _, ok := creatorSorts[p.Sort]; !ok {
		return invalid("unknown sort")
	}
	if p.Price != "" && !slices.ContainsFunc(priceBands, func(b priceBand) bool { return b.Name == p.Price }) {
		return invalid("unknown price band")
	}
	if len(p.Platforms) > 10 {
		return invalid("too many platforms")
	}
	if p.Page < 0 || p.Page > maxPage {
		return invalid(fmt.Sprintf("page must be between 0 and %d", maxPage))
	}
	return nil
}

type CreatorResults struct {
	Creators []CreatorHit `json:"creators"`
	Found    int          `json:"found"`
	HasMore  bool         `json:"hasMore"`
	// Counts per facet value. Each facet ignores its own filter, so picking
	// one platform still shows how many creators the others have.
	Facets []Facet `json:"facets"`
}

// creatorQuery is the shared ranking setup for creator searches.
func (s *Service) creatorQuery(q string) query {
	q = strings.TrimSpace(q)
	if q == "" {
		q = "*"
	}
	out := query{
		Collection: s.c.Creators,
		Q:          q,
		QueryBy:    "display_name,slug,tier_names,about",
		// A name match outranks the same word buried in the about text.
		QueryByWeights: "8,6,3,2",
		TextMatchType:  "max_weight",
		// Slugs also match in the middle ("music" → saraa_music), but only
		// when nothing matches normally.
		Infix: "off,fallback,off,off",
		// Slugs are short and deliberate; fewer typos avoids odd matches.
		NumTypos:      "2,1,2,2",
		Stopwords:     stopwordsSet,
		ExcludeFields: "embedding",
		UseCache:      true,
		CacheTTL:      30,
	}
	if s.semantic() {
		// Hybrid search: the query is also embedded and matched by meaning,
		// then fused with the keyword ranking. Typesense skips the embedding
		// field's slot in the per-field lists, and ignores it for "*".
		out.QueryBy += ",embedding"
		out.QueryByWeights += ",1"
		out.Infix += ",off"
		out.NumTypos += ",0"
		out.VectorQuery = fmt.Sprintf("embedding:([], distance_threshold: %g)", hybridMaxDistance)
		out.RerankHybridMatches = true
	}
	return withHighlights(out)
}

// facetFilter is one facet and the filter the request applies to it.
type facetFilter struct {
	facetBy string
	filter  string
}

// SearchCreators finds creators with filters, facets and sorting.
//
//encore:api public method=GET path=/search/creators
func (s *Service) SearchCreators(ctx context.Context, p *CreatorSearchParams) (*CreatorResults, error) {
	facets := []facetFilter{
		{facetBy: "link_platforms"},
		{facetBy: "has_tiers"},
		{facetBy: "one_time_enabled"},
		{facetBy: "min_tier_price(" + joinBands() + ")"},
	}
	if len(p.Platforms) > 0 {
		quoted := make([]string, len(p.Platforms))
		for i, v := range p.Platforms {
			quoted[i] = quote(v)
		}
		facets[0].filter = "link_platforms:=[" + strings.Join(quoted, ",") + "]"
	}
	if p.HasTiers {
		facets[1].filter = "has_tiers:true"
	}
	if p.OneTime {
		facets[2].filter = "one_time_enabled:true"
	}
	for _, b := range priceBands {
		if b.Name == p.Price {
			facets[3].filter = b.filter()
		}
	}

	base := s.creatorQuery(p.Q)
	filterExcept := func(skip int) string {
		clauses := make([]string, 0, len(facets))
		for i, f := range facets {
			if i != skip {
				clauses = append(clauses, f.filter)
			}
		}
		return and(clauses...)
	}

	main := base
	main.FilterBy = filterExcept(-1)
	main.SortBy = creatorSorts[p.Sort]
	main.Page = p.Page + 1
	main.PerPage = creatorsPerPage
	facetBys := make([]string, len(facets))
	for i, f := range facets {
		facetBys[i] = f.facetBy
	}
	main.FacetBy = strings.Join(facetBys, ",")
	main.MaxFacetValues = 20

	// Disjunctive faceting: for each facet with an active filter, count
	// its values as if that filter were not applied.
	searches := []query{main}
	for i, f := range facets {
		if f.filter == "" {
			continue
		}
		fq := base
		fq.FilterBy = filterExcept(i)
		fq.FacetBy = f.facetBy
		fq.MaxFacetValues = 20
		fq.PerPage = 0
		fq.EnableAnalytics = new(bool)
		searches = append(searches, fq)
	}

	raw, err := s.ts.multiSearch(withAnalyticsUser(ctx, analyticsUser()), searches...)
	if err != nil {
		return nil, unavailable(err)
	}
	r, err := decodeResult[creatorDoc](raw[0])
	if err != nil {
		return nil, unavailable(err)
	}
	counts := r.FacetCounts
	for _, fraw := range raw[1:] {
		fr, err := decodeResult[creatorDoc](fraw)
		if err != nil {
			return nil, unavailable(err)
		}
		for _, fc := range fr.FacetCounts {
			for j := range counts {
				if counts[j].FieldName == fc.FieldName {
					counts[j] = fc
				}
			}
		}
	}

	hits := make([]CreatorHit, len(r.Hits))
	for i, h := range r.Hits {
		hits[i] = toCreatorHit(h)
	}
	return &CreatorResults{
		Creators: hits,
		Found:    r.Found,
		HasMore:  (p.Page+1)*creatorsPerPage < r.Found && p.Page < maxPage,
		Facets:   toFacets(counts),
	}, nil
}

func joinBands() string {
	parts := make([]string, len(priceBands))
	for i, b := range priceBands {
		parts[i] = b.facet()
	}
	return strings.Join(parts, ", ")
}

// analyticsUser is who popular-query analytics counts a search for.
func analyticsUser() string {
	if me := viewer(); me != nil {
		return me.String()
	}
	return "anonymous"
}
