package search

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// typesense is a small client for the Typesense v30 REST API. The official
// Go SDK either predates v30 (synonym and curation sets, the new analytics
// API) or is still an alpha, and its untyped hits would need re-decoding
// anyway; here hits decode straight into our document structs.
type typesense struct {
	base string
	key  string
	http *http.Client
}

type apiError struct {
	Status  int
	Message string
}

func (e *apiError) Error() string {
	return fmt.Sprintf("typesense: %d %s", e.Status, e.Message)
}

func hasStatus(err error, status int) bool {
	var e *apiError
	return errors.As(err, &e) && e.Status == status
}

func newTypesense(base, key string) *typesense {
	return &typesense{
		base: strings.TrimRight(base, "/"),
		key:  key,
		http: &http.Client{Timeout: 30 * time.Second},
	}
}

// do sends a JSON request (or JSONL when body is an io.Reader) and decodes
// the JSON response into out, if given. A *bytes.Buffer out receives the
// raw body instead (the import endpoint answers in JSONL).
func (t *typesense) do(ctx context.Context, method, path string, query url.Values, body, out any) error {
	var rd io.Reader
	contentType := "application/json"
	switch b := body.(type) {
	case nil:
	case io.Reader:
		rd, contentType = b, "text/plain"
	default:
		buf, err := json.Marshal(b)
		if err != nil {
			return err
		}
		rd = bytes.NewReader(buf)
	}
	u := t.base + path
	if len(query) > 0 {
		u += "?" + query.Encode()
	}
	req, err := http.NewRequestWithContext(ctx, method, u, rd)
	if err != nil {
		return err
	}
	req.Header.Set("X-TYPESENSE-API-KEY", t.key)
	req.Header.Set("Content-Type", contentType)
	if uid, ok := ctx.Value(analyticsUserKey{}).(string); ok {
		req.Header.Set("X-TYPESENSE-USER-ID", uid)
	}

	resp, err := t.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		var e struct {
			Message string `json:"message"`
		}
		json.NewDecoder(resp.Body).Decode(&e)
		return &apiError{Status: resp.StatusCode, Message: e.Message}
	}
	switch o := out.(type) {
	case nil:
		return nil
	case *bytes.Buffer:
		_, err = o.ReadFrom(resp.Body)
		return err
	default:
		return json.NewDecoder(resp.Body).Decode(out)
	}
}

// analyticsUserKey carries the ID popular-query analytics aggregate by.
// Without it Typesense would lump every search under our server's IP.
type analyticsUserKey struct{}

func withAnalyticsUser(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, analyticsUserKey{}, id)
}

// importDocs bulk-writes documents as JSONL. Typesense answers 200 even
// when single documents fail, so each result line is checked.
func (t *typesense) importDocs(ctx context.Context, collection, action string, docs []any) error {
	if len(docs) == 0 {
		return nil
	}
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	for _, d := range docs {
		if err := enc.Encode(d); err != nil {
			return err
		}
	}
	q := url.Values{"action": {action}}
	var out bytes.Buffer
	if err := t.do(ctx, http.MethodPost, "/collections/"+collection+"/documents/import", q, &buf, &out); err != nil {
		return err
	}
	failed, first := 0, ""
	sc := bufio.NewScanner(&out)
	sc.Buffer(make([]byte, 0, 64*1024), 10<<20)
	for sc.Scan() {
		var r struct {
			Success bool   `json:"success"`
			Error   string `json:"error"`
		}
		if json.Unmarshal(sc.Bytes(), &r) == nil && !r.Success {
			if failed == 0 {
				first = r.Error
			}
			failed++
		}
	}
	if failed > 0 {
		return fmt.Errorf("typesense: %d of %d documents failed to import into %s: %s", failed, len(docs), collection, first)
	}
	return nil
}

func (t *typesense) patchDoc(ctx context.Context, collection, id string, fields any) error {
	return t.do(ctx, http.MethodPatch, "/collections/"+collection+"/documents/"+url.PathEscape(id), nil, fields, nil)
}

// deleteDoc removes a document; one that is already gone counts as deleted.
func (t *typesense) deleteDoc(ctx context.Context, collection, id string) error {
	err := t.do(ctx, http.MethodDelete, "/collections/"+collection+"/documents/"+url.PathEscape(id), nil, nil, nil)
	if hasStatus(err, http.StatusNotFound) {
		return nil
	}
	return err
}

