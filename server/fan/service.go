// Package fan powers the supporter side of Bonfire: the post feed, likes, discovering creators and the supports a fan made.
package fan

import (
	"context"

	"encore.app/media"
	"encore.app/persistence"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"encore.dev/types/uuid"
)

//encore:service
type Service struct {
	q *persistence.Queries
}

var db = sqldb.Named("bonfire")

func initService() (*Service, error) {
	q, _ := persistence.Open(db)
	return &Service{q: q}, nil
}

func mediaURL(key *string) *string {
	if key == nil {
		return nil
	}
	u := media.PublicURL(*key)
	return &u
}

// viewer returns the signed-in user, or nil on public endpoints when
// nobody is signed in.
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

// me returns the signed-in user on auth endpoints.
func me() (uuid.UUID, error) {
	if id := viewer(); id != nil {
		return *id, nil
	}
	return uuid.UUID{}, &errs.Error{Code: errs.Unauthenticated, Message: "sign in required"}
}

var errCreatorNotFound = &errs.Error{Code: errs.NotFound, Message: "creator not found"}

func (s *Service) creatorID(ctx context.Context, slug string) (uuid.UUID, error) {
	c, err := s.q.GetCreatorBySlug(ctx, slug)
	if persistence.IsNotFound(err) {
		return uuid.UUID{}, errCreatorNotFound
	}
	return c.ID, err
}

// CreatorSummary is a creator as shown on cards and in the feed.
type CreatorSummary struct {
	Slug        string  `json:"slug"`
	DisplayName string  `json:"displayName"`
	AvatarURL   *string `json:"avatarUrl"`
}
