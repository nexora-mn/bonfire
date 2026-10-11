import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { PostImage } from "./post-image";
import { PostMeta } from "./post-meta";
import type { Post } from "./posts";

export function FeaturedPost({ post }: { post: Post }) {
	return (
		<Link
			to="/blog/$slug"
			params={{ slug: post.slug }}
			className="group grid overflow-hidden rounded-2xl bg-card transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:grid-cols-[1.35fr_1fr]"
		>
			<div className="overflow-hidden">
				<PostImage
					image={post.coverImage}
					seed={post.slug}
					aspect={16 / 10}
					sizes="(min-width: 64rem) 55vw, 100vw"
					priority
					className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
				/>
			</div>
			<div className="flex flex-col justify-center gap-5 p-7 sm:p-10 lg:p-12">
				<span className="w-fit rounded-full bg-flame px-3 py-1 text-xs font-bold tracking-wide text-ink uppercase">
					{"Онцлох"}
				</span>
				<PostMeta post={post} />
				<h2 className="text-4xl leading-[1.05] font-extrabold tracking-[-0.025em] text-balance decoration-flame decoration-4 underline-offset-8 group-hover:underline sm:text-5xl">
					{post.title}
				</h2>
				<p className="max-w-lg text-lg text-foreground/65">{post.excerpt}</p>
				<span className="flex items-center gap-1.5 font-semibold">
					{"Нийтлэлийг унших"}
					<HugeiconsIcon
						icon={ArrowRight01Icon}
						className="size-5 transition-transform group-hover:translate-x-1"
					/>
				</span>
			</div>
		</Link>
	);
}
