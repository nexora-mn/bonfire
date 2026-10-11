import { cn } from "cn";
import { useRef } from "react";
import {
	EARNINGS_CROWD_SIZE,
	EARNINGS_MAX_SUPPORTERS,
	MOTION_OK,
} from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";

const tints = ["bg-ink", "bg-cream", "bg-coral", "bg-ink", "bg-spark"];
const perDot = EARNINGS_MAX_SUPPORTERS / EARNINGS_CROWD_SIZE;

export function SupporterCrowd({ supporters }: { supporters: number }) {
	const scope = useRef<HTMLDivElement>(null);
	const lit = Math.max(1, Math.round(supporters / perDot));
	const previous = useRef(lit);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					gsap.from("[data-dot]", {
						scale: 0,
						duration: 0.7,
						ease: "back.out(3)",
						stagger: { each: 0.025, grid: "auto", from: "center" },
						scrollTrigger: {
							trigger: scope.current,
							start: "top 85%",
							once: true,
						},
					});
				},
				scope,
			);
			return () => mm.revert();
		},
		{ scope },
	);

	useGSAP(
		() => {
			const from = previous.current;
			previous.current = lit;
			if (lit <= from || !window.matchMedia(MOTION_OK).matches) return;
			gsap.fromTo(
				gsap.utils.toArray<HTMLElement>("[data-dot]").slice(from, lit),
				{ scale: 0.2, y: -12 },
				{ scale: 1, y: 0, duration: 0.6, ease: "back.out(4)", stagger: 0.02 },
			);
		},
		{ dependencies: [lit], scope },
	);

	return (
		<div ref={scope}>
			<div aria-hidden="true" className="grid grid-cols-10 gap-2 sm:gap-2.5">
				{Array.from({ length: EARNINGS_CROWD_SIZE }, (_, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid
						key={i}
						data-dot
						className={cn(
							"aspect-square rounded-full transition-colors duration-300",
							i < lit ? tints[i % tints.length] : "bg-ink/10",
						)}
					/>
				))}
			</div>
			<p className="mt-4 text-sm font-medium text-foreground/60">
				{`Нэг цэг ≈ ${perDot} дэмжигч`}
			</p>
		</div>
	);
}
