import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteFooter } from "./-components/site-footer";
import { SiteHeader } from "./-components/site-header";
import { SmoothScroll } from "./-components/smooth-scroll";

export const Route = createFileRoute("/(www)")({ component: WwwLayout });

function WwwLayout() {
	const { user } = Route.useRouteContext();

	return (
		<div id="top" className="dark min-h-svh bg-background text-foreground">
			<SiteHeader signedIn={!!user} />
			<SmoothScroll />
			<div id="smooth-wrapper">
				<div id="smooth-content" className="bg-background">
					<main>
						<Outlet />
					</main>
					<SiteFooter />
				</div>
			</div>
		</div>
	);
}
