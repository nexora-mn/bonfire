import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import type { RoadmapPhase } from "../phases";

const statusDot: Record<RoadmapPhase["status"], string> = {
	done: "bg-foreground/50",
	now: "bg-flame",
	next: "bg-ember",
	later: "border border-foreground/40",
};

export function Phase({ phase }: { phase: RoadmapPhase }) {
	const now = phase.status === "now";

	return (
		<li data-phase className="relative pl-12">
			<span
				data-node
				className="absolute top-0 left-0 grid size-6 place-items-center rounded-full bg-background ring-2 ring-foreground/15 transition-[box-shadow] duration-500 [&.is-lit]:ring-flame"
			>
				{now && (
					<span
						aria-hidden="true"
						className="absolute inset-0 animate-ping rounded-full bg-flame/40 motion-reduce:hidden"
					/>
				)}
				<span
					aria-hidden="true"
					className={cn("size-2.5 rounded-full", statusDot[phase.status])}
				/>
			</span>

			<p
				data-label
				className={cn(
					"flex items-center gap-2 leading-6 font-semibold",
					now ? "text-flame" : "text-foreground/70",
				)}
			>
				{phase.label}
				<span className="text-sm font-normal text-foreground/35 tabular-nums">
					{phase.items.length}
				</span>
			</p>

			<ul className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
				{phase.items.map((item) => (
					<li key={item.title} data-item className="flex gap-3">
						{phase.status === "done" ? (
							<HugeiconsIcon
								icon={CheckmarkCircle02Icon}
								aria-hidden="true"
								className="mt-0.5 size-5 shrink-0 text-foreground/40"
							/>
						) : (
							<span
								aria-hidden="true"
								className={cn(
									"mt-2 size-1.5 shrink-0 rounded-full",
									now ? "bg-flame" : "bg-foreground/30",
								)}
							/>
						)}
						<div>
							<h3 className="font-semibold">{item.title}</h3>
							<p className="mt-0.5 text-sm text-foreground/55">{item.body}</p>
						</div>
					</li>
				))}
			</ul>
		</li>
	);
}
