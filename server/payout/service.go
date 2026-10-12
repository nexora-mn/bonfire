// Package payout reports creator earnings and stores the bank accounts
// creators get paid to. Sending payouts isn't implemented yet.
package payout

import (
	"context"
	"time"

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

// mine loads the signed-in user's creator page.
func (s *Service) mine(ctx context.Context) (persistence.Creator, error) {
	uid, _ := auth.UserID()
	id, err := uuid.FromString(string(uid))
	if err != nil {
		return persistence.Creator{}, &errs.Error{Code: errs.Unauthenticated, Message: "invalid user id"}
	}
	c, err := s.q.GetCreatorByUser(ctx, id)
	if persistence.IsNotFound(err) {
		return c, &errs.Error{Code: errs.FailedPrecondition, Message: "creator page is not set up"}
	}
	return c, err
}

// Mongolia has no DST, so a fixed zone is exact.
var ulaanbaatar = time.FixedZone("ULAT", 8*60*60)

// monthStart returns 00:00 on the first of t's month, Ulaanbaatar time.
func monthStart(t time.Time) time.Time {
	t = t.In(ulaanbaatar)
	return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, ulaanbaatar)
}
