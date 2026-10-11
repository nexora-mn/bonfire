-- name: ListPosts :many
SELECT * FROM posts WHERE creator_id = $1 ORDER BY created_at DESC;

-- name: GetPost :one
SELECT * FROM posts WHERE id = $1 AND creator_id = $2;

-- name: CreatePost :one
INSERT INTO posts (creator_id, title, body, image_key, visibility)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdatePost :one
UPDATE posts
SET title = $3, body = $4, image_key = $5, visibility = $6, updated_at = now()
WHERE id = $1 AND creator_id = $2
RETURNING *;

-- name: DeletePost :one
DELETE FROM posts WHERE id = $1 AND creator_id = $2
RETURNING image_key;
