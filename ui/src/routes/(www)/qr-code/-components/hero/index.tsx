import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useRef } from "react";
import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";
import { MOTION_OK } from "@/lib/constants";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Marquee, type MarqueeRow } from "../../../-components/marquee";
import { ScanCard } from "./scan-card";

const marqueeRows: MarqueeRow[] = [
	{
		words: ["Дэлгэц", "Зурагт хуудас", "Бараа", "Стрим", "Лангуу"],
		className: "-rotate-2 bg-flame text-ink",
		star: "text-ink/40",
		reverse: false,
	},
	{
		words: ["Уншуул", "Дэмж", "Энгийн", "Апп хэрэггүй", "PNG ба SVG"],
		className: "rotate-1 bg-cream text-ink",
		star: "text-ember",
		reverse: true,
	},
];

export function QrHero() {
	const scope = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					const heading = scope.current?.querySelector("h1");
					if (!heading) return;
					SplitText.create(heading, {
						type: "words",
						autoSplit: true,
						onSplit: (self) => {
							gsap.set(heading, { autoAlpha: 1 });
							return gsap.from(self.words, {
								yPercent: 90,
								rotate: () => gsap.utils.random(-12, 12),
								scale: 0.6,
								autoAlpha: 0,
								duration: 1.2,
								ease: "expo.out",
								stagger: 0.18,
							});
						},
					});
					gsap.fromTo(
						"[data-intro='copy']",
						{ y: 30, autoAlpha: 0 },
						{
							y: 0,
							autoAlpha: 1,
							duration: 1,
							ease: "expo.out",
							stagger: 0.12,
							delay: 0.6,
						},
					);
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
			className="grain relative isolate overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/4 right-[-10%] -z-10 size-[40rem] rounded-full bg-flame/20 blur-[120px]"
			/>
			<Container className="grid items-center gap-14 md:grid-cols-[1.3fr_1fr]">
				<div>
					<h1 data-intro="heading" className="display-1">
						{"Уншуул. Дэмж. Энгийн."}
					</h1>
					<p
						data-intro="copy"
						className="mt-8 max-w-md text-xl leading-relaxed text-foreground/70"
					>
						{
							"Өөрийн QR кодоор ямар ч мөчийг дэмжлэг болго. Дэлгэц, зурагт хуудас, бараа, хаана ч."
						}
					</p>
					<Link
						to="/signup"
						data-intro="copy"
						className={cn(buttonVariants({ size: "lg" }), "mt-10")}
					>
						{"QR кодоо авах"}
					</Link>
				</div>

				<ScanCard />
			</Container>
			<Marquee rows={marqueeRows} />
		</section>
	);
}
