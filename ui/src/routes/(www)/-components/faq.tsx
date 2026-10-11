import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef } from "react";
import { Container } from "@/components/container";
import { DESKTOP_QUERY } from "@/lib/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Band } from "./band";
import { useReveal } from "./use-reveal";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
	const scope = useRef<HTMLElement>(null);
	// CSS sticky can't work inside ScrollSmoother's transformed content, so the
	// heading is pinned beside the questions instead.
	useReveal(scope, (root) => {
		const heading = root.querySelector("h2");
		const list = root.querySelector("[data-reveal='stagger']");
		if (!heading || !list) return;
		gsap.matchMedia().add(DESKTOP_QUERY, () => {
			ScrollTrigger.create({
				trigger: heading,
				start: "top 112px",
				end: () => `+=${list.clientHeight - heading.clientHeight}`,
				pin: true,
				pinSpacing: false,
				invalidateOnRefresh: true,
			});
		});
	});

	return (
		<Band ref={scope}>
			<Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
				<h2 data-reveal="words" className="display-2 lg:self-start">
					{"Түгээмэл асуулт"}
				</h2>
				<div data-reveal="stagger" className="border-t border-foreground/15">
					{items.map((item) => (
						<details
							key={item.q}
							onToggle={() => ScrollTrigger.refresh()}
							className="group border-b border-foreground/15"
						>
							<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 text-xl font-semibold tracking-[-0.01em] sm:text-2xl [&::-webkit-details-marker]:hidden">
								{item.q}
								<span className="grid size-11 shrink-0 place-items-center rounded-full bg-foreground/[0.07] transition-[rotate,background-color,color] duration-300 group-open:rotate-45 group-open:bg-flame group-open:text-ink">
									<HugeiconsIcon
										icon={Add01Icon}
										aria-hidden="true"
										className="size-5"
									/>
								</span>
							</summary>
							<p className="max-w-2xl pb-8 text-lg leading-relaxed text-foreground/70">
								{item.a}
							</p>
						</details>
					))}
				</div>
			</Container>
		</Band>
	);
}
