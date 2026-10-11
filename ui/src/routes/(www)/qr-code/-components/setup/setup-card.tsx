import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import type { setupSteps } from "./steps";

export function SetupCard({
	step,
	index,
}: {
	step: (typeof setupSteps)[number];
	index: number;
}) {
	return (
		<li
			data-setup-card
			className={cn(
				"relative overflow-hidden rounded-[2.5rem] bg-cream p-8 text-ink shadow-2xl shadow-ink/25",
				step.offset,
			)}
		>
			<span
				aria-hidden="true"
				data-setup-number
				className="pointer-events-none absolute -top-6 -right-2 font-heading text-[9rem] leading-none font-extrabold text-transparent [-webkit-text-stroke:2px_color-mix(in_oklab,var(--color-ink)_18%,transparent)]"
			>
				{String(index + 1).padStart(2, "0")}
			</span>
			<span
				data-setup-icon
				className="grid size-16 place-items-center rounded-2xl bg-ink text-cream"
			>
				<HugeiconsIcon icon={step.icon} aria-hidden="true" className="size-7" />
			</span>
			<h3 className="display-3 mt-10">{step.title}</h3>
			<p className="mt-2 text-lg text-ink/65">{step.body}</p>
		</li>
	);
}
