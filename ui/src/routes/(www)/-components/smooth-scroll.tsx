import { useLocation, useRouter } from "@tanstack/react-router";
import { MOTION_OK, SMOOTH_SCROLL_SECONDS } from "@/lib/constants";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";

const smoothPaths = ["/", "/qr-code"];

/**
 * Drives #smooth-wrapper/#smooth-content with ScrollSmoother on the animated
 * marketing pages. Render it before the wrapper: React runs its effect ahead
 * of the page's, so the smoother exists before any ScrollTrigger is created.
 *
 * One smoother spans every smooth page. The location updates before the old
 * page unmounts, and ScrollSmoother.create() re-inits every live ScrollTrigger,
 * so re-creating it per path re-pins the outgoing page into spacers its
 * cleanup no longer tracks, and React's unmount then throws.
 */
export function SmoothScroll() {
	const router = useRouter();
	const smooth = useLocation({
		select: (location) =>
			smoothPaths.includes(location.pathname.replace(/(.)\/$/, "$1")),
	});

	useGSAP(
		() => {
			if (!smooth) return;
			const mm = gsap.matchMedia();
			mm.add(MOTION_OK, () => {
				const smoother = ScrollSmoother.create({
					wrapper: "#smooth-wrapper",
					content: "#smooth-content",
					smooth: SMOOTH_SCROLL_SECONDS,
				});
				// Jump to the router's reset/restored position instead of gliding there.
				const unsubscribe = router.subscribe("onRendered", () =>
					smoother.scrollTo(window.scrollY, false),
				);
				return () => {
					unsubscribe();
					smoother.kill();
				};
			});
			return () => mm.revert();
		},
		{ dependencies: [smooth], revertOnUpdate: true },
	);

	return null;
}
