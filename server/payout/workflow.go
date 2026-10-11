package payout

import (
	"context"
	"fmt"
	"time"

	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"encore.dev/types/uuid"
	"github.com/dbos-inc/dbos-transact-golang/dbos"
	"github.com/jackc/pgx/v5/pgxpool"
)

// How the monthly run scales to many creators:
//
//   - The month workflow pages through creators by ID (keyset pagination),
//     so it never holds more than one batch of IDs in memory.
//   - Each batch becomes its own child workflow on the "payouts" queue.
//     The queue caps how many batches run at once, keeping database load
//     flat however many creators there are.
//   - Every step is idempotent: payouts are unique per (creator, month) and
//     inserted with ON CONFLICT DO NOTHING, and workflow IDs are derived from
//     the month and batch number. A crash, retry or second trigger for the
//     same month resumes or no-ops instead of paying anyone twice.
//   - Each transfer is sent and recorded in separate steps, with the payout
//     ID as the bank's idempotency key. DBOS replays a finished send from its
//     log rather than calling the bank again, and a send interrupted mid-call
//     is retried under the same key, which the bank deduplicates.
//   - A transfer the bank accepted but hasn't settled, or whose outcome is
//     unknown, stays "processing" until the hourly reconciliation asks the
//     bank about it.
const (
	batchSize         = 500
	workerConcurrency = 2 // batches per process
	globalConcurrency = 4 // batches across all processes
)

func (s *Service) startDBOS(pool *pgxpool.Pool) error {
	ctx, err := dbos.NewContext(context.Background(), dbos.Config{
		AppName: "bonfire",
		// DBOS keeps its workflow state in the "dbos" schema of our database.
		SystemDBPool: pool,
	})
	if err != nil {
		return fmt.Errorf("dbos: %w", err)
	}
	s.dbos = ctx

	dbos.RegisterWorkflow(ctx, s.monthlyPayouts, dbos.WithWorkflowName("monthly-payouts"))
	dbos.RegisterWorkflow(ctx, s.payMonth, dbos.WithWorkflowName("pay-month"))
	dbos.RegisterWorkflow(ctx, s.payBatch, dbos.WithWorkflowName("pay-batch"))
	dbos.RegisterWorkflow(ctx, s.reconcilePayouts, dbos.WithWorkflowName("reconcile-payouts"))
	s.queue, err = dbos.RegisterQueue(ctx, "payouts",
		dbos.WithWorkerConcurrency(workerConcurrency),
		dbos.WithGlobalConcurrency(globalConcurrency),
	)
	if err != nil {
		return fmt.Errorf("dbos queue: %w", err)
	}

	if err := dbos.Launch(ctx); err != nil {
		return fmt.Errorf("dbos launch: %w", err)
	}
	// Upserted on every start, so changing the cron here takes effect on deploy.
	return dbos.ApplySchedules(ctx, []dbos.ScheduleSpec{{
		ScheduleName: "monthly-payouts",
		Workflow:     s.monthlyPayouts,
		// 00:00:00 on the 1st (DBOS cron has a seconds field).
		Schedule:     "0 0 0 1 * *",
		CronTimezone: "Asia/Ulaanbaatar",
		// Catch up on a month missed while the app was down.
		AutomaticBackfill: true,
	}, {
		ScheduleName: "reconcile-payouts",
		Workflow:     s.reconcilePayouts,
		// Hourly, on the hour.
		Schedule:     "0 0 * * * *",
		CronTimezone: "Asia/Ulaanbaatar",
	}})
}

// monthlyPayouts fires on the 1st and pays out the month that just ended.
func (s *Service) monthlyPayouts(ctx dbos.Context, in dbos.ScheduledWorkflowInput) (any, error) {
	month := monthStart(in.ScheduledTime).AddDate(0, -1, 0).Format("2006-01")
	h, err := s.startMonth(ctx, month)
	if err != nil {
		return nil, err
	}
	return h.GetResult()
}

