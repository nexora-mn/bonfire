import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Doodle } from "./doodle";

const reassurances = [
	"Үнэгүй нээнэ",
	"Орлого олсон үед л Bonfire 5% авна",
	"Сар бүр банкны данс руу шилжүүлнэ",
];

export function CallToAction() {
	return (
		<section id="get-started" className="scroll-mt-16 px-4 pt-24 pb-6 sm:px-6">
			<div className="relative mx-auto grid max-w-7xl items-center gap-4 rounded-[2.5rem] bg-blush/60 px-6 pb-12 sm:px-12 sm:pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:py-16">
				{/* The doodle leaps out of the top edge of the card. */}
				<div className="-mt-20 lg:order-2 lg:-mt-40 lg:-mb-6">
					<Doodle
						name="jumping"
						className="mx-auto w-full max-w-md lg:max-w-none"
					/>
				</div>

				<div>
					<h2 className="max-w-2xl font-heading text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.03em] text-balance">
						{"Дуртай зүйл чинь үлдэгдэл цагаас илүүг хүртэх ёстой"}
					</h2>
					<p className="mt-6 max-w-lg text-lg text-foreground/75">
						{"Хуудсаа өнөө орой нээгээрэй. Хэн нэгэн дэмжих хүртэл үнэгүй."}
					</p>
					<Link
						to="/signup"
						className={cn(
							buttonVariants({ size: "lg" }),
							"mt-9 h-13 px-7 text-base font-semibold",
						)}
					>
						{"Хуудсаа нээх"}
					</Link>
					<ul className="mt-8 flex flex-col gap-3 text-foreground/80 sm:flex-row sm:flex-wrap sm:gap-x-6">
						{reassurances.map((item) => (
							<li key={item} className="flex items-center gap-2">
								<HugeiconsIcon
									icon={CheckmarkCircle02Icon}
									aria-hidden="true"
									className="size-5 shrink-0 text-primary"
								/>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
