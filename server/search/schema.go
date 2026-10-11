package search

import (
	"context"
	"fmt"
	"net/http"
	"regexp"

	"encore.dev/rlog"
)

// schemaVersion is part of the collection names. Bump it after changing a
// schema below: the next start creates fresh collections and backfills
// them, and the nightly reindex drops the old ones.
const schemaVersion = 2

type collections struct {
	Creators string
	Posts    string
	// Filled by Typesense analytics: popular queries feed autocomplete,
	// no-hit queries show what people look for but don't find.
	Queries string
	NoHits  string
}

// textLocale is set on every text field. Without it Typesense doesn't
// lowercase Cyrillic, so "зураач" would only reach "Зураач" as a typo.
// Synonyms and stopwords must carry it too, or they skip these fields.
const textLocale = "mn"

// Typesense-wide resources, upserted on every start.
const (
	synonymSet       = "bonfire"
	stopwordsSet     = "mn"
	creatorCurations = "creators"
	postCurations    = "posts"
)

// collectionNames gives text-only and semantic collections different names,
// so turning embeddings on or off rebuilds instead of mixing schemas.
func collectionNames(model string) collections {
	suffix := ""
	if model == "" {
		suffix = "_text"
	}
	return collections{
		Creators: fmt.Sprintf("creators_v%d%s", schemaVersion, suffix),
		Posts:    fmt.Sprintf("posts_v%d%s", schemaVersion, suffix),
		Queries:  "search_queries",
		NoHits:   "search_nohits",
	}
}

// staleCollection matches versioned collections this service created.
var staleCollection = regexp.MustCompile(`^(creators|posts)_v\d+(_text)?$`)

type field struct {
	Name       string `json:"name"`
	Type       string `json:"type"`
	Facet      bool   `json:"facet,omitempty"`
	Optional   bool   `json:"optional,omitempty"`
	Infix      bool   `json:"infix,omitempty"`
	RangeIndex bool   `json:"range_index,omitempty"`
	Locale     string `json:"locale,omitempty"`
	// Stored for display only, not searchable (nil means indexed).
	Index          *bool  `json:"index,omitempty"`
	Reference      string `json:"reference,omitempty"`
	AsyncReference bool   `json:"async_reference,omitempty"`
	Embed          *embed `json:"embed,omitempty"`
}

type embed struct {
	From        []string `json:"from"`
	ModelConfig struct {
		ModelName string `json:"model_name"`
	} `json:"model_config"`
}

type collectionSchema struct {
	Name                string   `json:"name"`
	Fields              []field  `json:"fields"`
	DefaultSortingField string   `json:"default_sorting_field,omitempty"`
	TokenSeparators     []string `json:"token_separators,omitempty"`
	SynonymSets         []string `json:"synonym_sets,omitempty"`
	CurationSets        []string `json:"curation_sets,omitempty"`
}

var notIndexed = new(bool)

// embeddingField auto-embeds `from` with the configured built-in model.
// Typesense computes vectors on write and for the query text on search.
func embeddingField(from ...string) field {
	e := &embed{From: from}
	e.ModelConfig.ModelName = cfg.EmbeddingModel()
	return field{Name: "embedding", Type: "float[]", Embed: e}
}

func (s *Service) creatorSchema() collectionSchema {
	fields := []field{
		// Infix lets "music" find the page "saraa_music".
		{Name: "slug", Type: "string", Infix: true, Locale: textLocale},
		{Name: "display_name", Type: "string", Locale: textLocale},
		{Name: "about", Type: "string", Locale: textLocale},
		{Name: "tier_names", Type: "string[]", Locale: textLocale},
		{Name: "link_platforms", Type: "string[]", Facet: true},
		{Name: "avatar_key", Type: "string", Optional: true, Index: notIndexed},
		{Name: "cover_key", Type: "string", Optional: true, Index: notIndexed},
		{Name: "has_tiers", Type: "bool", Facet: true},
		// Range-faceted into price bands; 0 means no tiers.
		{Name: "min_tier_price", Type: "int64", Facet: true, RangeIndex: true},
		{Name: "one_time_enabled", Type: "bool", Facet: true},
		{Name: "post_count", Type: "int32"},
		// Click counter, maintained by the creator-clicks analytics rule.
		// Never sent by the indexer, so reindexing keeps it.
		{Name: "popularity", Type: "int32", Optional: true},
		{Name: "created_at", Type: "int64"},
		{Name: "last_post_at", Type: "int64"},
		{Name: "indexed_at", Type: "int64"},
	}
	if s.semantic() {
		fields = append(fields, embeddingField("display_name", "about", "tier_names"))
	}
	return collectionSchema{
		Name:                s.c.Creators,
		Fields:              fields,
		DefaultSortingField: "created_at",
		TokenSeparators:     []string{"-", "_", "."},
		SynonymSets:         []string{synonymSet},
		CurationSets:        []string{creatorCurations},
	}
}

