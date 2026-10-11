import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sanity } from "@/lib/sanity";

export type SanityImage = {
	asset: { _ref: string } | null;
	crop?: { top: number; bottom: number; left: number; right: number };
	hotspot?: { x: number; y: number; height: number; width: number };
	alt?: string;
	lqip?: string;
};

export type Post = {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	/** YYYY-MM-DD */
	date: string;
	readMinutes: number;
	coverImage: SanityImage | null;
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Portable Text blocks, typed as plain JSON so server functions can return them. */
export type PostBodyValue = { [key: string]: Json }[];

export type PostWithBody = Post & {
	body: PostBodyValue;
	updatedAt: string;
};

const imageFields = `asset, crop, hotspot, alt, "lqip": asset->metadata.lqip`;

// ~1000 characters of Cyrillic prose per minute of reading, at least 1.
const postFields = `
	"slug": slug.current,
	title,
	excerpt,
	category,
	"date": publishedAt,
	"readMinutes": select(length(pt::text(body)) >= 1500 => round(length(pt::text(body)) / 1000), 1),
	coverImage { ${imageFields} }
`;

const listQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) { ${postFields} }`;

const postQuery = `{
	"post": *[_type == "post" && slug.current == $slug][0] {
		${postFields},
		"updatedAt": _updatedAt,
		body[] { ..., _type == "image" => { ${imageFields}, caption, "aspect": asset->metadata.dimensions.aspectRatio } }
	},
	"others": *[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3] { ${postFields} }
}`;

export const fetchPosts = createServerFn({ method: "GET" }).handler(
	(): Promise<Post[]> => sanity.fetch<Post[]>(listQuery),
);

export const fetchPost = createServerFn({ method: "GET" })
	.validator(z.object({ slug: z.string() }))
	.handler(async ({ data }) => {
		const result = await sanity.fetch<{
			post: (Post & { body: PostBodyValue | null; updatedAt: string }) | null;
			others: Post[];
		}>(postQuery, { slug: data.slug });
		if (!result.post) throw notFound();
		const post: PostWithBody = { ...result.post, body: result.post.body ?? [] };
		return { post, others: result.others };
	});
