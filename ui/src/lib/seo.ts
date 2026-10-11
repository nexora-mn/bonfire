export const SITE_NAME = "Bonfire";
export const SITE_URL = (
	import.meta.env.VITE_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
export const DEFAULT_DESCRIPTION =
	"Ажлын дараах цагаараа бүтээдэг зүйлээ хуваалцаж, дэмжигчдээсээ сар бүр орлого ол.";

export function absoluteUrl(path: string) {
	return new URL(path, `${SITE_URL}/`).toString();
}

type SeoInput = {
	/** Page title without the site name; omit for the home page. */
	title?: string;
	description?: string;
	/** Path of the page, e.g. "/blog". Used for the canonical URL. */
	path: string;
	/** Absolute URL of a 1200×630 share image. */
	image?: { url: string; alt?: string };
	type?: "website" | "article";
	/** Keep the page out of search results. */
	noindex?: boolean;
};

/** Title, description, canonical, Open Graph and Twitter tags for a route's `head`. */
export function seo({
	title,
	description = DEFAULT_DESCRIPTION,
	path,
	image,
	type = "website",
	noindex = false,
}: SeoInput) {
	const fullTitle = title
		? `${title} | ${SITE_NAME}`
		: `${SITE_NAME}: ажлын дараах хоббигоо дэмжүүл`;
	const url = absoluteUrl(path);

	const meta = [
		{ title: fullTitle },
		{ name: "description", content: description },
		{ property: "og:type", content: type },
		{ property: "og:url", content: url },
		{ property: "og:title", content: title ?? fullTitle },
		{ property: "og:description", content: description },
		{
			name: "twitter:card",
			content: image ? "summary_large_image" : "summary",
		},
		{ name: "twitter:title", content: title ?? fullTitle },
		{ name: "twitter:description", content: description },
		...(image
			? [
					{ property: "og:image", content: image.url },
					{ property: "og:image:width", content: "1200" },
					{ property: "og:image:height", content: "630" },
					{ name: "twitter:image", content: image.url },
					...(image.alt
						? [
								{ property: "og:image:alt", content: image.alt },
								{ name: "twitter:image:alt", content: image.alt },
							]
						: []),
				]
			: []),
		...(noindex ? [{ name: "robots", content: "noindex" }] : []),
	];

	return { meta, links: [{ rel: "canonical", href: url }] };
}

/** A JSON-LD `<script>` entry for a route's `head().scripts`. */
export function jsonLd(data: Record<string, unknown>) {
	return {
		type: "application/ld+json",
		children: JSON.stringify({ "@context": "https://schema.org", ...data }),
	};
}
