import { createFileRoute } from "@tanstack/react-router";
import { sanity } from "@/lib/sanity";
import { absoluteUrl } from "@/lib/utils/url";

const staticPaths = ["/", "/blog", "/qr-code", "/roadmap", "/ai"];

const postsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
	"slug": slug.current,
	"updatedAt": _updatedAt
}`;

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const posts =
					await sanity.fetch<{ slug: string; updatedAt: string }[]>(postsQuery);
				const urls = [
					...staticPaths.map((path) => ({ path, lastmod: undefined })),
					...posts.map((post) => ({
						path: `/blog/${encodeURIComponent(post.slug)}`,
						lastmod: post.updatedAt,
					})),
				].map(
					({ path, lastmod }) =>
						`<url><loc>${absoluteUrl(path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
				);
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
