import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		title?: string;
	}
}

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ context, location }) => {
		if (!context.user) {
			throw redirect({ to: "/login", search: { redirect: location.href } });
		}
		return { user: context.user };
	},
	component: Outlet,
});