func (s *Service) postSchema() collectionSchema {
	fields := []field{
		// Joins each post to its creator, so hits carry the creator's current
		// name and avatar, and filters can match creator fields. Deleting a
		// creator document cascades to its posts.
		{Name: "creator_id", Type: "string", Reference: s.c.Creators + ".id", AsyncReference: true, Optional: true},
		{Name: "title", Type: "string", Locale: textLocale},
		// Empty for members-only posts, so search never leaks locked content.
		{Name: "body", Type: "string", Locale: textLocale},
		{Name: "visibility", Type: "string", Facet: true},
		{Name: "has_image", Type: "bool", Facet: true},
		{Name: "image_key", Type: "string", Optional: true, Index: notIndexed},
		{Name: "like_count", Type: "int32"},
		{Name: "popularity", Type: "int32", Optional: true},
		{Name: "created_at", Type: "int64"},
		{Name: "indexed_at", Type: "int64"},
	}
	if s.semantic() {
		fields = append(fields, embeddingField("title", "body"))
	}
	return collectionSchema{
		Name:                s.c.Posts,
		Fields:              fields,
		DefaultSortingField: "created_at",
		SynonymSets:         []string{synonymSet},
		CurationSets:        []string{postCurations},
	}
}

func querySchema(name string) collectionSchema {
	return collectionSchema{
		Name: name,
		Fields: []field{
			{Name: "q", Type: "string", Locale: textLocale},
			{Name: "count", Type: "int32"},
		},
		DefaultSortingField: "count",
	}
}

type synonym struct {
	ID       string   `json:"id"`
	Synonyms []string `json:"synonyms"`
	Locale   string   `json:"locale"`
}

// synonyms bridge Mongolian and English names for common creator topics.
var synonyms = map[string][]string{
	"art":       {"зураач", "уран зураг", "artist", "art", "illustration"},
	"music":     {"хөгжим", "дуу", "дуучин", "music", "musician", "singer"},
	"podcast":   {"подкаст", "podcast", "ярилцлага"},
	"gaming":    {"тоглоом", "game", "gaming", "gamer", "стрим", "stream"},
	"video":     {"видео", "video", "vlog", "влог", "youtube"},
	"writing":   {"зохиолч", "зохиол", "writer", "author", "writing", "шүлэг", "poetry"},
	"photo":     {"гэрэл зураг", "фото", "photo", "photography", "photographer"},
	"food":      {"хоол", "food", "cooking", "жор", "recipe"},
	"travel":    {"аялал", "travel", "аялагч"},
	"fitness":   {"спорт", "фитнес", "fitness", "sports", "дасгал", "workout"},
	"tech":      {"программ", "програм", "код", "programming", "coding", "developer", "tech"},
	"education": {"боловсрол", "хичээл", "education", "tutorial", "сургалт", "course"},
	"comedy":    {"хошин", "инээдэм", "comedy", "funny"},
	"design":    {"дизайн", "design", "designer", "график", "graphic"},
	"fashion":   {"загвар", "хувцас", "fashion", "style"},
}

func synonymItems() []synonym {
	items := make([]synonym, 0, len(synonyms))
	for id, words := range synonyms {
		items = append(items, synonym{ID: id, Synonyms: words, Locale: textLocale})
	}
	return items
}

// stopwords are dropped from queries so "хөгжим ба дуу" ranks on content words.
var stopwords = []string{
	"ба", "болон", "буюу", "бол", "нь", "юм", "энэ", "тэр", "эдгээр", "тэдгээр",
	"гэх", "гэж", "мөн", "ч", "л", "дээр", "доор", "дотор", "руу", "рүү", "их",
}

type curation struct {
	ID   string `json:"id"`
	Rule struct {
		Query string `json:"query"`
		Match string `json:"match"`
	} `json:"rule"`
	RemoveMatchedTokens bool   `json:"remove_matched_tokens"`
	FilterBy            string `json:"filter_by,omitempty"`
	SortBy              string `json:"sort_by,omitempty"`
}

// dynamic turns intent words in a query into filters or sorting: "шинэ
// зураач" searches "зураач" sorted newest first.
func dynamic(id, word, filterBy, sortBy string) curation {
	c := curation{ID: id, RemoveMatchedTokens: true, FilterBy: filterBy, SortBy: sortBy}
	c.Rule.Query, c.Rule.Match = word, "contains"
	return c
}

