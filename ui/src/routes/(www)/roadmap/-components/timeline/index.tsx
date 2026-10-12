import { useRef } from "react";
import { MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { roadmapPhases } from "../phases";
import { Phase } from "./phase";

export function Timeline() {
	const scope = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					const fill = scope.current?.querySelector<HTMLElement>("[data-fill]");
					if (!fill) return;
					const scrub = {
						trigger: scope.current,
						start: "top 60%",
						end: "bottom 60%",
						scrub: 0.6,
						invalidateOnRefresh: true,
					};

					gsap.fromTo(
						fill,
						{ scaleY: 0 },
						{ scaleY: 1, ease: "none", scrollTrigger: scrub },
					);
					gsap.fromTo(
						"[data-spark]",
						{ y: 0, autoAlpha: 1 },
						{ y: () => fill.offsetHeight, ease: "none", scrollTrigger: scrub },
					);

					for (const phase of gsap.utils.toArray<HTMLElement>("[data-phase]")) {
						const node = phase.querySelector("[data-node]");
						gsap
							.timeline({
								scrollTrigger: {
									trigger: phase,
									start: "top 60%",
									toggleActions: "play none none reverse",
									toggleClass: node
										? { targets: node, className: "is-lit" }
										: undefined,
								},
							})
							.from(node, { scale: 0.4, duration: 0.6, ease: "back.out(3)" })
							.from(
								phase.querySelector("[data-label]"),
								{ x: -20, autoAlpha: 0, duration: 0.5, ease: "power3.out" },
								0.1,
							)
							.from(
								phase.querySelectorAll("[data-item]"),
								{
									y: 18,
									autoAlpha: 0,
									filter: "blur(6px)",
									duration: 0.6,
									ease: "power3.out",
									stagger: 0.08,
								},
								0.2,
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
		<div ref={scope} className="relative mt-20 max-w-4xl">
			<div
				aria-hidden="true"
				className="absolute top-3 bottom-0 left-[11px] w-0.5 bg-linear-to-b from-foreground/15 from-70% to-transparent"
			>
				<div
					data-fill
					className="size-full origin-top bg-linear-to-b from-flame via-ember to-transparent"
				/>
				<span
					data-spark
					className="invisible absolute -top-1 -left-[5px] size-3 rounded-full bg-flame shadow-[0_0_18px_6px] shadow-flame/60"
				/>
			</div>
			<ol className="space-y-16">
				{roadmapPhases.map((phase) => (
					<Phase key={phase.status} phase={phase} />
				))}
			</ol>
		</div>
	);
}
