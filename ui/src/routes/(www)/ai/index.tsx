import { createFileRoute } from "@tanstack/react-router";
import { seo } from "#/lib/seo";
import { CallToAction } from "../-components/cta";
import { AiConcern } from "./-components/concern";
import { AiHero } from "./-components/hero";
import { AiTags } from "./-components/tags";

export const Route = createFileRoute("/(www)/ai/")({
	head: () =>
		seo({
			title: "AI",
			description:
				"AI бол хэрэгсэл, бүтээгч нь та. Bonfire AI-г хэрхэн харж, AI ашигласан бүтээлийг «AI туслалцаатай», «AI үүсгэсэн» гэж хэрхэн тэмдэглэдэг тухай.",
			path: "/ai",
		}),
	component: Ai,
});

function Ai() {
	return (
		<>
			<AiHero />
			<AiConcern />
			<AiTags />
			<CallToAction />
		</>
	);
}
