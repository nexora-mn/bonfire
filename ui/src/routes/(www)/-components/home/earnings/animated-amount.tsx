import { useRef, useState } from "react";
import { MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatMNT } from "@/lib/utils/money";

// GSAP writes the rolling digits straight into the DOM; React only renders
// the first value so it never fights the tween.
export function AnimatedAmount({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null);
	const [initial] = useState(value);
	const shown = useRef({ value });

	useGSAP(
		() => {
			const el = ref.current;
			if (!el || shown.current.value === value) return;
			const animate = window.matchMedia(MOTION_OK).matches;
			gsap.to(shown.current, {
				value,
				duration: animate ? 0.9 : 0,
				ease: "power3.out",
				overwrite: true,
				onUpdate: () => {
					el.textContent = formatMNT(shown.current.value);
				},
			});
			if (animate) {
				gsap.fromTo(
					el,
					{ scale: 1.08 },
					{
						scale: 1,
						duration: 0.8,
						ease: "elastic.out(1, 0.45)",
						overwrite: true,
					},
				);
			}
		},
		{ dependencies: [value] },
	);

	return (
		<>
			<span ref={ref} aria-hidden="true" className="inline-block origin-left">
				{formatMNT(initial)}
			</span>
			<span className="sr-only">{formatMNT(value)}</span>
		</>
	);
}
