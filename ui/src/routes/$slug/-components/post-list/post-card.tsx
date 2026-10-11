import { getRouteApi } from "@tanstack/react-router";
import { LockedCover } from "@/components/locked-cover";
import { LikeButton } from "@/components/ui/like-button";
import type { PublicProfile } from "@/lib/api/creator";
import { formatDate } from "@/lib/utils/date";

const route = getRouteApi("/$slug/");

export function PostCard({
	post,
	signedIn,
}: {
	post: PublicProfile["posts"][number];
	signedIn: boolean;
}) {
	const { slug } = route.useParams();
	return (
		<article className="px-6 py-6 sm:px-8">
			{post.locked ? (
				<LockedCover slug={slug} />
			) : (
				post.imageUrl && (
					<img
						src={post.imageUrl}
						alt=""
						loading="lazy"
						className="aspect-video w-full rounded-2xl object-cover"
					/>
				)
			)}
			<div className="mt-4">
				<time
					dateTime={post.createdAt}
					className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
				>
					{formatDate(post.createdAt)}
				</time>
				<h3 className="mt-1.5 text-xl font-bold tracking-tight text-balance">
					{post.title}
				</h3>
				{!post.locked && post.body && (
					<p className="mt-3 line-clamp-6 leading-relaxed whitespace-pre-line text-foreground/75">
						{post.body}
					</p>
				)}
				{!post.locked && (
					<div className="-mb-2 -ml-3 pt-3">
						<LikeButton
							postId={post.id}
							liked={post.liked}
							count={post.likeCount}
							signedIn={signedIn}
						/>
					</div>
				)}
			</div>
		</article>
	);
}