// startMonth starts (or attaches to) the run for a month. The fixed workflow
// ID means the schedule and a manual trigger can never both pay a month.
func (s *Service) startMonth(ctx dbos.Context, month string) (dbos.WorkflowHandle[MonthResult], error) {
	return dbos.RunWorkflow(ctx, s.payMonth, month, dbos.WithWorkflowID("payout-"+month))
}

type MonthResult struct {
	Month      string `json:"month"`
	Batches    int    `json:"batches"`
	Created    int64  `json:"created"`
	Paid       int    `json:"paid"`
	Processing int    `json:"processing"`
	Failed     int    `json:"failed"`
}

type batchInput struct {
	Month      string      `json:"month"`
	CreatorIDs []uuid.UUID `json:"creatorIds"`
}

type batchResult struct {
	Created    int64 `json:"created"`
	Paid       int   `json:"paid"`
	Processing int   `json:"processing"`
	Failed     int   `json:"failed"`
}

// payMonth fans the month out into creator batches on the payouts queue.
func (s *Service) payMonth(ctx dbos.Context, month string) (MonthResult, error) {
	res := MonthResult{Month: month}
	var handles []dbos.WorkflowHandle[batchResult]
	after := uuid.UUID{}
	for {
		ids, err := dbos.RunAsStep(ctx, func(ctx context.Context) ([]uuid.UUID, error) {
			return s.q.PayableCreatorIDsAfter(ctx, persistence.PayableCreatorIDsAfterParams{After: after, BatchSize: batchSize})
		}, dbos.WithStepName("list-creators"))
		if err != nil {
			return res, err
		}
		if len(ids) == 0 {
			break
		}
		h, err := dbos.RunWorkflow(ctx, s.payBatch, batchInput{Month: month, CreatorIDs: ids},
			dbos.WithQueue(s.queue),
			dbos.WithWorkflowID(fmt.Sprintf("payout-%s-batch-%05d", month, res.Batches)),
		)
		if err != nil {
			return res, err
		}
		handles = append(handles, h)
		res.Batches++
		after = ids[len(ids)-1]
	}

	for _, h := range handles {
		r, err := h.GetResult()
		if err != nil {
			return res, err
		}
		res.Created += r.Created
		res.Paid += r.Paid
		res.Processing += r.Processing
		res.Failed += r.Failed
	}
	rlog.Info("monthly payouts done", "month", month, "batches", res.Batches, "created", res.Created,
		"paid", res.Paid, "processing", res.Processing, "failed", res.Failed)
	return res, nil
}

// payBatch records one batch of creators' payouts and sends them.
func (s *Service) payBatch(ctx dbos.Context, in batchInput) (batchResult, error) {
	start, err := time.ParseInLocation("2006-01", in.Month, ulaanbaatar)
	if err != nil {
		return batchResult{}, err
	}
	period := time.Date(start.Year(), start.Month(), 1, 0, 0, 0, 0, time.UTC)

	var res batchResult
	res.Created, err = dbos.RunAsStep(ctx, func(ctx context.Context) (int64, error) {
		return s.q.CreatePayoutsForBatch(ctx, persistence.CreatePayoutsForBatchParams{
			Period:     period,
			PeriodEnd:  start.AddDate(0, 1, 0),
			Sandbox:    s.bank.Sandbox(),
			FeeBps:     cfg.FeeBps(),
			MinAmount:  max(cfg.MinPayout(), 1),
			CreatorIds: in.CreatorIDs,
		})
	}, dbos.WithStepName("create-payouts"))
	if err != nil {
		return res, err
	}

	pending, err := dbos.RunAsStep(ctx, func(ctx context.Context) ([]persistence.ListPendingPayoutsRow, error) {
		return s.q.ListPendingPayouts(ctx, persistence.ListPendingPayoutsParams{Period: period, CreatorIds: in.CreatorIDs})
	}, dbos.WithStepName("list-pending"))
	if err != nil {
		return res, err
	}

	for _, p := range pending {
		r, err := dbos.RunAsStep(ctx, func(ctx context.Context) (transferResult, error) {
			return s.bank.Send(ctx, transfer{
				Ref:           p.ID.String(),
				BankCode:      p.BankCode,
				AccountHolder: p.AccountHolder,
				AccountNumber: p.AccountNumber,
				Amount:        p.Amount,
				Description:   "Bonfire " + in.Month,
			})
		}, dbos.WithStepName("send-transfer"),
			dbos.WithStepMaxRetries(5),
			dbos.WithStepBaseInterval(time.Second),
			dbos.WithStepMaxInterval(30*time.Second),
		)
		if err != nil {
			// The bank may or may not have it; reconciliation will ask.
			rlog.Warn("payout send failed, leaving for reconciliation", "payout", p.ID, "err", err)
			r = transferResult{Status: transferProcessing, Reason: err.Error()}
		}
		if err := s.recordTransfer(ctx, p.ID, r); err != nil {
			return res, err
		}
		switch r.Status {
		case transferPaid:
			res.Paid++
		case transferFailed:
			res.Failed++
		default:
			res.Processing++
		}
	}
	return res, nil
}

