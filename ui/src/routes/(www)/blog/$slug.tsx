import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/container";
import { SITE_NAME } from "@/lib/constants";
import { shareImageUrl } from "@/lib/sanity";
import { jsonLd, seo } from "@/lib/seo";
import { formatIsoDate } from "@/lib/utils/date";
import { absoluteUrl } from "@/lib/utils/url";
import { PostBody } from "./-components/post-body";
import { PostCard } from "./-components/post-card";
import { PostImage } from "./-components/post-image";
import { PostNotFound } from "./-components/post-not-found";
import { fetchPost } from "./-components/posts";

export const Route = createFileRoute("/(www)/blog/$slug")({
	loader: ({ params }) => fetchPost({ data: { slug: params.slug } }),
	head: ({ loaderData, params }) => {
		const path = `/blog/${params.slug}`;
		if (!loaderData) {
			return seo({ title: "Нийтлэл олдсонгүй", path, noindex: true });
		}
		const { post } = loaderData;
		const image = post.coverImage?.asset
			? { url: shareImageUrl(post.coverImage), alt: post.coverImage.alt }
			: undefined;
		const tags = seo({
			title: post.title,
			description: post.excerpt,
			path,
			image,
			type: "article",
		});
		return {
			meta: [
				...tags.meta,
				{ property: "article:published_time", content: post.date },
				{ property: "article:modified_time", content: post.updatedAt },
				{ property: "article:section", content: post.category },
			],
			links: tags.links,
			scripts: [
				jsonLd({
					"@type": "BlogPosting",
					headline: post.title,
					description: post.excerpt,
					datePublished: post.date,
					dateModified: post.updatedAt,
					articleSection: post.category,
					inLanguage: "mn",
					url: absoluteUrl(path),
					mainEntityOfPage: absoluteUrl(path),
					...(image && { image: [image.url] }),
					publisher: {
						"@type": "Organization",
						name: SITE_NAME,
						logo: absoluteUrl("/favicon.svg"),
					},
				}),
			],
		};
	},
	component: BlogPost,
	notFoundComponent: PostNotFound,
});

function BlogPost() {
	const { post, others } = Route.useLoaderData();

	return (
		<>
			<article className="px-5 pt-32 pb-20 sm:px-8 lg:pt-40">
				<div className="mx-auto max-w-4xl">
					<Link
						to="/blog"
						className="group inline-flex items-center gap-2 text-foreground/60 hover:text-foreground"
					>
						<HugeiconsIcon
							icon={ArrowLeft02Icon}
							aria-hidden="true"
							className="size-4 transition-transform group-hover:-translate-x-1"
						/>
						{"Блог"}
					</Link>

					<p className="mt-10 flex flex-wrap items-center gap-3 text-sm text-foreground/55">
						<span className="rounded-full bg-flame px-3 py-1 font-medium text-ink">
							{post.category}
						</span>
						<time dateTime={post.date}>{formatIsoDate(post.date)}</time>
						<span aria-hidden="true">·</span>
						<span>{`${post.readMinutes} минут унших`}</span>
					</p>
					<h1 className="display-1 mt-8">{post.title}</h1>
					<p className="mt-8 max-w-2xl text-xl leading-relaxed text-foreground/65 sm:text-2xl">
						{post.excerpt}
					</p>
				</div>

				{post.coverImage?.asset && (
					<div className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-2xl">
						<PostImage
							image={post.coverImage}
							seed={post.slug}
							aspect={16 / 9}
							sizes="(min-width: 64rem) 64rem, 100vw"
							priority
							className="w-full"
						/>
					</div>
				)}

				<PostBody value={post.body} />

				<div className="mx-auto mt-20 flex max-w-2xl flex-wrap items-center justify-between gap-6 rounded-2xl bg-flame p-8 text-ink sm:p-10">
					<p className="display-3 max-w-sm text-3xl">
						{"Өөрийн гал асаахад бэлэн үү?"}
					</p>
					<Link
						to="/signup"
						className="rounded-full bg-ink px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-ink/85"
					>
						{"Үнэгүй эхлэх"}
					</Link>
				</div>
			</article>

			<section className="py-20 lg:py-28">
				<Container>
					<h2 className="display-2">{"Бусад нийтлэл"}</h2>
					<ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
						{others.map((item) => (
							<li key={item.slug}>
								<PostCard post={item} compact />
							</li>
						))}
					</ul>
				</Container>
			</section>
		</>
	);
}