// query is one search inside a multi_search request. Only the parameters
// this service uses are listed.
type query struct {
	Collection              string `json:"collection"`
	Q                       string `json:"q"`
	QueryBy                 string `json:"query_by,omitempty"`
	QueryByWeights          string `json:"query_by_weights,omitempty"`
	Prefix                  string `json:"prefix,omitempty"`
	Infix                   string `json:"infix,omitempty"`
	NumTypos                string `json:"num_typos,omitempty"`
	TextMatchType           string `json:"text_match_type,omitempty"`
	DropTokensThreshold     *int   `json:"drop_tokens_threshold,omitempty"`
	PrioritizeExactMatch    *bool  `json:"prioritize_exact_match,omitempty"`
	Stopwords               string `json:"stopwords,omitempty"`
	FilterBy                string `json:"filter_by,omitempty"`
	SortBy                  string `json:"sort_by,omitempty"`
	FacetBy                 string `json:"facet_by,omitempty"`
	MaxFacetValues          int    `json:"max_facet_values,omitempty"`
	VectorQuery             string `json:"vector_query,omitempty"`
	RerankHybridMatches     bool   `json:"rerank_hybrid_matches,omitempty"`
	IncludeFields           string `json:"include_fields,omitempty"`
	ExcludeFields           string `json:"exclude_fields,omitempty"`
	HighlightFields         string `json:"highlight_fields,omitempty"`
	HighlightStartTag       string `json:"highlight_start_tag,omitempty"`
	HighlightEndTag         string `json:"highlight_end_tag,omitempty"`
	HighlightAffixNumTokens int    `json:"highlight_affix_num_tokens,omitempty"`
	SnippetThreshold        int    `json:"snippet_threshold,omitempty"`
	EnableAnalytics         *bool  `json:"enable_analytics,omitempty"`
	UseCache                bool   `json:"use_cache,omitempty"`
	CacheTTL                int    `json:"cache_ttl,omitempty"`
	Page                    int    `json:"page,omitempty"`
	PerPage                 int    `json:"per_page,omitempty"`
}

type result[T any] struct {
	Found        int          `json:"found"`
	OutOf        int          `json:"out_of"`
	Page         int          `json:"page"`
	SearchTimeMs int          `json:"search_time_ms"`
	Hits         []hit[T]     `json:"hits"`
	FacetCounts  []facetCount `json:"facet_counts"`
	// Set when this one search in a multi_search failed.
	Code  int    `json:"code"`
	Error string `json:"error"`
}

type hit[T any] struct {
	Document T `json:"document"`
	// Per-field highlight objects; array fields have a different shape,
	// so they are decoded lazily by snippets.
	Highlight      map[string]json.RawMessage `json:"highlight"`
	TextMatch      int64                      `json:"text_match"`
	VectorDistance *float64                   `json:"vector_distance"`
	// Which search of a union request the hit came from.
	SearchIndex int `json:"search_index"`
}

type facetCount struct {
	FieldName string `json:"field_name"`
	Counts    []struct {
		Value string `json:"value"`
		Count int    `json:"count"`
	} `json:"counts"`
}

// snippets returns the highlighted snippet of every string field that
// matched, keyed by Typesense field name.
func (h hit[T]) snippets() map[string]string {
	out := make(map[string]string, len(h.Highlight))
	for field, raw := range h.Highlight {
		var v struct {
			Snippet string `json:"snippet"`
		}
		if json.Unmarshal(raw, &v) == nil && v.Snippet != "" {
			out[field] = v.Snippet
		}
	}
	return out
}

// multiSearch runs several searches in one round trip. Results are raw so
// each can be decoded into its own document type with decodeResult.
func (t *typesense) multiSearch(ctx context.Context, searches ...query) ([]json.RawMessage, error) {
	var out struct {
		Results []json.RawMessage `json:"results"`
	}
	body := map[string]any{"searches": searches}
	if err := t.do(ctx, http.MethodPost, "/multi_search", nil, body, &out); err != nil {
		return nil, err
	}
	return out.Results, nil
}

func decodeResult[T any](raw json.RawMessage) (*result[T], error) {
	var r result[T]
	if err := json.Unmarshal(raw, &r); err != nil {
		return nil, err
	}
	if r.Error != "" {
		return nil, &apiError{Status: r.Code, Message: r.Error}
	}
	return &r, nil
}

// search runs a single search through multi_search, whose POST body keeps
// long vector queries out of the URL.
func search[T any](ctx context.Context, t *typesense, q query) (*result[T], error) {
	raw, err := t.multiSearch(ctx, q)
	if err != nil {
		return nil, err
	}
	return decodeResult[T](raw[0])
}

// unionSearch merges several searches into one ranked hit list. Every
// search must sort on the same field types.
func unionSearch[T any](ctx context.Context, t *typesense, perPage int, searches ...query) (*result[T], error) {
	var r result[T]
	q := url.Values{"page": {"1"}, "per_page": {fmt.Sprint(perPage)}}
	body := map[string]any{"union": true, "searches": searches}
	if err := t.do(ctx, http.MethodPost, "/multi_search", q, body, &r); err != nil {
		return nil, err
	}
	if r.Error != "" {
		return nil, &apiError{Status: r.Code, Message: r.Error}
	}
	return &r, nil
}
