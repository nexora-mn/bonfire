import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { seo } from "@/lib/seo";
import { CallToAction } from "../-components/cta";
import { useReveal } from "../-components/use-reveal";
import { ForCreators } from "./-components/for-creators";
import { AiHero } from "./-components/hero";
import { Practices } from "./-components/practices";
import { Principle } from "./-components/principle";

export const Route = createFileRoute("/(www)/ai/")({
	head: () =>
		seo({
			title: "Хиймэл оюун",
			description:
				"AI-н талаарх бидний байр суурь: бид AI-гаар туслуулж бүтээдэг, AI-гаар үүсгүүлдэггүй.",
			path: "/ai",
		}),
	component: AiPage,
});

function AiPage() {
	const scope = useRef<HTMLDivElement>(null);
	useReveal(scope);

	return (
		<div ref={scope}>
			<AiHero />
			<Principle />
			<Practices />
			<ForCreators />
			<CallToAction />
		</div>
	);
}
