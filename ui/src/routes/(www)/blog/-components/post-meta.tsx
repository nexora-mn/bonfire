import { formatPostDate, type Post } from "./posts";

/** Category, date and reading time, in one line above a post title. */
export function PostMeta({ post }: { post: Post }) {
	return (
		<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/55">
			<span className="font-semibold text-flame">{post.category}</span>
			<span aria-hidden="true">{"·"}</span>
			<time dateTime={post.date}>{formatPostDate(post.date)}</time>
			<span aria-hidden="true">{"·"}</span>
			<span>{`${post.readMinutes} мин`}</span>
		</p>
	);
}
