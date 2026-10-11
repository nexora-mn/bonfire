import { useLocation } from "@tanstack/react-router";
import { MOTION_OK, SMOOTH_SCROLL_SECONDS } from "@/lib/constants";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";

const smoothPaths = ["/", "/qr-code"];

/**
 * Drives #smooth-wrapper/#smooth-content with ScrollSmoother on the animated
 * marketing pages. Render it before the wrapper: React runs its effect ahead
 * of the page's, so the smoother exists before any ScrollTrigger is created.
 */
export function SmoothScroll() {
	const pathname = useLocation({
		select: (location) => location.pathname.replace(/(.)\/$/, "$1"),
	});

	useGSAP(
		() => {
			if (!smoothPaths.includes(pathname)) return;
			const mm = gsap.matchMedia();
			mm.add(MOTION_OK, () => {
				const smoother = ScrollSmoother.create({
					wrapper: "#smooth-wrapper",
					content: "#smooth-content",
					smooth: SMOOTH_SCROLL_SECONDS,
				});
				return () => smoother.kill();
			});
			return () => mm.revert();
		},
		{ dependencies: [pathname], revertOnUpdate: true },
	);

	return null;
}
