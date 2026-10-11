package search

import (
	"context"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"encore.app/events"
	"encore.app/persistence"
	"encore.dev/cron"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"encore.dev/types/uuid"
)

const reindexBatchSize = 500

// creatorDoc is a document in the creators collection, both as written and
// as returned in hits.
type creatorDoc struct {
	ID            string   `json:"id"`
	Slug          string   `json:"slug"`
	DisplayName   string   `json:"display_name"`
	About         string   `json:"about"`
	TierNames     []string `json:"tier_names"`
	LinkPlatforms []string `json:"link_platforms"`
	// Sent as null when unset, which clears a removed image on emplace.
	AvatarKey      *string `json:"avatar_key"`
	CoverKey       *string `json:"cover_key"`
	HasTiers       bool    `json:"has_tiers"`
	MinTierPrice   int64   `json:"min_tier_price"`
	OneTimeEnabled bool    `json:"one_time_enabled"`
	PostCount      int64   `json:"post_count"`
	CreatedAt      int64   `json:"created_at"`
	LastPostAt     int64   `json:"last_post_at"`
	IndexedAt      int64   `json:"indexed_at"`
	// Only read back for recommendations; Typesense computes it on write.
	Embedding []float64 `json:"embedding,omitempty"`
}

type postDoc struct {
	ID         string    `json:"id"`
	CreatorID  string    `json:"creator_id"`
	Title      string    `json:"title"`
	Body       string    `json:"body"`
	Visibility string    `json:"visibility"`
	HasImage   bool      `json:"has_image"`
	ImageKey   *string   `json:"image_key"`
	LikeCount  int64     `json:"like_count"`
	CreatedAt  int64     `json:"created_at"`
	IndexedAt  int64     `json:"indexed_at"`
	Embedding  []float64 `json:"embedding,omitempty"`
	// Joined from the creators collection on search; never written.
	Creator *joinedCreator `json:"creator,omitempty"`
}

type joinedCreator struct {
	Slug        string  `json:"slug"`
	DisplayName string  `json:"display_name"`
	AvatarKey   *string `json:"avatar_key"`
}

func toCreatorDoc(r persistence.CreatorsForIndexRow, now int64) creatorDoc {
	return creatorDoc{
		ID:             r.ID.String(),
		Slug:           r.Slug,
		DisplayName:    r.DisplayName,
		About:          r.About,
		TierNames:      r.TierNames,
		LinkPlatforms:  r.LinkPlatforms,
		AvatarKey:      r.AvatarKey,
		CoverKey:       r.CoverKey,
		HasTiers:       len(r.TierNames) > 0,
		MinTierPrice:   r.MinTierPrice,
		OneTimeEnabled: r.OneTimeEnabled,
		PostCount:      r.PostCount,
		CreatedAt:      r.CreatedAt.Unix(),
		LastPostAt:     r.LastPostAt,
		IndexedAt:      now,
	}
}

func toPostDoc(r persistence.PostsForIndexRow, now int64) postDoc {
	d := postDoc{
		ID:         r.ID.String(),
		CreatorID:  r.CreatorID.String(),
		Title:      r.Title,
		Visibility: r.Visibility,
		LikeCount:  r.LikeCount,
		CreatedAt:  r.CreatedAt.Unix(),
		IndexedAt:  now,
	}
	// Members-only posts are indexed as their title alone, the same teaser
	// visitors see, so neither results nor snippets reveal locked content.
	if r.Visibility == "public" {
		d.Body = r.Body
		d.ImageKey = r.ImageKey
		d.HasImage = r.ImageKey != nil
	}
	return d
}

var _ = pubsub.NewSubscription(events.CreatorChanges, "search-index-creator",
	pubsub.SubscriptionConfig[*events.CreatorChanged]{
		Handler: pubsub.MethodHandler((*Service).indexCreator),
	},
)

var _ = pubsub.NewSubscription(events.PostChanges, "search-index-post",
	pubsub.SubscriptionConfig[*events.PostChanged]{
		Handler: pubsub.MethodHandler((*Service).indexPost),
	},
)

func (s *Service) indexCreator(ctx context.Context, e *events.CreatorChanged) error {
	rows, err := s.q.CreatorsForIndex(ctx, persistence.CreatorsForIndexParams{Single: &e.CreatorID, BatchSize: 1})
	if err != nil {
		return err
	}
	if len(rows) == 0 {
		return s.ts.deleteDoc(ctx, s.c.Creators, e.CreatorID.String())
	}
	doc := toCreatorDoc(rows[0], time.Now().Unix())
	if e.CountsOnly {
		// A patch leaves the embedding alone; a full write would recompute it.
		err := s.ts.patchDoc(ctx, s.c.Creators, doc.ID, map[string]any{
			"post_count":     doc.PostCount,
			"last_post_at":   doc.LastPostAt,
			"indexed_at":     doc.IndexedAt,
		})
		if !hasStatus(err, http.StatusNotFound) {
			return err
		}
	}
	// Emplace keeps fields we don't send, like the analytics click counter.
	return s.ts.importDocs(ctx, s.c.Creators, "emplace", []any{doc})
}

