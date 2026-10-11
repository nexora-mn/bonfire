-- name: GetPayoutAccount :one
SELECT * FROM payout_accounts WHERE creator_id = $1;

-- name: UpsertPayoutAccount :one
INSERT INTO payout_accounts (creator_id, bank_code, account_holder, account_number)
VALUES ($1, $2, $3, $4)
ON CONFLICT (creator_id) DO UPDATE
SET bank_code = excluded.bank_code,
    account_holder = excluded.account_holder,
    account_number = excluded.account_number,
    updated_at = now()
RETURNING *;

-- name: ListPayouts :many
SELECT * FROM payouts WHERE creator_id = $1 ORDER BY period DESC LIMIT 24;

-- Keyset pagination over creators who can be paid (those with a payout
-- account), so a run with many creators never loads them all at once.
-- name: PayableCreatorIDsAfter :many
SELECT creator_id FROM payout_accounts
WHERE creator_id > sqlc.arg(after)::uuid
ORDER BY creator_id
LIMIT sqlc.arg(batch_size);

-- Records a payout of each creator's unpaid balance: succeeded supports
-- before period_end minus every payout that hasn't failed. Refunds lower the
-- balance, and failed or too-small amounts stay in it for the next run.
-- ON CONFLICT makes a rerun of the same month a no-op, so a retried batch
-- never pays anyone twice.
-- name: CreatePayoutsForBatch :execrows
INSERT INTO payouts (creator_id, period, gross, fee, amount, sandbox, bank_code, account_holder, account_number)
SELECT
    pa.creator_id,
    sqlc.arg(period)::date,
    b.gross,
    f.fee,
    b.gross - f.fee,
    sqlc.arg(sandbox)::boolean,
    pa.bank_code,
    pa.account_holder,
    pa.account_number
FROM payout_accounts pa
CROSS JOIN LATERAL (
    SELECT
        (SELECT coalesce(sum(s.amount), 0) FROM supports s
         WHERE s.creator_id = pa.creator_id
           AND s.status = 'succeeded'
           AND s.created_at < sqlc.arg(period_end)::timestamptz)
      - (SELECT coalesce(sum(p.gross), 0) FROM payouts p
         WHERE p.creator_id = pa.creator_id
           AND p.status <> 'failed')
      AS gross
) b
CROSS JOIN LATERAL (
    SELECT (b.gross * sqlc.arg(fee_bps)::bigint / 10000)::bigint AS fee
) f
WHERE pa.creator_id = ANY (sqlc.arg(creator_ids)::uuid[])
  AND b.gross - f.fee >= sqlc.arg(min_amount)::bigint
ON CONFLICT (creator_id, period) DO NOTHING;

-- Payouts in the batch still waiting to be sent, including any left over
-- from an earlier attempt at the same month.
-- name: ListPendingPayouts :many
SELECT id, amount, bank_code, account_holder, account_number
FROM payouts
WHERE period = sqlc.arg(period)::date
  AND status = 'pending'
  AND creator_id = ANY (sqlc.arg(creator_ids)::uuid[])
ORDER BY id;

-- Transfers the bank hasn't settled yet, paged by ID for reconciliation.
-- name: ListProcessingPayouts :many
SELECT id FROM payouts
WHERE status = 'processing'
  AND sandbox = sqlc.arg(sandbox)::boolean
  AND id > sqlc.arg(after)::uuid
ORDER BY id
LIMIT sqlc.arg(batch_size);

-- Stores a transfer's outcome. Settled payouts are never touched again.
-- name: RecordTransfer :exec
UPDATE payouts
SET status = sqlc.arg(status)::text,
    bank_ref = coalesce(nullif(sqlc.arg(bank_ref)::text, ''), bank_ref),
    failure_reason = nullif(sqlc.arg(failure_reason)::text, ''),
    processed_at = CASE WHEN sqlc.arg(status)::text IN ('paid', 'failed') THEN now() END
WHERE id = sqlc.arg(id)
  AND status IN ('pending', 'processing');

-- name: InsertSupport :exec
-- Used by the dev seed endpoint until the payment integration writes supports.
INSERT INTO supports (creator_id, kind, tier_id, supporter_user_id, supporter_name, message, amount, status, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, 'succeeded', $8);
