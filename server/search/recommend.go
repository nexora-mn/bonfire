package search

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"

	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

const (
	recommendSize = 12
	// Likes excluded from recommendations; the most recent tasteSeeds of
	// them also shape the taste vector.
	excludeLimit = 200
	tasteSeeds   = 50
	// Nearest neighbours considered before filters and paging.
	vectorK = 100
	// Recommended posts are at most this old.
	postFreshness = 180 * 24 * time.Hour
	// Words of a creator's about text or a post used for keyword lookalikes.
	likeThisWords = 40
)

type CreatorList struct {
	Creators []CreatorHit `json:"creators"`
}

type PostList struct {
	Posts []PostHit `json:"posts"`
}

// SimilarCreators returns creators like the given one: nearest by meaning
// when embeddings are on, otherwise by shared words in their about text.
//
//encore:api public method=GET path=/creators/:slug/similar
func (s *Service) SimilarCreators(ctx context.Context, slug string) (*CreatorList, error) {
	c, err := s.q.GetCreatorBySlug(ctx, slug)
	if persistence.IsNotFound(err) {
		return nil, &errs.Error{Code: errs.NotFound, Message: "creator not found"}
	} else if err != nil {
		return nil, err
	}
	q := query{
		Collection:      s.c.Creators,
		Q:               "*",
		ExcludeFields:   "embedding",
		PerPage:         recommendSize,
		EnableAnalytics: new(bool),
	}
	switch text := firstWords(c.About, likeThisWords); {
	case s.semantic():
		// The creator's own document is left out of the results.
		q.VectorQuery = fmt.Sprintf("embedding:([], id: %s, k: %d)", c.ID, vectorK)
	case text != "":
		q = s.likeThis(q, text, "about,tier_names,display_name")
		q.FilterBy = "id:!=" + c.ID.String()
	default:
		q.SortBy = "popularity(missing_values: last):desc,last_post_at:desc"
		q.FilterBy = "id:!=" + c.ID.String()
	}

	r, err := search[creatorDoc](ctx, s.ts, q)
	if err == nil && len(r.Hits) == 0 && q.Q != "*" {
		// Nothing shares a word with this page; popular pages beat nothing.
		q.Q, q.QueryBy, q.DropTokensThreshold = "*", "", nil
		q.SortBy = "popularity(missing_values: last):desc,last_post_at:desc"
		r, err = search[creatorDoc](ctx, s.ts, q)
	}
	if err != nil {
		return nil, unavailable(err)
	}
	hits := make([]CreatorHit, len(r.Hits))
	for i, h := range r.Hits {
		hits[i] = toCreatorHit(h)
	}
	return &CreatorList{Creators: hits}, nil
}

// SimilarPosts returns posts like the given one, from any creator.
//
//encore:api public method=GET path=/posts/:id/similar
func (s *Service) SimilarPosts(ctx context.Context, id uuid.UUID) (*PostList, error) {
	rows, err := s.q.PostsForIndex(ctx, persistence.PostsForIndexParams{Single: &id, BatchSize: 1})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, &errs.Error{Code: errs.NotFound, Message: "post not found"}
	}
	q := query{
		Collection:      s.c.Posts,
		Q:               "*",
		IncludeFields:   s.creatorJoin(),
		ExcludeFields:   "embedding",
		PerPage:         recommendSize,
		EnableAnalytics: new(bool),
	}
	if s.semantic() {
		q.VectorQuery = fmt.Sprintf("embedding:([], id: %s, k: %d)", id, vectorK)
	} else {
		// Same visibility rule as indexing: locked bodies aren't used.
		d := toPostDoc(rows[0], 0)
		q = s.likeThis(q, firstWords(d.Title+" "+d.Body, likeThisWords), "title,body")
		q.FilterBy = "id:!=" + id.String()
	}

	r, err := search[postDoc](ctx, s.ts, q)
	if err == nil && len(r.Hits) == 0 && q.Q != "*" {
		q.Q, q.QueryBy, q.DropTokensThreshold = "*", "", nil
		q.SortBy = "like_count:desc,created_at:desc"
		r, err = search[postDoc](ctx, s.ts, q)
	}
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
	return &PostList{Posts: hits}, nil
}