var creatorCurationItems = []curation{
	dynamic("newest-mn", "шинэ", "", "created_at:desc"),
	dynamic("newest-en", "new", "", "created_at:desc"),
	dynamic("popular-mn", "алдартай", "", "popularity(missing_values: last):desc"),
	dynamic("popular-en", "popular", "", "popularity(missing_values: last):desc"),
	dynamic("active-mn", "идэвхтэй", "", "last_post_at:desc"),
	dynamic("membership-mn", "гишүүнчлэл", "has_tiers:true", ""),
	dynamic("membership-en", "membership", "has_tiers:true", ""),
}

var postCurationItems = []curation{
	dynamic("latest-mn", "шинэ", "", "created_at:desc"),
	dynamic("latest-en", "latest", "", "created_at:desc"),
	dynamic("liked-mn", "алдартай", "", "like_count:desc"),
	dynamic("members-mn", "гишүүдэд", "visibility:=members", ""),
	dynamic("members-en", "members", "visibility:=members", ""),
}

type analyticsRule struct {
	Name       string         `json:"name"`
	Type       string         `json:"type"`
	Collection string         `json:"collection"`
	EventType  string         `json:"event_type"`
	Params     map[string]any `json:"params"`
}

// Rule names that click events are sent to.
const (
	creatorClicks = "creator-clicks"
	postClicks    = "post-clicks"
)

func (s *Service) analyticsRules() []analyticsRule {
	counter := func(name, collection string) analyticsRule {
		return analyticsRule{
			Name: name, Type: "counter", Collection: collection, EventType: "click",
			Params: map[string]any{"destination_collection": collection, "counter_field": "popularity", "weight": 1},
		}
	}
	// Every search page queries creators, so capturing that collection's
	// searches covers all queries.
	queries := func(name, kind, dest string) analyticsRule {
		return analyticsRule{
			Name: name, Type: kind, Collection: s.c.Creators, EventType: "search",
			Params: map[string]any{"destination_collection": dest, "limit": 1000, "capture_search_requests": true},
		}
	}
	return []analyticsRule{
		queries("popular-queries", "popular_queries", s.c.Queries),
		queries("nohits-queries", "nohits_queries", s.c.NoHits),
		counter(creatorClicks, s.c.Creators),
		counter(postClicks, s.c.Posts),
	}
}

// setup makes Typesense match this file: sets first (collections link to
// them), then collections, then analytics rules. Freshly created creator
// and post collections are backfilled from Postgres.
func (s *Service) setup(ctx context.Context) error {
	puts := []struct {
		path string
		body any
	}{
		{"/synonym_sets/" + synonymSet, map[string]any{"items": synonymItems()}},
		{"/stopwords/" + stopwordsSet, map[string]any{"stopwords": stopwords, "locale": textLocale}},
		{"/curation_sets/" + creatorCurations, map[string]any{"items": creatorCurationItems}},
		{"/curation_sets/" + postCurations, map[string]any{"items": postCurationItems}},
	}
	for _, p := range puts {
		if err := s.ts.do(ctx, http.MethodPut, p.path, nil, p.body, nil); err != nil {
			return fmt.Errorf("upsert %s: %w", p.path, err)
		}
	}

	created := false
	for _, schema := range []collectionSchema{
		querySchema(s.c.Queries), querySchema(s.c.NoHits), s.creatorSchema(), s.postSchema(),
	} {
		ok, err := s.ensureCollection(ctx, schema)
		if err != nil {
			return err
		}
		created = created || (ok && (schema.Name == s.c.Creators || schema.Name == s.c.Posts))
	}

	// Analytics needs --enable-search-analytics on self-hosted servers;
	// search works without it, so a failure here is only logged.
	for _, r := range s.analyticsRules() {
		if err := s.ts.do(ctx, http.MethodPut, "/analytics/rules/"+r.Name, nil, r, nil); err != nil {
			rlog.Warn("typesense analytics rule not applied", "rule", r.Name, "err", err)
		}
	}

	if created {
		rlog.Info("backfilling new search collections", "creators", s.c.Creators, "posts", s.c.Posts)
		return s.reindex(ctx)
	}
	return nil
}

// ensureCollection creates the collection unless it exists, reporting
// whether it did. Another instance creating it first counts as existing.
func (s *Service) ensureCollection(ctx context.Context, schema collectionSchema) (bool, error) {
	err := s.ts.do(ctx, http.MethodGet, "/collections/"+schema.Name, nil, nil, nil)
	if err == nil {
		return false, nil
	} else if !hasStatus(err, http.StatusNotFound) {
		return false, err
	}
	err = s.ts.do(ctx, http.MethodPost, "/collections", nil, schema, nil)
	if hasStatus(err, http.StatusConflict) {
		return false, nil
	} else if err != nil {
		return false, fmt.Errorf("create collection %s: %w", schema.Name, err)
	}
	return true, nil
}
