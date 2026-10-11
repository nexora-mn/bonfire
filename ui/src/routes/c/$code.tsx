import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { resolveCode } from "@/lib/api/creator";

// Target of every printed QR code; the code survives slug changes.
export const Route = createFileRoute("/c/$code")({
	beforeLoad: async ({ params }) => {
		const slug = await resolveCode({ data: { code: params.code } });
		if (!slug) throw notFound();
		throw redirect({ to: "/$slug", params: { slug }, statusCode: 302 });
	},
});
