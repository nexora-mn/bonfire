// Package creator manages creator pages: profile, links, images, membership
// tiers, one-time support settings and posts, plus the public page and the
// permanent QR code redirect.
package creator

import (
	"context"

	"encore.app/persistence"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"encore.dev/types/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

//encore:service
type Service struct {
	q    *persistence.Queries
	pool *pgxpool.Pool
}

var db = sqldb.Named("bonfire")

func initService() (*Service, error) {
	q, pool := persistence.Open(db)
	return &Service{q: q, pool: pool}, nil
}

// userID returns the signed-in Supabase user's ID.
func userID() (uuid.UUID, error) {
	uid, _ := auth.UserID()
	id, err := uuid.FromString(string(uid))
	if err != nil {
		return uuid.UUID{}, &errs.Error{Code: errs.Unauthenticated, Message: "invalid user id"}
	}
	return id, nil
}

// viewer returns the signed-in user on public endpoints, where auth is
// optional, or nil for anonymous visitors.
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

var errNoCreator = &errs.Error{Code: errs.FailedPrecondition, Message: "creator page is not set up"}

// mine loads the signed-in user's creator page.
func (s *Service) mine(ctx context.Context) (persistence.Creator, error) {
	id, err := userID()
	if err != nil {
		return persistence.Creator{}, err
	}
	c, err := s.q.GetCreatorByUser(ctx, id)
	if persistence.IsNotFound(err) {
		return c, errNoCreator
	}
	return c, err
}

// inTx runs fn in a transaction, committing only if it returns nil.
func (s *Service) inTx(ctx context.Context, fn func(q *persistence.Queries) error) error {
	return pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		return fn(s.q.WithTx(tx))
	})
}
