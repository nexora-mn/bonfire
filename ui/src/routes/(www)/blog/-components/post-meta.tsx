import { formatIsoDate } from "@/lib/utils/date";
import type { Post } from "./posts";

export function PostMeta({ post }: { post: Post }) {
	return (
		<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/55">
			<span className="font-semibold text-flame">{post.category}</span>
			<span aria-hidden="true">{"·"}</span>
			<time dateTime={post.date}>{formatIsoDate(post.date)}</time>
			<span aria-hidden="true">{"·"}</span>
			<span>{`${post.readMinutes} мин`}</span>
		</p>
	);
}
