-- name: GetCreatorByUser :one
SELECT * FROM creators WHERE user_id = $1;

-- name: GetCreatorBySlug :one
SELECT * FROM creators WHERE slug = $1;

-- name: GetCreatorByCode :one
SELECT * FROM creators WHERE code = $1;

-- name: CreateCreator :one
INSERT INTO creators (user_id, slug, code, display_name, about)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateCreatorProfile :one
UPDATE creators
SET slug = $2, display_name = $3, about = $4, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: SetCreatorAvatar :one
UPDATE creators SET avatar_key = $2, updated_at = now() WHERE id = $1
RETURNING *;

-- name: SetCreatorCover :one
UPDATE creators SET cover_key = $2, updated_at = now() WHERE id = $1
RETURNING *;

-- name: UpdateOneTimeSettings :one
UPDATE creators
SET one_time_enabled = $2,
    one_time_min = $3,
    one_time_presets = $4,
    one_time_thanks = $5,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListCreatorLinks :many
SELECT * FROM creator_links WHERE creator_id = $1 ORDER BY position;

-- name: DeleteCreatorLinks :exec
DELETE FROM creator_links WHERE creator_id = $1;

-- name: InsertCreatorLink :exec
INSERT INTO creator_links (creator_id, position, platform, url) VALUES ($1, $2, $3, $4);
