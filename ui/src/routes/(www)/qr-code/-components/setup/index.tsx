import { useId, useRef } from "react";
import { Container } from "@/components/container";
import { MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "../../../-components/use-reveal";
import { SetupCard } from "./setup-card";
import { setupSteps } from "./steps";

// Swoops through the empty space above the staircase of cards.
const PATH = "M 250 40 C 420 -10, 540 10, 620 50 S 790 80, 840 150";

export function QrSetup() {
	const scope = useRef<HTMLElement>(null);
	const maskId = useId();
	useReveal(scope);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				{ motion: MOTION_OK, wide: "(min-width: 768px)" },
				(context) => {
					const { motion, wide } = context.conditions ?? {};
					if (!motion) return;
					const cards = gsap.utils.toArray<HTMLElement>("[data-setup-card]");
					const pop = (card: HTMLElement, i: number) => ({
						from: {
							y: 140,
							rotate: i % 2 ? 10 : -10,
							scale: 0.75,
							autoAlpha: 0,
						},
						icon: card.querySelector("[data-setup-icon]"),
						number: card.querySelector("[data-setup-number]"),
					});

					if (!wide) {
						cards.forEach((card, i) => {
							gsap.from(card, {
								...pop(card, i).from,
								duration: 1,
								ease: "expo.out",
								scrollTrigger: { trigger: card, start: "top 90%", once: true },
							});
						});
						return;
					}

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: scope.current?.querySelector("ol"),
							start: "top 75%",
							end: "bottom 55%",
							scrub: 1,
						},
					});
					tl.fromTo(
						"[data-draw]",
						{ drawSVG: "0%" },
						{ drawSVG: "100%", ease: "none", duration: cards.length },
						0,
					);
					cards.forEach((card, i) => {
						const { from, icon, number } = pop(card, i);
						tl.from(
							card,
							{ ...from, duration: 0.8, ease: "back.out(1.4)" },
							i * 0.9,
						)
							.from(
								icon,
								{
									scale: 0,
									rotate: -120,
									duration: 0.6,
									ease: "back.out(2.5)",
								},
								i * 0.9 + 0.3,
							)
							.from(
								number,
								{
									xPercent: 60,
									autoAlpha: 0,
									duration: 0.6,
									ease: "power3.out",
								},
								i * 0.9 + 0.3,
							);
					});
				},
				scope,
			);
			return () => mm.revert();
		},
		{ scope },
	);

	return (
		<section
			ref={scope}
			className="light relative isolate overflow-hidden bg-flame py-20 text-foreground lg:py-32"
		>
			<Container>
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div>
						<p
							data-reveal="up"
							className="font-hand text-2xl text-foreground/60"
						>
							{"Гурван алхам"}
						</p>
						<h2 data-reveal="words" className="display-2 mt-3">
							{"Хэдхэн секундэд бэлэн"}
						</h2>
					</div>
				</div>

				<div className="relative mt-14 md:mt-20">
					<svg
						aria-hidden="true"
						viewBox="0 0 1000 420"
						preserveAspectRatio="none"
						className="pointer-events-none absolute inset-0 -z-10 hidden size-full md:block"
					>
						<defs>
							<mask id={maskId}>
								<path
									data-draw
									d={PATH}
									fill="none"
									stroke="white"
									strokeWidth={12}
									vectorEffect="non-scaling-stroke"
								/>
							</mask>
						</defs>
						<path
							d={PATH}
							fill="none"
							className="stroke-ink/60"
							strokeWidth={3}
							strokeDasharray="2 12"
							strokeLinecap="round"
							vectorEffect="non-scaling-stroke"
							mask={`url(#${maskId})`}
						/>
					</svg>
					<ol className="grid gap-5 md:grid-cols-3 md:items-start md:gap-6">
						{setupSteps.map((step, i) => (
							<SetupCard key={step.title} step={step} index={i} />
						))}
					</ol>
				</div>
			</Container>
		</section>
	);
}
