import { cn } from "cn";
import { useRef } from "react";
import {
	MARQUEE_LOOP_SECONDS,
	MARQUEE_MAX_BOOST,
	MOTION_OK,
} from "@/lib/constants";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type MarqueeRow = {
	words: string[];
	/** Band color and tilt. */
	className: string;
	/** Color of the ✦ between words. */
	star: string;
	reverse: boolean;
};

export function Marquee({
	rows,
	className = "mt-24 lg:mt-32",
}: {
	rows: MarqueeRow[];
	className?: string;
}) {
	const scope = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					const loops = gsap.utils
						.toArray<HTMLElement>("[data-track]")
						.map((track) => {
							const reverse = track.dataset.track === "reverse";
							const loop = gsap.fromTo(
								track,
								{ xPercent: reverse ? -50 : 0 },
								{
									xPercent: reverse ? 0 : -50,
									ease: "none",
									duration: MARQUEE_LOOP_SECONDS,
									repeat: -1,
								},
							);
							// Starts far from zero so scrolling up can play it backwards indefinitely.
							return loop.totalTime(loop.duration() * 100);
						});

					let direction = 1;
					ScrollTrigger.create({
						trigger: scope.current,
						start: "top bottom",
						end: "bottom top",
						onUpdate: (self) => {
							direction = self.direction;
							const boost = gsap.utils.clamp(
								1,
								MARQUEE_MAX_BOOST,
								Math.abs(self.getVelocity()) / 300,
							);
							gsap.to(loops, {
								timeScale: direction * boost,
								duration: 0.25,
								overwrite: true,
								onComplete: () => {
									gsap.to(loops, {
										timeScale: direction,
										duration: 1.2,
										ease: "power2.out",
										overwrite: true,
									});
								},
							});
						},
					});

					for (const row of gsap.utils.toArray<HTMLElement>("[data-row]")) {
						const shift = row.dataset.row === "reverse" ? -4 : 4;
						gsap.fromTo(
							row,
							{ xPercent: -shift },
							{
								xPercent: shift,
								ease: "none",
								scrollTrigger: {
									trigger: scope.current,
									start: "top bottom",
									end: "bottom top",
									scrub: 0.6,
								},
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
		<div
			ref={scope}
			aria-hidden="true"
			className={cn("flex flex-col gap-6 overflow-x-clip", className)}
		>
			{rows.map((row) => (
				<div
					key={row.words[0]}
					data-row={row.reverse ? "reverse" : "forward"}
					className={cn("mx-[-8%] py-4 sm:py-6", row.className)}
				>
					<div
						data-track={row.reverse ? "reverse" : "forward"}
						className="flex w-max will-change-transform"
					>
						{[0, 1].map((copy) => (
							<ul key={copy} className="flex shrink-0">
								{row.words.map((word) => (
									<li
										key={word}
										className="display-2 flex items-center gap-8 pr-8 whitespace-nowrap sm:gap-12 sm:pr-12"
									>
										{word}
										<span className={cn("text-[0.5em]", row.star)}>{"✦"}</span>
									</li>
								))}
							</ul>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
