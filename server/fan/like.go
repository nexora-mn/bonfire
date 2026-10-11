package fan

import (
	"context"

	"encore.app/events"
	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

type LikeState struct {
	Liked     bool  `json:"liked"`
	LikeCount int64 `json:"likeCount"`
}

// Like hearts a public post.
//
//encore:api auth method=POST path=/posts/:id/like
func (s *Service) Like(ctx context.Context, id uuid.UUID) (*LikeState, error) {
	return s.setLike(ctx, id, true)
}

// Unlike removes the signed-in user's heart from a post.
//
//encore:api auth method=DELETE path=/posts/:id/like
func (s *Service) Unlike(ctx context.Context, id uuid.UUID) (*LikeState, error) {
	return s.setLike(ctx, id, false)
}

func (s *Service) setLike(ctx context.Context, id uuid.UUID, like bool) (*LikeState, error) {
	uid, err := me()
	if err != nil {
		return nil, err
	}
	// Members-only posts can't be seen yet, so they can't be liked either.
	visibility, err := s.q.GetPostVisibility(ctx, id)
	if persistence.IsNotFound(err) || (err == nil && visibility != "public") {
		return nil, &errs.Error{Code: errs.NotFound, Message: "post not found"}
	} else if err != nil {
		return nil, err
	}
	if like {
		err = s.q.LikePost(ctx, persistence.LikePostParams{UserID: uid, PostID: id})
	} else {
		err = s.q.UnlikePost(ctx, persistence.UnlikePostParams{UserID: uid, PostID: id})
	}
	if err != nil {
		return nil, err
	}
	n, err := s.q.CountLikes(ctx, id)
	if err != nil {
		return nil, err
	}
	events.PostUpdated(ctx, id, true)
	return &LikeState{Liked: like, LikeCount: n}, nil
}
