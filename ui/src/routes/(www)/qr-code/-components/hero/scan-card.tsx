import { cn } from "cn";
import { useRef } from "react";
import { QrCode } from "@/components/qr-code";
import { MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { absoluteUrl } from "@/lib/utils/url";

// Places from the FAQ, floating around the card.
const tags = [
	{ label: "Био", className: "top-2 -left-2 -rotate-8 bg-spark" },
	{ label: "Лангуу", className: "top-1/3 -right-4 rotate-6 bg-coral" },
	{ label: "Сториз", className: "bottom-16 -left-6 rotate-3 bg-cream" },
	{
		label: "Гитарын хайрцаг",
		className: "-right-2 bottom-0 -rotate-6 bg-glow",
	},
];

const corners = [
	"top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl",
	"top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl",
	"bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl",
	"bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl",
];

export function ScanCard() {
	const scope = useRef<HTMLDivElement>(null);

	useGSAP(
		(_, contextSafe) => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					const card = scope.current?.querySelector<HTMLElement>("[data-card]");
					if (!card || !contextSafe) return;

					gsap
						.timeline({ delay: 0.4 })
						.fromTo(
							card,
							{
								rotateY: -70,
								rotateX: 20,
								scale: 0.7,
								autoAlpha: 0,
								transformPerspective: 1200,
							},
							{
								rotateY: 0,
								rotateX: 0,
								scale: 1,
								autoAlpha: 1,
								duration: 1.6,
								ease: "expo.out",
							},
						)
						.from(
							"[data-corner]",
							{
								scale: 1.6,
								autoAlpha: 0,
								duration: 0.8,
								ease: "back.out(2)",
								stagger: 0.08,
							},
							"-=0.9",
						)
						.fromTo(
							"[data-tag]",
							{
								scale: 0,
								autoAlpha: 0,
								rotate: () => gsap.utils.random(-40, 40),
							},
							{
								scale: 1,
								autoAlpha: 1,
								rotate: 0,
								duration: 0.8,
								ease: "back.out(2.2)",
								stagger: 0.1,
							},
							"-=0.6",
						);

					gsap.fromTo(
						"[data-laser]",
						{ top: "8%" },
						{
							top: "88%",
							duration: 1.8,
							ease: "sine.inOut",
							repeat: -1,
							yoyo: true,
						},
					);
					gsap.to("[data-corner]", {
						scale: 0.92,
						duration: 1.1,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
					});
					gsap.to("[data-tag]", {
						y: () => gsap.utils.random(-14, 14),
						rotate: () => gsap.utils.random(-8, 8),
						duration: () => gsap.utils.random(2, 3.2),
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
						repeatRefresh: true,
					});

					const tiltX = gsap.quickTo(card, "rotateY", {
						duration: 0.6,
						ease: "power3.out",
					});
					const tiltY = gsap.quickTo(card, "rotateX", {
						duration: 0.6,
						ease: "power3.out",
					});
					const onMove = contextSafe((event: PointerEvent) => {
						const box = scope.current?.getBoundingClientRect();
						if (!box) return;
						tiltX(((event.clientX - box.left) / box.width - 0.5) * 24);
						tiltY(((event.clientY - box.top) / box.height - 0.5) * -24);
					});
					const onLeave = contextSafe(() => {
						tiltX(0);
						tiltY(0);
					});
					const root = scope.current;
					root?.addEventListener("pointermove", onMove);
					root?.addEventListener("pointerleave", onLeave);
					return () => {
						root?.removeEventListener("pointermove", onMove);
						root?.removeEventListener("pointerleave", onLeave);
					};
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
			className="relative mx-auto w-full max-w-sm px-6 py-10 [perspective:1200px]"
		>
			{tags.map((tag) => (
				<span
					key={tag.label}
					data-tag
					data-intro
					aria-hidden="true"
					className={cn(
						"absolute z-10 rounded-full px-4 py-2 text-sm font-bold text-ink shadow-lg shadow-black/30",
						tag.className,
					)}
				>
					{tag.label}
				</span>
			))}

			<div
				data-card
				data-intro
				className="relative rounded-[2.5rem] bg-flame p-5 text-center text-ink shadow-2xl shadow-black/50 [transform-style:preserve-3d]"
			>
				<p className="display-3 text-xl">{"Bonfire дээр намайг дэмжээрэй"}</p>
				<div className="relative mt-4 overflow-hidden rounded-[1.75rem] bg-cream p-6">
					<QrCode value={absoluteUrl("/signup")} className="w-full" />
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-3"
					>
						{corners.map((corner) => (
							<span
								key={corner}
								data-corner
								className={`absolute size-10 border-ember ${corner}`}
							/>
						))}
					</div>
					<span
						aria-hidden="true"
						data-laser
						className="pointer-events-none absolute inset-x-4 top-1/2 hidden h-0.5 rounded-full bg-ember shadow-[0_0_18px_4px_var(--color-ember)] motion-safe:block"
					/>
				</div>
				<p className="mt-4 text-sm font-semibold text-ink/70">
					{"Утасныхаа камераар уншуулаарай"}
				</p>
			</div>
		</div>
	);
}