func (s *Service) recordTransfer(ctx dbos.Context, id uuid.UUID, r transferResult) error {
	_, err := dbos.RunAsStep(ctx, func(ctx context.Context) (struct{}, error) {
		return struct{}{}, s.q.RecordTransfer(ctx, persistence.RecordTransferParams{
			ID:            id,
			Status:        r.Status,
			BankRef:       r.BankRef,
			FailureReason: r.Reason,
		})
	}, dbos.WithStepName("record-transfer"), dbos.WithStepMaxRetries(3))
	return err
}

// reconcilePayouts runs hourly and settles transfers left "processing":
// accepted but not yet settled by the bank, or with an unknown outcome.
func (s *Service) reconcilePayouts(ctx dbos.Context, _ dbos.ScheduledWorkflowInput) (any, error) {
	settled := 0
	after := uuid.UUID{}
	for {
		ids, err := dbos.RunAsStep(ctx, func(ctx context.Context) ([]uuid.UUID, error) {
			return s.q.ListProcessingPayouts(ctx, persistence.ListProcessingPayoutsParams{
				Sandbox:   s.bank.Sandbox(),
				After:     after,
				BatchSize: batchSize,
			})
		}, dbos.WithStepName("list-processing"))
		if err != nil {
			return nil, err
		}
		if len(ids) == 0 {
			break
		}
		for _, id := range ids {
			r, err := dbos.RunAsStep(ctx, func(ctx context.Context) (transferResult, error) {
				return s.bank.Status(ctx, id.String())
			}, dbos.WithStepName("check-transfer"), dbos.WithStepMaxRetries(3))
			if err != nil {
				rlog.Warn("payout status check failed, retrying next hour", "payout", id, "err", err)
				continue
			}
			if r.Status == transferProcessing {
				continue
			}
			if err := s.recordTransfer(ctx, id, r); err != nil {
				return nil, err
			}
			settled++
		}
		after = ids[len(ids)-1]
	}
	if settled > 0 {
		rlog.Info("payouts reconciled", "settled", settled)
	}
	return nil, nil
}

type RunParams struct {
	// Month to pay out, as YYYY-MM. Defaults to last month.
	Month string `json:"month"`
}

// Run triggers the payout run for a month by hand (for testing, or to retry
// after fixing a failure). Safe to call repeatedly.
//
//encore:api private method=POST path=/payouts/run
func (s *Service) Run(ctx context.Context, p *RunParams) (*MonthResult, error) {
	month := p.Month
	if month == "" {
		month = monthStart(time.Now()).AddDate(0, -1, 0).Format("2006-01")
	} else if _, err := time.Parse("2006-01", month); err != nil {
		return nil, &errs.Error{Code: errs.InvalidArgument, Message: "month must be YYYY-MM"}
	}
	h, err := s.startMonth(s.dbos, month)
	if err != nil {
		return nil, err
	}
	res, err := h.GetResult()
	if err != nil {
		return nil, err
	}
	return &res, nil
}
