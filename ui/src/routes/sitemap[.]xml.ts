import { createFileRoute } from "@tanstack/react-router";
import { sanity } from "#/lib/sanity";
import { absoluteUrl } from "#/lib/seo";

const staticPaths = ["/", "/blog", "/ai", "/qr-code"];

const postsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
	"slug": slug.current,
	"updatedAt": _updatedAt
}`;

function entry(path: string, lastmod?: string) {
	const loc = `<loc>${absoluteUrl(path)}</loc>`;
	return `<url>${loc}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const posts =
					await sanity.fetch<{ slug: string; updatedAt: string }[]>(postsQuery);
				const urls = [
					...staticPaths.map((path) => entry(path)),
					...posts.map((post) =>
						entry(`/blog/${encodeURIComponent(post.slug)}`, post.updatedAt),
					),
				];
				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
				return new Response(xml, {
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				});
			},
		},
	},
});
