import { cn } from "cn";
import { useState } from "react";
import { FlameMark } from "@/components/flame-mark";
import { MAX_AMOUNT } from "@/lib/constants";
import { formatAmount, formatMNT } from "@/lib/utils/money";

export function AmountPicker({
	presets,
	min,
	value,
	onChange,
	className,
}: {
	presets: number[];
	min: number;
	value: number;
	onChange: (amount: number) => void;
	className?: string;
}) {
	const [custom, setCustom] = useState("");
	const fallback = presets[0] ?? min;

	return (
		<div
			className={cn(
				"rounded-2xl border border-flame/40 bg-flame/10 p-3",
				className,
			)}
		>
			{presets.length > 0 && (
				<div className="mb-2 flex items-center gap-2">
					<FlameMark className="size-9 shrink-0" />
					<div className="flex flex-1 flex-wrap gap-2">
						{presets.map((preset) => (
							<button
								key={preset}
								type="button"
								aria-pressed={!custom && value === preset}
								onClick={() => {
									setCustom("");
									onChange(preset);
								}}
								className={cn(
									"h-11 min-w-24 flex-1 rounded-xl border-2 px-2 text-sm font-extrabold tabular-nums transition-colors",
									!custom && value === preset
										? "border-flame bg-flame text-ink"
										: "border-flame/30 bg-card hover:border-flame",
								)}
							>
								{formatMNT(preset)}
							</button>
						))}
					</div>
				</div>
			)}
			<label className="flex h-11 items-center gap-2 rounded-xl border-2 border-transparent bg-card px-3 text-sm focus-within:border-ring">
				<span className="shrink-0 text-muted-foreground">{"Өөр дүн"}</span>
				<input
					type="number"
					inputMode="numeric"
					min={min}
					max={MAX_AMOUNT}
					value={custom}
					placeholder={formatAmount(min)}
					onChange={(e) => {
						setCustom(e.target.value);
						onChange(Number(e.target.value) || fallback);
					}}
					className="w-full min-w-0 bg-transparent text-right font-bold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
				/>
				<span className="font-bold">{"₮"}</span>
			</label>
		</div>
	);
}
