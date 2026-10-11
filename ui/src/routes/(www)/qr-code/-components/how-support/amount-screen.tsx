import { FlameMark } from "@/components/flame-mark";
import { formatMNT } from "@/lib/utils/money";

const amounts = [5_000, 10_000, 20_000];

export function AmountScreen() {
	return (
		<div
			data-screen
			className="absolute inset-0 flex flex-col bg-cream p-5 pt-10 text-ink"
		>
			<div className="mx-auto grid size-16 place-items-center rounded-full bg-ink">
				<FlameMark className="size-9 text-cream" />
			</div>
			<p className="mt-4 text-center font-heading text-xl font-extrabold">
				{"Дүнгээ сонго"}
			</p>
			<div className="mt-5 grid grid-cols-2 rounded-full bg-ink/10 p-1 text-center text-xs font-bold">
				<span className="rounded-full bg-ink py-2 text-cream">
					{"Нэг удаа"}
				</span>
				<span className="py-2 text-ink/60">{"Сар бүр"}</span>
			</div>
			<div className="relative mt-4 grid gap-2">
				<span
					aria-hidden="true"
					data-chip-pill
					className="absolute inset-x-0 top-0 h-12 rounded-2xl bg-flame"
				/>
				{amounts.map((amount) => (
					<span
						key={amount}
						className="relative grid h-12 place-items-center rounded-2xl border border-ink/15 font-bold"
					>
						{formatMNT(amount)}
					</span>
				))}
			</div>
			<span
				data-pay
				className="mt-auto grid h-12 place-items-center rounded-2xl bg-ink font-bold text-cream"
			>
				{"Дэмжих"}
			</span>
		</div>
	);
}
