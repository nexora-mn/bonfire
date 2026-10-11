import { useRef } from "react";
import { Container } from "@/components/container";
import { DESKTOP_QUERY, MOTION_OK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "../../../-components/use-reveal";
import { Phone } from "./phone";

const steps = [
	{ title: "QR кодыг уншуул", body: "Утасны камер хангалттай, апп хэрэггүй." },
	{
		title: "Дүнгээ сонго",
		body: "Нэг удаа дэмжих эсвэл сар бүрийн гишүүнчлэлд нэгдэнэ.",
	},
	{ title: "Дэмжлэг хүрлээ", body: "Мөнгө шууд бүтээгч рүү очно." },
];

export function QrHowSupport() {
	const scope = useRef<HTMLElement>(null);
	useReveal(scope);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				{ motion: MOTION_OK, desktop: DESKTOP_QUERY },
				(context) => {
					const { motion, desktop } = context.conditions ?? {};
					const root = scope.current;
					if (!motion || !root) return;
					const [scan, amount, thanks] =
						gsap.utils.toArray<HTMLElement>("[data-screen]");
					const items = gsap.utils.toArray<HTMLElement>("[data-support-step]");
					const focus = (i: number) =>
						items.map((item, j) => ({
							item,
							opacity: i === j ? 1 : 0.3,
							x: i === j ? 0 : -8,
						}));

					gsap.to("[data-phone-laser]", {
						top: "90%",
						duration: 1.4,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
					});
					gsap.set(amount, { yPercent: 100 });
					gsap.set(thanks, { clipPath: "circle(0% at 50% 88%)" });

					const tl = gsap.timeline(
						desktop
							? {
									scrollTrigger: {
										trigger: root,
										start: "top top",
										end: "+=220%",
										pin: true,
										scrub: 1,
										snap: {
											snapTo: "labels",
											duration: 0.6,
											ease: "power2.inOut",
										},
									},
								}
							: {
									repeat: -1,
									repeatDelay: 1.2,
									scrollTrigger: {
										trigger: root,
										toggleActions: "play pause resume pause",
									},
								},
					);
					for (const { item, opacity, x } of focus(0))
						gsap.set(item, { opacity, x });

					tl.addLabel("scan")
						.to({}, { duration: 1 })
						.to(scan, {
							scale: 0.9,
							autoAlpha: 0.4,
							duration: 1,
							ease: "power2.inOut",
						})
						.to(amount, { yPercent: 0, duration: 1, ease: "power3.out" }, "<");
					for (const { item, opacity, x } of focus(1))
						tl.to(item, { opacity, x, duration: 0.5 }, "<");
					tl.addLabel("amount")
						.to(
							"[data-chip-pill]",
							{ y: "3.5rem", duration: 0.6, ease: "back.out(2)" },
							"+=0.3",
						)
						.to(
							"[data-pay]",
							{ scale: 0.92, duration: 0.15, yoyo: true, repeat: 1 },
							"+=0.3",
						)
						.to(thanks, {
							clipPath: "circle(150% at 50% 88%)",
							duration: 1,
							ease: "power2.in",
						});
					for (const { item, opacity, x } of focus(2))
						tl.to(item, { opacity, x, duration: 0.5 }, "<");
					tl.from(
						"[data-check]",
						{ scale: 0, rotate: -180, duration: 0.6, ease: "back.out(2.5)" },
						"-=0.2",
					)
						.fromTo(
							"[data-confetti]",
							{ x: 0, y: 0, opacity: 1, rotate: 0 },
							{
								x: () => gsap.utils.random(-130, 130),
								y: () => gsap.utils.random(-120, 160),
								rotate: () => gsap.utils.random(-360, 360),
								opacity: 0,
								duration: 1.2,
								ease: "power3.out",
							},
							"<",
						)
						.addLabel("thanks")
						.to({}, { duration: 1 });
				},
				scope,
			);
			return () => mm.revert();
		},
		{ scope },
	);

	return (
		<section ref={scope} className="relative overflow-hidden">
			<Container className="grid items-center gap-14 py-20 lg:min-h-svh lg:grid-cols-[1.2fr_1fr] lg:py-24">
				<div>
					<p data-reveal="up" className="font-hand text-2xl text-foreground/50">
						{"Дэмжигчийн талаас"}
					</p>
					<h2 data-reveal="words" className="display-2 mt-3">
						{"Дэмжлэг хэрхэн ирдэг вэ"}
					</h2>
					<ol className="mt-10 grid gap-3">
						{steps.map((step, i) => (
							<li
								key={step.title}
								data-support-step
								className="flex gap-6 rounded-[2rem] border border-foreground/10 p-6"
							>
								<span className="font-heading text-4xl leading-none font-extrabold text-flame">
									{String(i + 1).padStart(2, "0")}
								</span>
								<div>
									<h3 className="display-3">{step.title}</h3>
									<p className="mt-1 text-lg text-foreground/65">{step.body}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
				<Phone />
			</Container>
		</section>
	);
}
