import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Earnings } from "@/lib/api/payout";
import {
	formatMonthShort,
	formatMonthYear,
	parseMonth,
} from "@/lib/utils/date";
import { formatMNT } from "@/lib/utils/money";

// Validated with the dataviz palette checker (CVD + contrast) separately for
// the light and the dark dashboard surface.
const series = [
	{
		key: "membership",
		label: "Гишүүнчлэл",
		className: "bg-[oklch(0.55_0.15_255)] dark:bg-[oklch(0.64_0.13_245)]",
	},
	{
		key: "oneTime",
		label: "Нэг удаагийн",
		className: "bg-[oklch(0.62_0.19_45)] dark:bg-[oklch(0.65_0.17_48)]",
	},
] as const;

/** Stacked monthly bars, with a table view for screen readers. */
export function EarningsChart({ monthly }: { monthly: Earnings["monthly"] }) {
	const totals = monthly.map((m) => m.oneTime + m.membership);
	const max = Math.max(...totals, 1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Сүүлийн 12 сар"}</CardTitle>
				<CardDescription>{"Сар бүрийн орлого, төрлөөр нь."}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<ul className="flex gap-4 text-sm text-muted-foreground">
					{series.map((s) => (
						<li key={s.key} className="flex items-center gap-2">
							<span className={`size-3 rounded-sm ${s.className}`} />
							{s.label}
						</li>
					))}
				</ul>
				<div
					className="flex h-48 items-end gap-1 sm:gap-2"
					role="img"
					aria-label="Сүүлийн 12 сарын орлогын график; дэлгэрэнгүйг доорх хүснэгтээс харна уу."
				>
					{monthly.map((m, i) => (
						<div
							key={m.month}
							className="group relative flex h-full flex-1 flex-col justify-end"
						>
							{/* Stack: oneTime on top of membership, 2px gap between fills. */}
							<div
								className="flex flex-col gap-0.5"
								style={{ height: `${(totals[i] / max) * 100}%` }}
							>
								{[...series]
									.reverse()
									.map((s) =>
										m[s.key] > 0 ? (
											<div
												key={s.key}
												className={`min-h-0.5 basis-0 first:rounded-t ${s.className}`}
												style={{ flexGrow: m[s.key] }}
											/>
										) : null,
									)}
							</div>
							<div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg bg-popover px-3 py-2 text-xs whitespace-nowrap text-popover-foreground shadow-lg group-hover:block">
								<p className="font-medium">
									{formatMonthYear(parseMonth(m.month))}
								</p>
								{series.map((s) => (
									<p
										key={s.key}
										className="flex items-center gap-2 tabular-nums"
									>
										<span className={`size-2 rounded-sm ${s.className}`} />
										{`${s.label}: ${formatMNT(m[s.key])}`}
									</p>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="flex gap-1 text-center text-xs text-muted-foreground sm:gap-2">
					{monthly.map((m) => (
						<span key={m.month} className="flex-1 truncate">
							{formatMonthShort(parseMonth(m.month))}
						</span>
					))}
				</div>
				<details className="text-sm">
					<summary className="cursor-pointer text-muted-foreground">
						{"Хүснэгтээр харах"}
					</summary>
					<table className="mt-2 w-full tabular-nums">
						<thead className="text-left text-muted-foreground">
							<tr>
								<th className="py-1 font-medium">{"Сар"}</th>
								{series.map((s) => (
									<th key={s.key} className="py-1 text-right font-medium">
										{s.label}
									</th>
								))}
								<th className="py-1 text-right font-medium">{"Нийт"}</th>
							</tr>
						</thead>
						<tbody>
							{monthly.map((m, i) => (
								<tr key={m.month}>
									<td className="py-1">
										{formatMonthYear(parseMonth(m.month))}
									</td>
									<td className="py-1 text-right">{formatMNT(m.membership)}</td>
									<td className="py-1 text-right">{formatMNT(m.oneTime)}</td>
									<td className="py-1 text-right font-medium">
										{formatMNT(totals[i])}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</details>
			</CardContent>
		</Card>
	);
}
