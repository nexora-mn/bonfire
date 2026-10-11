import { useRef, useState } from "react";
import { Container } from "@/components/container";
import { MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "../../use-reveal";
import { Calculator } from "./calculator";
import { SupporterCrowd } from "./supporter-crowd";

const prices = [5_000, 10_000, 20_000, 50_000];
const FEE = 0.05;

export function Earnings() {
	const [supporters, setSupporters] = useState(40);
	const [price, setPrice] = useState(10_000);
	const monthly = supporters * price * (1 - FEE);
	const scope = useRef<HTMLElement>(null);
	useReveal(scope);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					const calculator = scope.current?.querySelector("[data-calculator]");
					if (!calculator) return;
					gsap.from(calculator, {
						rotateX: 40,
						rotateY: -24,
						y: 180,
						scale: 0.8,
						autoAlpha: 0,
						transformPerspective: 1400,
						transformOrigin: "50% 100%",
						duration: 1.6,
						ease: "expo.out",
						scrollTrigger: {
							trigger: calculator,
							start: "top 90%",
							once: true,
						},
					});
					gsap.fromTo(
						"[data-glyph]",
						{ rotate: -30, yPercent: 25, scale: 0.8 },
						{
							rotate: 20,
							yPercent: -25,
							scale: 1.1,
							ease: "none",
							scrollTrigger: {
								trigger: scope.current,
								start: "top bottom",
								end: "bottom top",
								scrub: 1,
							},
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
			id="earnings"
			className="light relative isolate scroll-mt-16 overflow-hidden bg-flame py-20 text-foreground lg:py-32"
		>
			<span
				aria-hidden="true"
				data-glyph
				className="pointer-events-none absolute -top-20 -right-24 -z-10 font-heading text-[clamp(22rem,50vw,48rem)] leading-none font-extrabold text-ink/[0.07] select-none"
			>
				{"₮"}
			</span>

			<Container className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
				<div>
					<p data-reveal="up" className="font-hand text-2xl text-foreground/60">
						{"Тооцоолуур"}
					</p>
					<h2 data-reveal="words" className="display-2 mt-3">
						{"Таны оройнууд хэдийг олж чадах вэ?"}
					</h2>
					<p
						data-reveal="up"
						className="mt-6 max-w-lg text-xl leading-relaxed text-foreground/75"
					>
						{
							"Асар олон дагагч хэрэггүй. Санаа тавьдаг хэдэн арван хүн л материал, студийн цаг, шинэ линзний зардлыг чинь нөхөхөд хангалттай."
						}
					</p>
					<div className="mt-10 max-w-md">
						<SupporterCrowd supporters={supporters} />
					</div>
				</div>

				<Calculator
					prices={prices}
					supporters={supporters}
					price={price}
					monthly={monthly}
					onSupportersChange={setSupporters}
					onPriceChange={setPrice}
				/>
			</Container>
		</section>
	);
}
