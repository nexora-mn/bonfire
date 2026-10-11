import { createFileRoute, redirect } from "@tanstack/react-router";

// Old URL, kept for bookmarks.
export const Route = createFileRoute("/_authed/dashboard")({
	beforeLoad: () => {
		throw redirect({ to: "/home" });
	},
});
