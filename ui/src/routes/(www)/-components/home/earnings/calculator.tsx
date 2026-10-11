import { useId } from "react";
import { EARNINGS_MAX_SUPPORTERS } from "@/lib/constants";
import { formatMNT } from "@/lib/utils/money";
import { AnimatedAmount } from "./animated-amount";

export function Calculator({
	prices,
	supporters,
	price,
	monthly,
	onSupportersChange,
	onPriceChange,
}: {
	prices: number[];
	supporters: number;
	price: number;
	monthly: number;
	onSupportersChange: (supporters: number) => void;
	onPriceChange: (price: number) => void;
}) {
	const sliderId = useId();
	const selected = prices.indexOf(price);

	return (
		<div
			data-calculator
			className="relative rounded-[2.5rem] bg-background p-6 text-foreground shadow-2xl shadow-ink/40 sm:p-9"
		>
			<div className="flex items-baseline justify-between gap-4">
				<label htmlFor={sliderId} className="font-medium">
					{"Дэмжигчид"}
				</label>
				<output
					htmlFor={sliderId}
					className="text-2xl font-extrabold tabular-nums"
				>
					{supporters}
				</output>
			</div>
			<input
				id={sliderId}
				type="range"
				min={1}
				max={EARNINGS_MAX_SUPPORTERS}
				value={supporters}
				onChange={(event) => onSupportersChange(Number(event.target.value))}
				className="mt-4 h-2 w-full cursor-pointer accent-flame"
			/>

			<fieldset className="mt-8">
				<legend className="font-medium">{"Сарын дундаж дэмжлэг"}</legend>
				<div className="relative mt-3 grid grid-cols-4 gap-2">
					<span
						aria-hidden="true"
						className="absolute inset-y-0 left-0 w-[calc((100%-1.5rem)/4)] rounded-xl bg-flame transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
						style={{
							transform: `translateX(calc(${selected} * (100% + 0.5rem)))`,
						}}
					/>
					{prices.map((option) => (
						<button
							key={option}
							type="button"
							aria-pressed={price === option}
							onClick={() => onPriceChange(option)}
							className={`relative h-11 cursor-pointer rounded-xl border text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
								price === option
									? "border-transparent text-ink"
									: "border-foreground/15 text-foreground/80 hover:border-foreground/40"
							}`}
						>
							{formatMNT(option)}
						</button>
					))}
				</div>
			</fieldset>

			<div className="mt-8" aria-live="polite">
				<p className="text-sm text-foreground/70">
					{"Таны гарт орох дүн ойролцоогоор"}
				</p>
				<p className="mt-1 text-5xl font-extrabold text-foreground tabular-nums">
					<AnimatedAmount value={monthly} />
					<span className="text-xl font-semibold text-foreground/60">
						{"/сард"}
					</span>
				</p>
				<p className="mt-2 text-sm text-foreground/60">
					{"Жилд "}
					{formatMNT(monthly * 12)}
					{", Bonfire-ийн 5%-ийг хассаны дараа. Гүйлгээний шимтгэл ороогүй."}
				</p>
			</div>
		</div>
	);
}
