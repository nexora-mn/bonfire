-- name: EarningsTotals :one
SELECT
    coalesce(sum(amount), 0)::bigint AS all_time,
    coalesce(sum(amount) FILTER (WHERE created_at >= sqlc.arg(month_start)::timestamptz), 0)::bigint AS this_month,
    count(*)::bigint AS support_count,
    count(DISTINCT nullif(supporter_name, ''))::bigint AS supporter_count
FROM supports
WHERE creator_id = $1 AND status = 'succeeded';

-- name: EarningsByMonth :many
SELECT
    date_trunc('month', created_at AT TIME ZONE 'Asia/Ulaanbaatar')::date AS month,
    coalesce(sum(amount) FILTER (WHERE kind = 'one_time'), 0)::bigint AS one_time,
    coalesce(sum(amount) FILTER (WHERE kind = 'membership'), 0)::bigint AS membership
FROM supports
WHERE creator_id = $1 AND status = 'succeeded' AND created_at >= sqlc.arg(since)::timestamptz
GROUP BY month
ORDER BY month;

-- name: RecentSupports :many
SELECT s.id, s.kind, s.supporter_name, s.message, s.amount, s.created_at, t.name AS tier_name
FROM supports s
LEFT JOIN tiers t ON t.id = s.tier_id
WHERE s.creator_id = $1 AND s.status = 'succeeded'
ORDER BY s.created_at DESC
LIMIT $2;
