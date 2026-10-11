-- name: ListTiers :many
SELECT * FROM tiers WHERE creator_id = $1 ORDER BY position, created_at;

-- name: ListActiveTiers :many
SELECT * FROM tiers WHERE creator_id = $1 AND is_active ORDER BY position, created_at;

-- name: CountTiers :one
SELECT count(*) FROM tiers WHERE creator_id = $1;

-- name: CreateTier :one
INSERT INTO tiers (creator_id, name, description, monthly_price, position, is_active, image_key)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateTier :one
UPDATE tiers
SET name = $3, description = $4, monthly_price = $5, position = $6, is_active = $7, image_key = $8, updated_at = now()
WHERE id = $1 AND creator_id = $2
RETURNING *;

-- name: GetTier :one
SELECT * FROM tiers WHERE id = $1 AND creator_id = $2;

-- name: DeleteTier :one
DELETE FROM tiers WHERE id = $1 AND creator_id = $2
RETURNING image_key;
