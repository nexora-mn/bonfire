import { QrCode } from "@/components/qr-code";
import { absoluteUrl } from "@/lib/utils/url";

export function ScanScreen() {
	return (
		<div
			data-screen
			className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink p-6 text-cream"
		>
			<div className="relative w-full rounded-3xl bg-cream p-5">
				<QrCode value={absoluteUrl("/signup")} className="w-full" />
				<span
					aria-hidden="true"
					data-phone-laser
					className="absolute inset-x-3 top-1/2 h-0.5 rounded-full bg-ember shadow-[0_0_14px_3px_var(--color-ember)]"
				/>
			</div>
			<p className="text-sm font-semibold tracking-wide text-cream/70">
				{"Уншуулж байна…"}
			</p>
		</div>
	);
}
