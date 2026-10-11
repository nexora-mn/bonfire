import type { RefObject } from "react";
import { MOTION_OK } from "@/lib/constants";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Scroll reveals for elements marked inside `scope`:
 * `data-reveal="words"` rises word by word, `"up"` fades up, and `"stagger"`
 * fades its children up in turn. `setup` adds section-specific motion under
 * the same reduced-motion guard.
 */
export function useReveal(
	scope: RefObject<HTMLElement | null>,
	setup?: (root: HTMLElement) => void,
) {
	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					const root = scope.current;
					if (!root) return;
					const marked = (kind: string) =>
						gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]`, root);

					for (const el of marked("words")) {
						SplitText.create(el, {
							type: "words",
							autoSplit: true,
							onSplit: (self) =>
								gsap.from(self.words, {
									yPercent: 60,
									rotate: 4,
									autoAlpha: 0,
									duration: 0.9,
									ease: "expo.out",
									stagger: 0.05,
									scrollTrigger: { trigger: el, start: "top 85%", once: true },
								}),
						});
					}
					for (const el of marked("up")) {
						gsap.from(el, {
							y: 40,
							autoAlpha: 0,
							duration: 1,
							ease: "power3.out",
							scrollTrigger: { trigger: el, start: "top 88%", once: true },
						});
					}
					for (const el of marked("stagger")) {
						gsap.from(el.children, {
							y: 50,
							autoAlpha: 0,
							duration: 0.9,
							ease: "power3.out",
							stagger: 0.12,
							scrollTrigger: { trigger: el, start: "top 85%", once: true },
						});
					}
					setup?.(root);
				},
				scope,
			);
			return () => mm.revert();
		},
		{ scope },
	);
}
