import { AmountScreen } from "./amount-screen";
import { ScanScreen } from "./scan-screen";
import { ThanksScreen } from "./thanks-screen";

// Screens stack in story order; without motion the last one (thanks) shows.
export function Phone() {
	return (
		<div
			data-phone
			aria-hidden="true"
			className="relative mx-auto aspect-[9/18.5] w-[min(19rem,78vw)] rounded-[3rem] bg-ink p-3 shadow-2xl shadow-black/60 ring-1 ring-cream/10"
		>
			<div className="absolute top-5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
			<div className="relative size-full overflow-hidden rounded-[2.4rem]">
				<ScanScreen />
				<AmountScreen />
				<ThanksScreen />
			</div>
		</div>
	);
}
