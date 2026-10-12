import { useRef } from "react";
import { Container } from "@/components/container";
import { DESKTOP_QUERY, MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "../../use-reveal";
import { PassionCard } from "./passion-card";
import { passions } from "./passions";

export function PassionWall() {
	const scope = useRef<HTMLElement>(null);
	useReveal(scope);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				`${MOTION_OK} and ${DESKTOP_QUERY}`,
				() => {
					const root = scope.current;
					const rail = root?.querySelector<HTMLElement>("[data-rail]");
					const track = root?.querySelector<HTMLElement>("[data-track]");
					if (!root || !rail || !track) return;
					const distance = () => track.scrollWidth - rail.clientWidth;
					// The track moves by transform here, so the rail stops being a
					// scroller; otherwise the swinging cards make it scroll vertically.
					gsap.set(rail, { overflow: "visible" });

					const tl = gsap.timeline({
						defaults: { ease: "none" },
						scrollTrigger: {
							trigger: root,
							start: "top top",
							end: () => `+=${distance()}`,
							pin: true,
							scrub: 1,
							invalidateOnRefresh: true,
						},
					});
					tl.to(track, { x: () => -distance() }, 0)
						.to("[data-progress]", { scaleX: 1 }, 0)
						.fromTo("[data-backdrop]", { xPercent: 0 }, { xPercent: -35 }, 0);

					for (const card of gsap.utils.toArray<HTMLElement>("[data-card]")) {
						const swing = {
							containerAnimation: tl,
							trigger: card,
							start: "left right",
							end: "left 70%",
							scrub: true,
						};
						gsap.fromTo(
							card,
							{
								rotate: 12,
								yPercent: 18,
								scale: 0.8,
								transformOrigin: "0% 100%",
							},
							{
								rotate: 0,
								yPercent: 0,
								scale: 1,
								ease: "power2.out",
								scrollTrigger: swing,
							},
						);
						gsap.fromTo(
							card.querySelector("img"),
							{ rotate: -30, scale: 0.4 },
							{
								rotate: 0,
								scale: 1,
								ease: "back.out(2)",
								scrollTrigger: swing,
							},
						);
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
			id="passions"
			className="relative isolate scroll-mt-16 overflow-hidden py-20 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-24 lg:pb-10"
		>
			<p
				aria-hidden="true"
				data-backdrop
				className="pointer-events-none absolute top-1/2 left-0 -z-10 -translate-y-1/2 font-heading text-[26vw] leading-none font-extrabold tracking-tighter whitespace-nowrap text-transparent [-webkit-text-stroke:2px_color-mix(in_oklab,var(--color-flame)_35%,transparent)]"
			>
				{"Хобби ✦ Бүтээл ✦ Хобби"}
			</p>

			<Container className="flex flex-wrap items-end justify-between gap-6">
				<div>
					<p data-reveal="up" className="font-hand text-2xl text-foreground/50">
						{"Хэнд зориулсан бэ?"}
					</p>
					<h2 data-reveal="words" className="display-2 mt-3 max-w-3xl">
						{"Ажлын дараах бүх төрлийн бүтээлд"}
					</h2>
				</div>
				<p data-reveal="up" className="max-w-sm text-lg text-foreground/65">
					{"Шүлгээс подкаст хүртэл, усан будгаас исгэлэн талх хүртэл."}
				</p>
			</Container>

			<div
				data-rail
				className="mt-12 snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-4 [scrollbar-width:none] lg:mt-14"
			>
				<ul
					data-track
					className="flex w-max gap-5 px-5 sm:px-8 lg:gap-8 lg:px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))]"
				>
					{passions.map((passion, i) => (
						<PassionCard key={passion.title} passion={passion} index={i} />
					))}
				</ul>
			</div>

			<Container
				aria-hidden="true"
				className="mt-6 hidden lg:motion-safe:block"
			>
				<div className="h-1 overflow-hidden rounded-full bg-foreground/10">
					<div
						data-progress
						className="h-full origin-left scale-x-[0.02] rounded-full bg-flame"
					/>
				</div>
			</Container>
		</section>
	);
}
