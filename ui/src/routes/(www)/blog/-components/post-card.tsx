import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { PostImage } from "./post-image";
import { PostMeta } from "./post-meta";
import type { Post } from "./posts";

export function PostCard({
	post,
	compact = false,
}: {
	post: Post;
	compact?: boolean;
}) {
	return (
		<Link
			to="/blog/$slug"
			params={{ slug: post.slug }}
			className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
		>
			<div className="overflow-hidden">
				<PostImage
					image={post.coverImage}
					seed={post.slug}
					aspect={16 / 10}
					sizes="(min-width: 64rem) 30rem, (min-width: 40rem) 50vw, 100vw"
					className="w-full transition-transform duration-500 group-hover:scale-105"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-3 p-6">
				<PostMeta post={post} />
				<h3 className="display-3 text-balance decoration-flame decoration-2 underline-offset-4 group-hover:underline">
					{post.title}
				</h3>
				{!compact && (
					<p className="line-clamp-2 text-foreground/60">{post.excerpt}</p>
				)}
				<span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-foreground/80">
					{"Унших"}
					<HugeiconsIcon
						icon={ArrowRight01Icon}
						className="size-4 transition-transform group-hover:translate-x-1"
					/>
				</span>
			</div>
		</Link>
	);
}
