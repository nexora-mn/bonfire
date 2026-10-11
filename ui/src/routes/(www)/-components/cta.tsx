import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useRef } from "react";
import { Container } from "@/components/container";
import { Doodle } from "@/components/doodle";
import { buttonVariants } from "@/components/ui/button";
import { gsap } from "@/lib/gsap";
import { Band } from "./band";
import { useReveal } from "./use-reveal";

export function CallToAction() {
	const scope = useRef<HTMLElement>(null);
	useReveal(scope, (root) => {
		gsap
			.timeline({
				repeat: -1,
				repeatDelay: 0.4,
				scrollTrigger: {
					trigger: root,
					toggleActions: "play pause resume pause",
				},
			})
			.to("[data-jumper]", {
				scaleY: 0.9,
				scaleX: 1.06,
				duration: 0.18,
				ease: "power2.in",
			})
			.to("[data-jumper]", {
				y: -48,
				scaleY: 1.04,
				scaleX: 0.97,
				duration: 0.45,
				ease: "power2.out",
			})
			.to("[data-jumper]", {
				y: 0,
				scaleY: 1,
				scaleX: 1,
				duration: 0.45,
				ease: "bounce.out",
			});
	});

	return (
		<Band ref={scope} tone="flame" className="overflow-hidden">
			<Container className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
				<div>
					<h2 data-reveal="words" className="display-1">
						{"Дуртай зүйлээрээ орлого ол"}
					</h2>
					<p
						data-reveal="up"
						className="mt-6 max-w-md text-xl text-foreground/75"
					>
						{"Хуудсаа өнөө орой нээгээрэй. Хэн нэгэн дэмжих хүртэл үнэгүй."}
					</p>
					<Link
						data-reveal="up"
						to="/signup"
						className={cn(
							buttonVariants({ variant: "ink", size: "lg" }),
							"mt-9",
						)}
					>
						{"Хуудсаа нээх"}
					</Link>
				</div>
				<div data-jumper className="origin-bottom">
					<Doodle name="jumping" className="mx-auto w-full max-w-md" />
				</div>
			</Container>
		</Band>
	);
}
