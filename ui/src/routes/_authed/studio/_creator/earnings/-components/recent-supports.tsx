import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Earnings } from "@/lib/api/payout";
import { formatDate } from "@/lib/utils/date";
import { formatMNT } from "@/lib/utils/money";

export function RecentSupports({ supports }: { supports: Earnings["recent"] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Сүүлийн дэмжлэгүүд"}</CardTitle>
				<CardDescription>{"Хамгийн сүүлийн 10 дэмжлэг."}</CardDescription>
			</CardHeader>
			<CardContent>
				{supports.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						{
							"Одоогоор дэмжлэг ирээгүй байна. Төлбөр хүлээн авах удахгүй нээгдэнэ."
						}
					</p>
				) : (
					<ul className="flex flex-col gap-2">
						{supports.map((s) => (
							<li
								key={s.id}
								className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3"
							>
								<div className="flex-1 text-sm">
									<p className="font-medium">
										{s.supporterName || "Нэрээ нууцалсан дэмжигч"}
										<span className="font-normal text-muted-foreground">
											{s.kind === "membership"
												? ` · ${s.tierName ?? "Гишүүнчлэл"}`
												: " · Нэг удаагийн"}
										</span>
									</p>
									{s.message && (
										<p className="mt-0.5 text-muted-foreground">{`“${s.message}”`}</p>
									)}
									<p className="mt-0.5 text-xs text-muted-foreground">
										{formatDate(s.createdAt)}
									</p>
								</div>
								<span className="font-semibold tabular-nums">
									{formatMNT(s.amount)}
								</span>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
