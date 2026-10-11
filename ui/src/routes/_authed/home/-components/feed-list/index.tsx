import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type FeedPost, fetchFeed } from "@/lib/api/fan";
import { FeedPostCard } from "./post-card";

/** First page comes from the loader; older posts load on demand. */
export function FeedList({
	posts: firstPage,
	nextCursor: firstCursor,
}: {
	posts: FeedPost[];
	nextCursor: string | null;
}) {
	const [posts, setPosts] = useState(firstPage);
	const [cursor, setCursor] = useState(firstCursor);
	const [pending, setPending] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			{posts.map((post) => (
				<FeedPostCard key={post.id} post={post} />
			))}
			{cursor && (
				<Button
					variant="neutral"
					className="my-4 self-center"
					disabled={pending}
					onClick={async () => {
						setPending(true);
						try {
							const page = await fetchFeed({ data: { before: cursor } });
							setPosts((prev) => [...prev, ...page.posts]);
							setCursor(page.nextCursor ?? null);
						} finally {
							setPending(false);
						}
					}}
				>
					{pending ? "Ачаалж байна…" : "Цааш үзэх"}
				</Button>
			)}
		</div>
	);
}
