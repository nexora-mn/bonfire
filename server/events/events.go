// Package events declares the topics services publish when searchable data
// changes. They live outside any service so publishers (creator, fan) and
// the subscriber (search) can share them without an import cycle.
//
// Events carry IDs only. Subscribers re-read the current row, so delivery
// order and duplicates don't matter.
package events

import (
	"context"

	"encore.dev/pubsub"
	"encore.dev/rlog"
	"encore.dev/types/uuid"
)

type CreatorChanged struct {
	CreatorID uuid.UUID `json:"creatorId"`
	// Only post counts changed, not the page itself, so the
	// search document can be patched without recomputing its embedding.
	CountsOnly bool `json:"countsOnly"`
}

type PostChanged struct {
	PostID uuid.UUID `json:"postId"`
	// Only the like count changed.
	CountsOnly bool `json:"countsOnly"`
}

var CreatorChanges = pubsub.NewTopic[*CreatorChanged]("creator-changes", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

var PostChanges = pubsub.NewTopic[*PostChanged]("post-changes", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// A lost event only leaves search stale until the nightly reindex, so
// publish failures are logged instead of failing the user's request.

func CreatorUpdated(ctx context.Context, id uuid.UUID, countsOnly bool) {
	if _, err := CreatorChanges.Publish(ctx, &CreatorChanged{CreatorID: id, CountsOnly: countsOnly}); err != nil {
		rlog.Warn("publish creator change", "creator_id", id, "err", err)
	}
}

func PostUpdated(ctx context.Context, id uuid.UUID, countsOnly bool) {
	if _, err := PostChanges.Publish(ctx, &PostChanged{PostID: id, CountsOnly: countsOnly}); err != nil {
		rlog.Warn("publish post change", "post_id", id, "err", err)
	}
}
