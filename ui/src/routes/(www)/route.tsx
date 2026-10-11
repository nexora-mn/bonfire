import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteFooter } from "./-components/site-footer";
import { SiteHeader } from "./-components/site-header";

export const Route = createFileRoute("/(www)")({ component: WwwLayout });

/** Public marketing pages share the header and the footer. */
function WwwLayout() {
	const { user } = Route.useRouteContext();

	return (
		<div id="top" className="dark min-h-svh bg-background text-foreground">
			<SiteHeader signedIn={!!user} />
			<main>
				<Outlet />
			</main>
			<SiteFooter />
		</div>
	);
}
