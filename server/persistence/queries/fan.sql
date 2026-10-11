-- Creators for the discover page, newest first. `q` matches name or slug.
-- name: ExploreCreators :many
SELECT c.id, c.slug, c.display_name, c.about, c.avatar_key, c.cover_key
FROM creators c
WHERE sqlc.narg(q)::text IS NULL
   OR c.display_name ILIKE '%' || sqlc.narg(q)::text || '%'
   OR c.slug ILIKE '%' || sqlc.narg(q)::text || '%'
ORDER BY c.created_at DESC
LIMIT sqlc.arg(page_size) OFFSET sqlc.arg(page_offset);

-- Posts from every creator, newest first, paged by (created_at, id).
-- `member` is whether the viewer paid for a membership with the creator.
-- name: Feed :many
SELECT p.id, p.title, p.body, p.image_key, p.visibility, p.created_at,
    c.slug, c.display_name, c.avatar_key,
    (SELECT count(*) FROM post_likes l WHERE l.post_id = p.id) AS like_count,
    EXISTS (SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = sqlc.arg(viewer)) AS liked,
    EXISTS (SELECT 1 FROM supports s WHERE s.creator_id = c.id AND s.supporter_user_id = sqlc.arg(viewer)
        AND s.kind = 'membership' AND s.status = 'succeeded') AS member
FROM posts p
JOIN creators c ON c.id = p.creator_id
WHERE (sqlc.narg(before_time)::timestamptz IS NULL
       OR (p.created_at, p.id) < (sqlc.narg(before_time)::timestamptz, sqlc.narg(before_id)::uuid))
ORDER BY p.created_at DESC, p.id DESC
LIMIT sqlc.arg(page_size);

-- name: GetPostVisibility :one
SELECT visibility FROM posts WHERE id = $1;

-- name: LikePost :exec
INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: UnlikePost :exec
DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2;

-- name: CountLikes :one
SELECT count(*) FROM post_likes WHERE post_id = $1;

-- Like counts for a creator's posts, and which ones the viewer liked.
-- name: CreatorPostLikes :many
SELECT l.post_id, count(*) AS like_count,
    coalesce(bool_or(l.user_id = sqlc.narg(viewer)::uuid), false)::bool AS liked
FROM post_likes l
JOIN posts p ON p.id = l.post_id
WHERE p.creator_id = $1
GROUP BY l.post_id;

-- name: ListSupportsByUser :many
SELECT s.id, s.kind, s.amount, s.message, s.status, s.created_at,
    c.slug, c.display_name, c.avatar_key, t.name AS tier_name
FROM supports s
JOIN creators c ON c.id = s.creator_id
LEFT JOIN tiers t ON t.id = s.tier_id
WHERE s.supporter_user_id = $1
ORDER BY s.created_at DESC
LIMIT 50;
