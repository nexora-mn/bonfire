import { useRef } from "react";
import { Container } from "@/components/container";
import { DESKTOP_QUERY, MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "../../use-reveal";
import { StepCard } from "./step-card";
import { steps } from "./steps";

// Cards waiting in the deck peek out above the active one.
const PEEK_Y = -26;
const PEEK_SCALE = 0.06;

export function HowItWorks() {
	const scope = useRef<HTMLElement>(null);
	useReveal(scope);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(
				`${MOTION_OK} and ${DESKTOP_QUERY}`,
				() => {
					const cards = gsap.utils.toArray<HTMLElement>("[data-step]");
					const flips = cards.length - 1;
					const deck = (depth: number) => ({
						y: depth * PEEK_Y,
						scale: 1 - depth * PEEK_SCALE,
						transformOrigin: "50% 0%",
					});
					cards.forEach((card, i) => {
						gsap.set(card, deck(i));
					});

					const tl = gsap.timeline({
						defaults: { duration: 1, ease: "power2.inOut" },
						scrollTrigger: {
							trigger: scope.current,
							start: "top top",
							end: `+=${flips * 100}%`,
							pin: true,
							scrub: 1,
							snap: { snapTo: 1 / flips, duration: 0.6, ease: "power2.inOut" },
						},
					});
					tl.to(
						"[data-progress]",
						{ scaleX: 1, ease: "none", duration: flips },
						0,
					);

					cards.slice(0, -1).forEach((card, i) => {
						tl.to(
							card,
							{
								yPercent: -150,
								rotate: i % 2 ? 14 : -14,
								scale: 0.9,
								ease: "power3.in",
							},
							i,
						).to(
							"[data-digits]",
							{ yPercent: (-100 * (i + 1)) / cards.length },
							i,
						);
						cards.slice(i + 1).forEach((next, depth) => {
							tl.to(next, deck(depth), i);
						});
						tl.from(
							cards[i + 1].querySelector("img"),
							{ scale: 0.6, rotate: -18, yPercent: 20, ease: "back.out(1.6)" },
							i + 0.3,
						);
					});
				},
				scope,
			);

			mm.add(
				`${MOTION_OK} and (max-width: 1023px)`,
				() => {
					for (const card of gsap.utils.toArray<HTMLElement>("[data-step]")) {
						gsap.from(card, {
							y: 100,
							rotate: 4,
							autoAlpha: 0,
							duration: 1,
							ease: "expo.out",
							scrollTrigger: { trigger: card, start: "top 90%", once: true },
						});
					}
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
			id="how-it-works"
			className="light scroll-mt-16 overflow-hidden bg-flame text-foreground"
		>
			<Container className="grid gap-12 py-20 lg:min-h-svh lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:py-24">
				<div>
					<p data-reveal="up" className="font-hand text-2xl text-foreground/60">
						{"Хэрхэн ажилладаг"}
					</p>
					<h2 data-reveal="words" className="display-2 mt-3">
						{"Орлогоо өөрийнхөөрөө"}
					</h2>
					<p
						data-reveal="up"
						className="mt-6 max-w-md text-xl leading-relaxed text-foreground/70"
					>
						{
							"Хэрхэн орлого олохоо өөрөө шийд. Хуудсаа арав орчим минутад нээгээд, өөрийн хурдаараа бүтээ."
						}
					</p>

					<div
						aria-hidden="true"
						className="mt-14 hidden items-end gap-8 lg:motion-safe:flex"
					>
						<div className="h-[1em] overflow-hidden font-heading text-[10rem] leading-none font-extrabold tracking-tighter">
							<div data-digits>
								{steps.map((step, i) => (
									<div key={step.title} className="h-[1em]">
										{String(i + 1).padStart(2, "0")}
									</div>
								))}
							</div>
						</div>
						<div className="mb-8 flex-1">
							<p className="text-sm font-bold tracking-[0.3em] text-foreground/50 uppercase">
								{`/ ${String(steps.length).padStart(2, "0")} алхам`}
							</p>
							<div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/15">
								<div
									data-progress
									className="h-full origin-left scale-x-[0.02] rounded-full bg-ink"
								/>
							</div>
						</div>
					</div>
				</div>

				<ol className="grid gap-6 lg:motion-safe:relative lg:motion-safe:h-[min(36rem,72svh)]">
					{steps.map((step, i) => (
						<StepCard
							key={step.title}
							step={step}
							index={i}
							total={steps.length}
						/>
					))}
				</ol>
			</Container>
		</section>
	);
}
