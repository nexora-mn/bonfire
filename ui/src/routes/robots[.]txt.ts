import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "#/lib/seo";

// Keep signed-in pages and auth callbacks out of search results.
const disallowed = ["/dashboard", "/auth/"];

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: () =>
				new Response(
					[
						"User-agent: *",
						"Allow: /",
						...disallowed.map((path) => `Disallow: ${path}`),
						"",
						`Sitemap: ${absoluteUrl("/sitemap.xml")}`,
						"",
					].join("\n"),
					{ headers: { "Content-Type": "text/plain; charset=utf-8" } },
				),
		},
	},
});
