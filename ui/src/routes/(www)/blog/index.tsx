import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";
import { seo } from "@/lib/seo";
import { CallToAction } from "../-components/cta";
import { CategoryFilter } from "./-components/category-filter";
import { FeaturedPost } from "./-components/featured-post";
import { PostCard } from "./-components/post-card";
import { fetchPosts } from "./-components/posts";

export const Route = createFileRoute("/(www)/blog/")({
	validateSearch: z.object({ category: z.string().optional() }),
	loader: () => fetchPosts(),
	head: () =>
		seo({
			title: "Блог",
			description:
				"Бүтээгчдийн түүх, зөвлөгөө, Bonfire-ийн шинэ мэдээ. Ажлын дараах бүтээлийн тухай бүх зүйл.",
			path: "/blog",
		}),
	component: Blog,
});

function Blog() {
	const posts = Route.useLoaderData();
	const { category } = Route.useSearch();
	const categories = [...new Set(posts.map((post) => post.category))];
	const [featured, ...rest] = category
		? posts.filter((post) => post.category === category)
		: posts;

	return (
		<>
			<section className="pt-36 pb-24 lg:pt-44 lg:pb-32">
				<Container>
					<p className="font-semibold text-flame">{"Bonfire блог"}</p>
					<h1 className="display-1 mt-4 max-w-6xl">
						{"Галын дэргэдэх түүхүүд"}
					</h1>
					<div className="mt-8 flex flex-wrap items-end justify-between gap-6">
						<p className="max-w-md text-xl text-foreground/65">
							{"Бүтээгчдийн түүх, зөвлөгөө, Bonfire-ийн шинэ мэдээ."}
						</p>
						{/* A filter with one option filters nothing. */}
						{categories.length > 1 && (
							<CategoryFilter categories={categories} active={category} />
						)}
					</div>

					{featured ? (
						<div className="mt-14 flex flex-col gap-6">
							<FeaturedPost post={featured} />
							{rest.length > 0 && (
								<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
									{rest.map((post) => (
										<li key={post.slug}>
											<PostCard post={post} />
										</li>
									))}
								</ul>
							)}
						</div>
					) : (
						<div className="mt-14 flex flex-col items-center gap-6 rounded-2xl bg-card px-6 py-20 text-center">
							<FlameMark className="w-20 -rotate-6" />
							<p className="max-w-md text-lg text-foreground/65">
								{category
									? "Энэ ангилалд одоогоор нийтлэл алга."
									: "Удахгүй анхны нийтлэлүүд гарна."}
							</p>
							{category && (
								<Link
									to="/blog"
									className="font-semibold text-flame underline underline-offset-4"
								>
									{"Бүх нийтлэлийг харах"}
								</Link>
							)}
						</div>
					)}
				</Container>
			</section>
			<CallToAction />
		</>
	);
}