// likeThis is the keyword fallback for lookalikes: search with the source
// text and let Typesense drop words until enough documents match, so the
// best results share the most words with it.
func (s *Service) likeThis(q query, text, queryBy string) query {
	q.Q = text
	q.QueryBy = queryBy
	q.Prefix = "false"
	q.Stopwords = stopwordsSet
	q.DropTokensThreshold = new(int)
	*q.DropTokensThreshold = recommendSize
	return q
}

type Recommendations struct {
	Creators []CreatorHit `json:"creators"`
	Posts    []PostHit    `json:"posts"`
}

// Recommend suggests creators and posts to read. For signed-in users with
// likes it ranks by closeness to the average meaning of what they liked,
// leaving out posts they already liked. Everyone else gets what's popular.
//
//encore:api public method=GET path=/recommendations
func (s *Service) Recommend(ctx context.Context) (*Recommendations, error) {
	var liked []uuid.UUID
	if me := viewer(); me != nil {
		var err error
		if liked, err = s.q.RecentLikes(ctx, persistence.RecentLikesParams{UserID: *me, Limit: excludeLimit}); err != nil {
			return nil, err
		}
	}

	cq := query{
		Collection:      s.c.Creators,
		Q:               "*",
		ExcludeFields:   "embedding",
		PerPage:         recommendSize,
		EnableAnalytics: new(bool),
	}
	pq := query{
		Collection:    s.c.Posts,
		Q:             "*",
		IncludeFields: s.creatorJoin(),
		ExcludeFields: "embedding",
		PerPage:       recommendSize,
		FilterBy: and(
			ifSet(len(liked) > 0, "id:!="+idList(liked)),
			"created_at:>="+strconv.FormatInt(time.Now().Add(-postFreshness).Unix(), 10),
		),
		EnableAnalytics: new(bool),
	}
	taste, err := s.tasteVector(ctx, liked[:min(len(liked), tasteSeeds)])
	if err != nil {
		return nil, unavailable(err)
	}
	if taste != "" {
		vq := fmt.Sprintf("embedding:([%s], k: %d)", taste, vectorK)
		cq.VectorQuery, pq.VectorQuery = vq, vq
	} else {
		cq.SortBy = "popularity(missing_values: last):desc,last_post_at:desc"
		pq.SortBy = "like_count:desc,popularity(missing_values: last):desc,created_at:desc"
		pq.FilterBy = and(pq.FilterBy, "visibility:=public")
	}

	raw, err := s.ts.multiSearch(ctx, cq, pq)
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
	out := &Recommendations{
		Creators: make([]CreatorHit, len(cr.Hits)),
		Posts:    make([]PostHit, len(pr.Hits)),
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

// tasteVector averages the embeddings of the given posts into one query
// vector, formatted for vector_query. Empty when embeddings are off or
// there is nothing to average.
func (s *Service) tasteVector(ctx context.Context, posts []uuid.UUID) (string, error) {
	if !s.semantic() || len(posts) == 0 {
		return "", nil
	}
	r, err := search[struct {
		Embedding []float64 `json:"embedding"`
	}](ctx, s.ts, query{
		Collection:      s.c.Posts,
		Q:               "*",
		FilterBy:        "id:" + idList(posts),
		IncludeFields:   "embedding",
		PerPage:         len(posts),
		EnableAnalytics: new(bool),
	})
	if err != nil {
		return "", err
	}

	var sum []float64
	for _, h := range r.Hits {
		v := h.Document.Embedding
		if sum == nil {
			sum = make([]float64, len(v))
		}
		// Unit-length first, so every seed counts equally.
		if n := norm(v); n > 0 && len(v) == len(sum) {
			for i, x := range v {
				sum[i] += x / n
			}
		}
	}
	n := norm(sum)
	if n == 0 {
		return "", nil
	}
	parts := make([]string, len(sum))
	for i, x := range sum {
		parts[i] = strconv.FormatFloat(x/n, 'f', 6, 64)
	}
	return strings.Join(parts, ","), nil
}

func norm(v []float64) float64 {
	var sq float64
	for _, x := range v {
		sq += x * x
	}
	return math.Sqrt(sq)
}

func firstWords(s string, n int) string {
	words := strings.Fields(s)
	return strings.Join(words[:min(len(words), n)], " ")
}
