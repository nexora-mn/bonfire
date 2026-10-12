import { useRef } from "react";
import { Container } from "@/components/container";
import { MOTION_OK } from "@/lib/constants";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Band } from "../../../-components/band";
import { stanzas } from "./stanzas";

export function Principle() {
	const scope = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				MOTION_OK,
				() => {
					// Words light up as the reader scrolls through each stanza.
					for (const el of gsap.utils.toArray<HTMLElement>("[data-stanza]")) {
						SplitText.create(el, {
							type: "words",
							autoSplit: true,
							onSplit: (self) =>
								gsap.fromTo(
									self.words,
									{ opacity: 0.15 },
									{
										opacity: 1,
										ease: "none",
										stagger: 0.1,
										scrollTrigger: {
											trigger: el,
											start: "top 80%",
											end: "bottom 55%",
											scrub: true,
										},
									},
								),
						});
					}
					gsap.from("[data-strike]", {
						scaleX: 0,
						duration: 0.6,
						ease: "power2.out",
						delay: 0.6,
						scrollTrigger: {
							trigger: "[data-strike]",
							start: "top 80%",
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

	return (
		<Band className="border-y border-foreground/10 py-28 lg:py-40">
			<Container ref={scope} className="max-w-5xl">
				<p className="font-hand text-2xl text-foreground/60">
					{"Бидний зарчим"}
				</p>
				<div className="mt-10 space-y-10">
					{stanzas.map((stanza) => (
						<p
							key={stanza}
							data-stanza
							className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
						>
							{stanza}
						</p>
					))}
				</div>

				<div className="mt-20 border-t border-foreground/15 pt-10 lg:mt-28">
					<h2 data-reveal="up" className="display-2">
						{"AI бидний ажлыг "}
						<span className="text-flame">{"хурдасгах"}</span>
						{" ёстой, "}
						<span className="relative inline-block text-foreground/40">
							{"орлох"}
							<span
								data-strike
								aria-hidden="true"
								className="absolute inset-x-[-4%] top-[55%] h-[0.08em] origin-left -rotate-3 rounded-full bg-ember"
							/>
						</span>
						{" ёсгүй."}
					</h2>
				</div>
			</Container>
		</Band>
	);
}
