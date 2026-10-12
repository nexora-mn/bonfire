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

-- name: InsertSupport :exec
-- Used by the dev seed endpoint until the payment integration writes supports.
INSERT INTO supports (creator_id, kind, tier_id, supporter_user_id, supporter_name, message, amount, status, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, 'succeeded', $8);
