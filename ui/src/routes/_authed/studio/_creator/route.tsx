import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/studio/_creator")({
	beforeLoad: ({ context }) => {
		if (!context.creator) throw redirect({ to: "/studio/become" });
		return { creator: context.creator };
	},
	component: Outlet,
});
