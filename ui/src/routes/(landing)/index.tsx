import { createFileRoute } from "@tanstack/react-router";
import { CallToAction } from "./-components/cta";
import { Earnings } from "./-components/earnings";
import { Hero } from "./-components/hero";
import { HowItWorks } from "./-components/how-it-works";
import { Marquee } from "./-components/marquee";
import { PassionWall } from "./-components/passion-wall";
import { SiteFooter } from "./-components/site-footer";
import { SiteHeader } from "./-components/site-header";
import { Supporters } from "./-components/supporters";

export const Route = createFileRoute("/(landing)/")({ component: Home });

function Home() {
	const { user } = Route.useRouteContext();

	return (
		<div className="bg-background text-foreground">
			<SiteHeader signedIn={!!user} />
			<main>
				<Hero />
				<Marquee />
				<PassionWall />
				<HowItWorks />
				<Earnings />
				<Supporters />
				<CallToAction />
			</main>
			<SiteFooter />
		</div>
	);
}
