import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import { Doodle } from "@/components/doodle";
import { formatMNT } from "@/lib/utils/money";

const confetti = [
	"bg-ember",
	"bg-flame",
	"bg-coral",
	"bg-ink",
	"bg-cream",
	"bg-glow",
];

export function ThanksScreen() {
	return (
		<div
			data-screen
			className="absolute inset-0 flex flex-col items-center justify-center bg-spark p-6 text-center text-ink"
		>
			{Array.from({ length: 14 }, (_, i) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative burst
					key={i}
					aria-hidden="true"
					data-confetti
					className={cn(
						"absolute top-1/3 left-1/2 size-2.5 rounded-sm opacity-0",
						confetti[i % confetti.length],
					)}
				/>
			))}
			<span
				data-check
				className="grid size-14 place-items-center rounded-full bg-ink text-spark"
			>
				<HugeiconsIcon
					icon={Tick02Icon}
					aria-hidden="true"
					className="size-8"
				/>
			</span>
			<Doodle name="selfie" className="mt-2 w-full" />
			<p className="font-heading text-2xl font-extrabold">{"Баярлалаа!"}</p>
			<p className="mt-1 text-sm font-semibold text-ink/70">{`+${formatMNT(10_000)}`}</p>
		</div>
	);
}
