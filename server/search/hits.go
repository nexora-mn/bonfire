package search

import (
	"context"
	"html"
	"strings"
	"time"
	"unicode/utf8"

	"encore.app/persistence"
	"encore.dev/types/uuid"
)

type CreatorSummary struct {
	Slug        string  `json:"slug"`
	DisplayName string  `json:"displayName"`
	AvatarURL   *string `json:"avatarUrl"`
}

type CreatorHit struct {
	ID          string  `json:"id"`
	Slug        string  `json:"slug"`
	DisplayName string  `json:"displayName"`
	About       string  `json:"about"`
	AvatarURL   *string `json:"avatarUrl"`
	CoverURL    *string `json:"coverUrl"`
	// Cheapest active membership tier in MNT; 0 when there are no tiers.
	MinTierPrice int64 `json:"minTierPrice"`
	PostCount    int64 `json:"postCount"`
	// Matched text keyed by field (displayName, slug, about). HTML-escaped,
	// with matches wrapped in <mark>, so it can be rendered as HTML.
	Highlights map[string]string `json:"highlights"`
}

type PostHit struct {
	ID      string         `json:"id"`
	Creator CreatorSummary `json:"creator"`
	Title   string         `json:"title"`
	// The part of the body around the match, or its start. HTML-escaped,
	// matches wrapped in <mark>. Empty for locked posts.
	Snippet    string  `json:"snippet"`
	ImageURL   *string `json:"imageUrl"`
	Visibility string  `json:"visibility"`
	Locked     bool    `json:"locked"`
	LikeCount  int64   `json:"likeCount"`
	// Whether the signed-in viewer liked it; false when anonymous.
	Liked     bool      `json:"liked"`
	CreatedAt time.Time `json:"createdAt"`
	// Matched text keyed by field (title, body), like CreatorHit.Highlights.
	Highlights map[string]string `json:"highlights"`
}

type Facet struct {
	Field  string       `json:"field"`
	Values []FacetValue `json:"values"`
}

type FacetValue struct {
	Value string `json:"value"`
	Count int    `json:"count"`
}

// Typesense wraps matches in these; they can't appear in typed text, so
// after escaping the snippet they become the only markup in it.
const (
	markStart = "\x01"
	markEnd   = "\x02"
)

var markup = strings.NewReplacer(markStart, "<mark>", markEnd, "</mark>")

// apiFields renames Typesense fields to the API's JSON names.
var apiFields = map[string]string{
	"display_name": "displayName",
	"slug":         "slug",
	"about":        "about",
	"title":        "title",
	"body":         "body",
}

func highlights[T any](h hit[T]) map[string]string {
	out := map[string]string{}
	for field, snippet := range h.snippets() {
		if name, ok := apiFields[field]; ok {
			out[name] = markup.Replace(html.EscapeString(snippet))
		}
	}
	return out
}

func withHighlights(q query) query {
	q.HighlightStartTag, q.HighlightEndTag = markStart, markEnd
	// Words of context on each side of a match in long fields.
	q.HighlightAffixNumTokens = 12
	return q
}

func toCreatorHit(h hit[creatorDoc]) CreatorHit {
	d := h.Document
	return CreatorHit{
		ID:            d.ID,
		Slug:          d.Slug,
		DisplayName:   d.DisplayName,
		About:         d.About,
		AvatarURL:     mediaURL(d.AvatarKey),
		CoverURL:      mediaURL(d.CoverKey),
		MinTierPrice:  d.MinTierPrice,
		PostCount:     d.PostCount,
		Highlights:    highlights(h),
	}
}

const snippetRunes = 240

func toPostHit(h hit[postDoc]) PostHit {
	d := h.Document
	p := PostHit{
		ID:         d.ID,
		Title:      d.Title,
		ImageURL:   mediaURL(d.ImageKey),
		Visibility: d.Visibility,
		Locked:     d.Visibility == "members",
		LikeCount:  d.LikeCount,
		CreatedAt:  time.Unix(d.CreatedAt, 0).UTC(),
		Highlights: highlights(h),
	}
	if d.Creator != nil {
		p.Creator = CreatorSummary{
			Slug:        d.Creator.Slug,
			DisplayName: d.Creator.DisplayName,
			AvatarURL:   mediaURL(d.Creator.AvatarKey),
		}
	}
	if s, ok := p.Highlights["body"]; ok {
		p.Snippet = s
	} else {
		p.Snippet = html.EscapeString(truncate(d.Body, snippetRunes))
	}
	return p
}

func truncate(s string, n int) string {
	if utf8.RuneCountInString(s) <= n {
		return s
	}
	r := []rune(s)
	return strings.TrimSpace(string(r[:n])) + "…"
}

func toFacets(counts []facetCount) []Facet {
	out := make([]Facet, len(counts))
	for i, fc := range counts {
		f := Facet{Field: apiFacetNames[fc.FieldName], Values: make([]FacetValue, len(fc.Counts))}
		for j, c := range fc.Counts {
			f.Values[j] = FacetValue{Value: c.Value, Count: c.Count}
		}
		out[i] = f
	}
	return out
}

var apiFacetNames = map[string]string{
	"link_platforms":   "platform",
	"min_tier_price":   "price",
	"has_tiers":        "hasTiers",
	"one_time_enabled": "oneTime",
	"visibility":       "visibility",
	"has_image":        "hasImage",
}

// markLiked sets Liked on hits the viewer liked.
func (s *Service) markLiked(ctx context.Context, hits []PostHit) error {
	me := viewer()
	if me == nil || len(hits) == 0 {
		return nil
	}
	ids := make([]uuid.UUID, 0, len(hits))
	for _, h := range hits {
		if id, err := uuid.FromString(h.ID); err == nil {
			ids = append(ids, id)
		}
	}
	liked, err := s.q.LikedAmong(ctx, persistence.LikedAmongParams{UserID: *me, Ids: ids})
	if err != nil {
		return err
	}
	set := make(map[string]bool, len(liked))
	for _, id := range liked {
		set[id.String()] = true
	}
	for i := range hits {
		hits[i].Liked = set[hits[i].ID]
	}
	return nil
}

// quote makes user input a literal Typesense filter value.
func quote(v string) string {
	return "`" + strings.ReplaceAll(v, "`", "") + "`"
}

// idList formats IDs for filters like `id:!=[...]`.
func idList[T interface{ String() string }](ids []T) string {
	parts := make([]string, len(ids))
	for i, id := range ids {
		parts[i] = id.String()
	}
	return "[" + strings.Join(parts, ",") + "]"
}

// and joins the non-empty filter clauses.
func and(clauses ...string) string {
	out := clauses[:0:0]
	for _, c := range clauses {
		if c != "" {
			out = append(out, c)
		}
	}
	return strings.Join(out, " && ")
}