func (s *Service) indexPost(ctx context.Context, e *events.PostChanged) error {
	rows, err := s.q.PostsForIndex(ctx, persistence.PostsForIndexParams{Single: &e.PostID, BatchSize: 1})
	if err != nil {
		return err
	}
	if len(rows) == 0 {
		return s.ts.deleteDoc(ctx, s.c.Posts, e.PostID.String())
	}
	doc := toPostDoc(rows[0], time.Now().Unix())
	if e.CountsOnly {
		err := s.ts.patchDoc(ctx, s.c.Posts, doc.ID, map[string]any{
			"like_count": doc.LikeCount,
			"indexed_at": doc.IndexedAt,
		})
		if !hasStatus(err, http.StatusNotFound) {
			return err
		}
	}
	return s.ts.importDocs(ctx, s.c.Posts, "emplace", []any{doc})
}

// Repairs whatever change events missed. 03:00 Ulaanbaatar time.
var _ = cron.NewJob("search-reindex", cron.JobConfig{
	Title:    "Rebuild search documents from the database",
	Schedule: "0 19 * * *",
	Endpoint: Reindex,
})

// Reindex rewrites every creator and post document from Postgres, removes
// documents whose rows are gone and drops collections of old schema
// versions. Safe to run at any time.
//
//encore:api private method=POST path=/search/reindex
func (s *Service) Reindex(ctx context.Context) error {
	if err := s.reindex(ctx); err != nil {
		return err
	}
	return s.dropStaleCollections(ctx)
}

func (s *Service) reindex(ctx context.Context) error {
	start := time.Now().Unix()

	// Creators first, so posts' references resolve as they are written.
	var after uuid.UUID
	for {
		rows, err := s.q.CreatorsForIndex(ctx, persistence.CreatorsForIndexParams{After: after, BatchSize: reindexBatchSize})
		if err != nil {
			return err
		}
		docs := make([]any, len(rows))
		for i, r := range rows {
			docs[i] = toCreatorDoc(r, time.Now().Unix())
		}
		if err := s.ts.importDocs(ctx, s.c.Creators, "emplace", docs); err != nil {
			return err
		}
		if len(rows) < reindexBatchSize {
			break
		}
		after = rows[len(rows)-1].ID
	}

	after = uuid.UUID{}
	for {
		rows, err := s.q.PostsForIndex(ctx, persistence.PostsForIndexParams{After: after, BatchSize: reindexBatchSize})
		if err != nil {
			return err
		}
		docs := make([]any, len(rows))
		for i, r := range rows {
			docs[i] = toPostDoc(r, time.Now().Unix())
		}
		if err := s.ts.importDocs(ctx, s.c.Posts, "emplace", docs); err != nil {
			return err
		}
		if len(rows) < reindexBatchSize {
			break
		}
		after = rows[len(rows)-1].ID
	}

	// Every live row was just rewritten, so older documents are deleted rows.
	stale := url.Values{"filter_by": {"indexed_at:<" + strconv.FormatInt(start, 10)}}
	for _, c := range []string{s.c.Posts, s.c.Creators} {
		var out struct {
			NumDeleted int `json:"num_deleted"`
		}
		if err := s.ts.do(ctx, http.MethodDelete, "/collections/"+c+"/documents", stale, nil, &out); err != nil {
			return err
		}
		if out.NumDeleted > 0 {
			rlog.Info("removed stale search documents", "collection", c, "count", out.NumDeleted)
		}
	}
	return nil
}

func (s *Service) dropStaleCollections(ctx context.Context) error {
	var all []struct {
		Name string `json:"name"`
	}
	if err := s.ts.do(ctx, http.MethodGet, "/collections", nil, nil, &all); err != nil {
		return err
	}
	// Posts first: they reference creators.
	for _, prefix := range []string{"posts", "creators"} {
		for _, c := range all {
			if !staleCollection.MatchString(c.Name) || !strings.HasPrefix(c.Name, prefix) ||
				c.Name == s.c.Creators || c.Name == s.c.Posts {
				continue
			}
			if err := s.ts.do(ctx, http.MethodDelete, "/collections/"+c.Name, nil, nil, nil); err != nil {
				return err
			}
			rlog.Info("dropped old search collection", "collection", c.Name)
		}
	}
	return nil
}
