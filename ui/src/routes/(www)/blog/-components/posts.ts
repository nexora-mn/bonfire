import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sanity } from "#/lib/sanity";

/** An image field projected with its alt text and blur placeholder. */
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
	/** ISO date, YYYY-MM-DD. */
	date: string;
	readMinutes: number;
	coverImage: SanityImage | null;
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Portable Text blocks, typed as plain JSON so server functions can return them. */
export type PostBodyValue = { [key: string]: Json }[];

export type PostWithBody = Post & {
	body: PostBodyValue;
	/** ISO timestamp of the last edit. */
	updatedAt: string;
};

const imageFields = `asset, crop, hotspot, alt, "lqip": asset->metadata.lqip`;

// ~1000 characters of Cyrillic prose per minute of reading.
const postFields = `
	"slug": slug.current,
	title,
	excerpt,
	category,
	"date": publishedAt,
	"readMinutes": round(length(pt::text(body)) / 1000),
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

function toPost(row: Post): Post {
	return { ...row, readMinutes: Math.max(1, row.readMinutes ?? 1) };
}

/** Newest first. */
export const fetchPosts = createServerFn({ method: "GET" }).handler(
	async (): Promise<Post[]> => {
		const rows = await sanity.fetch<Post[]>(listQuery);
		return rows.map(toPost);
	},
);

export const fetchPost = createServerFn({ method: "GET" })
	.validator(z.object({ slug: z.string() }))
	.handler(async ({ data }) => {
		const result = await sanity.fetch<{
			post: (Post & { body: PostBodyValue | null; updatedAt: string }) | null;
			others: Post[];
		}>(postQuery, { slug: data.slug });
		if (!result.post) throw notFound();
		const post: PostWithBody = {
			...toPost(result.post),
			body: result.post.body ?? [],
			updatedAt: result.post.updatedAt,
		};
		return { post, others: result.others.map(toPost) };
	});

const months = [
	"1-р",
	"2-р",
	"3-р",
	"4-р",
	"5-р",
	"6-р",
	"7-р",
	"8-р",
	"9-р",
	"10-р",
	"11-р",
	"12-р",
];

/**
 * Formats an ISO date as "2026 оны 10-р сарын 6". Built by hand so server and
 * browser render the same string regardless of ICU data.
 */
export function formatPostDate(iso: string) {
	const [year, month, day] = iso.split("-").map(Number);
	return `${year} оны ${months[month - 1]} сарын ${day}`;
}
