import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Container } from "@/components/container";
import { seo } from "@/lib/seo";
import { CallToAction } from "../-components/cta";
import { useReveal } from "../-components/use-reveal";
import { Timeline } from "./-components/timeline";

export const Route = createFileRoute("/(www)/roadmap/")({
	head: () =>
		seo({
			title: "Замын зураг",
			description:
				"Bonfire-д юу гарсан, одоо юун дээр ажиллаж байгаа, цаашид юу хийхээр төлөвлөж байгаа вэ.",
			path: "/roadmap",
		}),
	component: RoadmapPage,
});

function RoadmapPage() {
	const scope = useRef<HTMLElement>(null);
	useReveal(scope);

	return (
		<>
			<section ref={scope} className="pt-36 pb-24 lg:pt-44 lg:pb-32">
				<Container>
					<p className="font-semibold text-flame">{"Замын зураг"}</p>
					<h1 data-reveal="words" className="display-1 mt-4 max-w-6xl">
						{"Бид хаашаа явж байна"}
					</h1>
					<p className="mt-8 max-w-md text-xl text-foreground/65">
						{
							"Юу гарсан, одоо юун дээр ажиллаж байгаа, цаашид юу хийхээр төлөвлөж байгаа вэ."
						}
					</p>
					<Timeline />
				</Container>
			</section>
			<CallToAction />
		</>
	);
}
