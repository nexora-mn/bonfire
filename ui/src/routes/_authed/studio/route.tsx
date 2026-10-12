import { createFileRoute, Outlet } from "@tanstack/react-router";
import { myCreatorQuery } from "@/lib/api/creator";

export const Route = createFileRoute("/_authed/studio")({
	// Null until the user becomes a creator; pages under _creator require it.
	beforeLoad: async ({ context }) => ({
		creator: await context.queryClient.query(myCreatorQuery),
	}),
	head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
	// Browser-only; the server sends nothing until the creator is known.
	ssr: false,
	component: Outlet,
});
