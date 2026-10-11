import { cn } from "cn";
import { Doodle } from "@/components/doodle";
import type { Passion } from "./passions";

export function PassionCard({
	passion,
	index,
}: {
	passion: Passion;
	index: number;
}) {
	return (
		<li
			data-card
			className="group w-[17rem] shrink-0 snap-start sm:w-[20rem] lg:w-[min(21rem,38svh)] lg:even:mt-14"
		>
			<div
				className={cn(
					"relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] p-6",
					passion.tint,
				)}
			>
				<span className="absolute top-5 left-6 font-heading text-sm font-bold tracking-widest text-ink/50">
					{String(index + 1).padStart(2, "0")}
				</span>
				<Doodle
					name={passion.doodle}
					className="w-full max-w-64 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 motion-reduce:transition-none"
				/>
			</div>
			<h3 className="display-3 mt-5">{passion.title}</h3>
			<p className="mt-1.5 text-foreground/60">{passion.line}</p>
		</li>
	);
}
