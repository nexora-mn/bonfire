import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { PayoutItem } from "@/lib/api/payout";
import {
	BANK_LABELS,
	type BankCode,
	PAYOUT_STATUS_LABELS,
} from "@/lib/constants";
import { formatMonthYear, parseMonth } from "@/lib/utils/date";
import { formatMNT } from "@/lib/utils/money";

export function PayoutHistory({ payouts }: { payouts: PayoutItem[] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Шилжүүлгийн түүх"}</CardTitle>
				<CardDescription>
					{
						"Шимтгэлийг хасаад шилжүүлнэ. Шилжээгүй эсвэл доод дүнд хүрээгүй орлого дараагийн сард нэмэгдэнэ."
					}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{payouts.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						{"Одоогоор шилжүүлэг хийгдээгүй байна."}
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm tabular-nums">
							<thead className="text-left text-muted-foreground">
								<tr>
									<th className="py-2 font-medium">{"Сар"}</th>
									<th className="py-2 font-medium">{"Данс"}</th>
									<th className="py-2 font-medium">{"Төлөв"}</th>
									<th className="py-2 text-right font-medium">{"Шимтгэл"}</th>
									<th className="py-2 text-right font-medium">{"Дүн"}</th>
								</tr>
							</thead>
							<tbody>
								{payouts.map((p) => (
									<tr key={p.id}>
										<td className="py-2">
											{formatMonthYear(parseMonth(p.month))}
										</td>
										<td className="py-2 text-muted-foreground">
											{`${BANK_LABELS[p.bankCode as BankCode] ?? p.bankCode} •••• ${p.accountNumber.slice(-4)}`}
										</td>
										<td className="py-2">
											<Badge
												variant={p.status === "paid" ? "default" : "secondary"}
											>
												{PAYOUT_STATUS_LABELS[p.status] ?? p.status}
											</Badge>
											{p.sandbox && (
												<span className="ml-2 text-xs text-muted-foreground">
													{"туршилт"}
												</span>
											)}
										</td>
										<td className="py-2 text-right text-muted-foreground">
											{formatMNT(p.fee)}
										</td>
										<td className="py-2 text-right font-medium">
											{formatMNT(p.amount)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
