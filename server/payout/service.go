// Package payout reports creator earnings, stores payout bank accounts and
// runs the monthly payout workflow on DBOS, sending money through a bank's
// corporate gateway (the sandbox until one is integrated).
package payout

import (
	"context"
	"time"
	_ "time/tzdata" // DBOS resolves the schedule's IANA time zone

	"encore.app/persistence"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/config"
	"encore.dev/storage/sqldb"
	"encore.dev/types/uuid"
	"github.com/dbos-inc/dbos-transact-golang/dbos"
)

type Config struct {
	// Corporate gateway that sends payouts; see newBank.
	Bank config.String
	// Platform fee in basis points (500 = 5%), taken from each payout.
	FeeBps config.Int64
	// Smallest transfer in tögrög; smaller balances wait for a later run.
	MinPayout config.Int64
}

var cfg = config.Load[*Config]()

//encore:service
type Service struct {
	q     *persistence.Queries
	bank  bank
	dbos  dbos.Context
	queue dbos.Queue
}

var db = sqldb.Named("bonfire")

func initService() (*Service, error) {
	b, err := newBank(cfg.Bank())
	if err != nil {
		return nil, err
	}
	q, pool := persistence.Open(db)
	s := &Service{q: q, bank: b}
	if err := s.startDBOS(pool); err != nil {
		return nil, err
	}
	return s, nil
}

func (s *Service) Shutdown(force context.Context) {
	dbos.Shutdown(s.dbos, 10*time.Second)
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
