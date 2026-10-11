import { Link } from "@tanstack/react-router";
import { InitialAvatar } from "@/components/initial-avatar";
import { LockedCover } from "@/components/locked-cover";
import { LikeButton } from "@/components/ui/like-button";
import type { FeedPost } from "@/lib/api/fan";
import { formatDayMonth } from "@/lib/utils/date";

export function FeedPostCard({ post }: { post: FeedPost }) {
	return (
		<article className="flex gap-3 rounded-3xl bg-card p-4 shadow-sm">
			<Link
				to="/$slug"
				params={{ slug: post.creator.slug }}
				className="shrink-0"
			>
				<InitialAvatar
					src={post.creator.avatarUrl}
					name={post.creator.displayName}
					className="size-10"
				/>
			</Link>
			<div className="min-w-0 flex-1">
				<p className="flex items-baseline gap-1 text-sm">
					<Link
						to="/$slug"
						params={{ slug: post.creator.slug }}
						className="truncate font-bold hover:underline"
					>
						{post.creator.displayName}
					</Link>
					<span className="truncate text-muted-foreground">
						{`@${post.creator.slug} · ${formatDayMonth(post.createdAt)}`}
					</span>
				</p>
				<h3 className="mt-0.5 font-semibold">{post.title}</h3>
				{post.locked ? (
					<LockedCover slug={post.creator.slug} className="mt-3 aspect-video" />
				) : (
					<>
						{post.body && (
							<p className="mt-1 text-[15px] leading-relaxed whitespace-pre-line">
								{post.body}
							</p>
						)}
						{post.imageUrl && (
							<img
								src={post.imageUrl}
								alt=""
								className="mt-3 max-h-[32rem] w-full rounded-2xl object-cover"
							/>
						)}
						<div className="mt-2 -ml-3">
							<LikeButton
								postId={post.id}
								liked={post.liked}
								count={post.likeCount}
								signedIn
							/>
						</div>
					</>
				)}
			</div>
		</article>
	);
}
