import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PublicProfile } from "@/lib/api/creator";
import { formatMNT } from "@/lib/utils/money";
import { AmountPicker } from "./amount-picker";

// Payments aren't live yet, so the button stays disabled.
export function SupportCard({
	name,
	settings,
}: {
	name: string;
	settings: PublicProfile["oneTime"];
}) {
	const [amount, setAmount] = useState(settings.presets[0] ?? settings.min);

	return (
		<section className="rounded-3xl border bg-card p-6 text-card-foreground shadow-sm">
			<h2 className="text-2xl font-extrabold tracking-tight text-balance">
				{`${name}-г дэмжих`}
			</h2>
			<p className="mt-1 text-sm text-muted-foreground">
				{`Нэг удаагийн дэмжлэг, ${formatMNT(settings.min)}-с эхлэн`}
			</p>
			<AmountPicker
				presets={settings.presets}
				min={settings.min}
				value={amount}
				onChange={setAmount}
				className="mt-5"
			/>
			<Input
				placeholder="Нэр эсвэл @хэрэглэгч"
				aria-label="Нэр"
				className="mt-3 h-12 px-4"
			/>
			<Textarea
				placeholder="Сайхан үг үлдээгээрэй..."
				aria-label="Мессеж"
				className="mt-3 min-h-24 px-4"
			/>
			<Button size="lg" className="mt-5 w-full" disabled>
				{`${formatMNT(amount)} дэмжих`}
			</Button>
			<p className="mt-3 text-center text-xs text-muted-foreground">
				{"Төлбөр хүлээн авах удахгүй нээгдэнэ."}
			</p>
		</section>
	);
}
