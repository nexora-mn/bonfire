package fan

import (
	"context"
	"fmt"
	"strings"
	"time"

	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

const feedPageSize = 20

type FeedParams struct {
	// Cursor from the previous page's nextCursor; empty for the first page.
	Before string `query:"before"`
}

// FeedPost is a post in the feed. Members-only posts are locked teasers
// (no body or image) unless the viewer is a paying member.
type FeedPost struct {
	ID         string         `json:"id"`
	Creator    CreatorSummary `json:"creator"`
	Title      string         `json:"title"`
	Body       string         `json:"body"`
	ImageURL   *string        `json:"imageUrl"`
	Visibility string         `json:"visibility"`
	Locked     bool           `json:"locked"`
	LikeCount  int64          `json:"likeCount"`
	Liked      bool           `json:"liked"`
	CreatedAt  time.Time      `json:"createdAt"`
}

type FeedResponse struct {
	Posts []FeedPost `json:"posts"`
	// Pass as `before` to load older posts; null on the last page.
	NextCursor *string `json:"nextCursor"`
}

// Feed returns posts from every creator, newest first.
//
//encore:api auth method=GET path=/me/feed
func (s *Service) Feed(ctx context.Context, p *FeedParams) (*FeedResponse, error) {
	uid, err := me()
	if err != nil {
		return nil, err
	}
	params := persistence.FeedParams{Viewer: uid, PageSize: feedPageSize + 1}
	if p.Before != "" {
		t, id, err := parseCursor(p.Before)
		if err != nil {
			return nil, err
		}
		params.BeforeTime, params.BeforeID = &t, &id
	}
	rows, err := s.q.Feed(ctx, params)
	if err != nil {
		return nil, err
	}

	var next *string
	if len(rows) > feedPageSize {
		rows = rows[:feedPageSize]
		last := rows[len(rows)-1]
		c := fmt.Sprintf("%s_%s", last.CreatedAt.Format(time.RFC3339Nano), last.ID)
		next = &c
	}

	out := make([]FeedPost, len(rows))
	for i, r := range rows {
		post := FeedPost{
			ID: r.ID.String(),
			Creator: CreatorSummary{
				Slug:        r.Slug,
				DisplayName: r.DisplayName,
				AvatarURL:   mediaURL(r.AvatarKey),
			},
			Title:      r.Title,
			Visibility: r.Visibility,
			LikeCount:  r.LikeCount,
			Liked:      r.Liked,
			CreatedAt:  r.CreatedAt,
		}
		if r.Visibility == "members" && !r.Member {
			post.Locked = true
		} else {
			post.Body = r.Body
			post.ImageURL = mediaURL(r.ImageKey)
		}
		out[i] = post
	}
	return &FeedResponse{Posts: out, NextCursor: next}, nil
}

func parseCursor(c string) (time.Time, uuid.UUID, error) {
	bad := &errs.Error{Code: errs.InvalidArgument, Message: "invalid cursor"}
	ts, idStr, ok := strings.Cut(c, "_")
	if !ok {
		return time.Time{}, uuid.UUID{}, bad
	}
	t, err := time.Parse(time.RFC3339Nano, ts)
	if err != nil {
		return time.Time{}, uuid.UUID{}, bad
	}
	id, err := uuid.FromString(idStr)
	if err != nil {
		return time.Time{}, uuid.UUID{}, bad
	}
	return t, id, nil
}
