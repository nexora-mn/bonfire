// Package search keeps creators and posts in Typesense and serves search,
// autocomplete and recommendations from it.
//
// Postgres stays the source of truth. The creator and fan services publish
// change events (package events); this service re-reads the row and writes
// the search document. A nightly reindex repairs anything an event missed.
package search

import (
	"context"
	"time"

	"encore.app/persistence"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/config"
	"encore.dev/rlog"
	"encore.dev/storage/objects"
	"encore.dev/storage/sqldb"
	"encore.dev/types/uuid"
)

var secrets struct {
	// TypesenseURL is the cluster's base URL, e.g. https://xyz.a1.typesense.net.
	TypesenseURL string
	// TypesenseAPIKey is an admin key: the service manages collections,
	// synonym and curation sets and analytics rules on startup.
	TypesenseAPIKey string
}

type Config struct {
	// Built-in Typesense model behind semantic search and recommendations,
	// e.g. "ts/multilingual-e5-small". Empty turns embeddings off: search
	// is keyword-only and recommendations fall back to popularity.
	EmbeddingModel config.String
}

var cfg = config.Load[*Config]()

//encore:service
type Service struct {
	q  *persistence.Queries
	ts *typesense
	c  collections
}

var (
	db    = sqldb.Named("bonfire")
	media = objects.Named("creator-media")
)

func initService() (*Service, error) {
	q, _ := persistence.Open(db)
	s := &Service{
		q:  q,
		ts: newTypesense(secrets.TypesenseURL, secrets.TypesenseAPIKey),
		c:  collectionNames(cfg.EmbeddingModel()),
	}
	// Typesense being down must not keep the rest of the app from starting,
	// so setup retries in the background; search endpoints fail until then.
	go s.setupWithRetry()
	return s, nil
}

func (s *Service) setupWithRetry() {
	ctx := context.Background()
	for wait := time.Second; ; wait = min(wait*2, time.Minute) {
		err := s.setup(ctx)
		if err == nil {
			return
		}
		rlog.Error("typesense setup failed, retrying", "err", err, "in", wait)
		time.Sleep(wait)
	}
}

func (s *Service) semantic() bool {
	return cfg.EmbeddingModel() != ""
}

func mediaURL(key *string) *string {
	if key == nil || *key == "" {
		return nil
	}
	u := media.PublicURL(*key).String()
	return &u
}

// viewer returns the signed-in user, or nil for anonymous visitors.
func viewer() *uuid.UUID {
	uid, ok := auth.UserID()
	if !ok {
		return nil
	}
	id, err := uuid.FromString(string(uid))
	if err != nil {
		return nil
	}
	return &id
}

// unavailable wraps Typesense failures so callers see a retryable error
// rather than an internal one.
func unavailable(err error) error {
	rlog.Error("typesense request failed", "err", err)
	return &errs.Error{Code: errs.Unavailable, Message: "search is temporarily unavailable"}
}

func invalid(msg string) error {
	return &errs.Error{Code: errs.InvalidArgument, Message: msg}
}
