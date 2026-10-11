import { cn } from "cn";
import { Doodle } from "@/components/doodle";
import type { Step } from "./steps";

export function StepCard({
	step,
	index,
	total,
}: {
	step: Step;
	index: number;
	total: number;
}) {
	return (
		<li
			data-step
			style={{ zIndex: total - index }}
			className={cn(
				"flex flex-col overflow-hidden rounded-[2.5rem] p-7 text-ink shadow-2xl shadow-ink/25 sm:p-10 lg:motion-safe:absolute lg:motion-safe:inset-0",
				step.tint,
			)}
		>
			<div className="flex items-start justify-between gap-6">
				<span className="font-heading text-lg font-bold tracking-widest text-ink/50">
					{`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
				</span>
				<span className="rounded-full border border-ink/20 px-4 py-1.5 text-sm font-semibold">
					{"Алхам"}
				</span>
			</div>
			<Doodle
				name={step.doodle}
				className="mx-auto my-6 min-h-0 w-full max-w-56 flex-1 object-contain sm:max-w-xs lg:max-w-sm"
			/>
			<h3 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
				{step.title}
			</h3>
			<p className="mt-3 max-w-md text-lg text-ink/70">{step.body}</p>
		</li>
	);
}
