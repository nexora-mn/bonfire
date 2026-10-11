-- Search index snapshots: one row per creator with everything the creators
-- collection stores. `single` picks a single creator; otherwise rows are
-- paged by ID for a full reindex.
-- name: CreatorsForIndex :many
SELECT c.id, c.slug, c.display_name, c.about, c.avatar_key, c.cover_key,
    c.one_time_enabled, c.created_at,
    (SELECT count(*) FROM posts p WHERE p.creator_id = c.id) AS post_count,
    -- Unix seconds, 0 when the creator has not posted.
    coalesce((SELECT extract(epoch FROM max(p.created_at)) FROM posts p
        WHERE p.creator_id = c.id), 0)::bigint AS last_post_at,
    -- Cheapest active tier, 0 when there is none.
    coalesce((SELECT min(t.monthly_price) FROM tiers t
        WHERE t.creator_id = c.id AND t.is_active), 0)::bigint AS min_tier_price,
    coalesce((SELECT array_agg(t.name ORDER BY t.position) FROM tiers t
        WHERE t.creator_id = c.id AND t.is_active), '{}')::text[] AS tier_names,
    coalesce((SELECT array_agg(DISTINCT l.platform) FROM creator_links l
        WHERE l.creator_id = c.id), '{}')::text[] AS link_platforms
FROM creators c
WHERE (sqlc.narg(single)::uuid IS NULL OR c.id = sqlc.narg(single)::uuid)
  AND c.id > sqlc.arg(after)::uuid
ORDER BY c.id
LIMIT sqlc.arg(batch_size);

-- Same as CreatorsForIndex, for the posts collection.
-- name: PostsForIndex :many
SELECT p.id, p.creator_id, p.title, p.body, p.image_key, p.visibility, p.created_at,
    (SELECT count(*) FROM post_likes l WHERE l.post_id = p.id) AS like_count
FROM posts p
WHERE (sqlc.narg(single)::uuid IS NULL OR p.id = sqlc.narg(single)::uuid)
  AND p.id > sqlc.arg(after)::uuid
ORDER BY p.id
LIMIT sqlc.arg(batch_size);

-- Which of `ids` the user liked, to mark search hits.
-- name: LikedAmong :many
SELECT post_id FROM post_likes
WHERE user_id = $1 AND post_id = ANY (sqlc.arg(ids)::uuid[]);

-- Recommendation seeds: what the user recently liked.
-- name: RecentLikes :many
SELECT post_id FROM post_likes WHERE user_id = $1
ORDER BY created_at DESC LIMIT $2;
