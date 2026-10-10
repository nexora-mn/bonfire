import { useId, useState } from "react";
import { Doodle } from "./doodle";

/** Monthly pledge options, in Mongolian tögrög. */
const prices = [5_000, 10_000, 20_000, 50_000];
const FEE = 0.05;

const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * Formats tögrög as "₮380,000". Built by hand rather than with
 * `style: "currency"`, whose MNT output differs between ICU builds and would
 * cause a hydration mismatch between server and browser.
 */
function tugrik(amount: number) {
	return `₮${grouped.format(Math.round(amount))}`;
}

export function Earnings() {
	const [supporters, setSupporters] = useState(40);
	const [price, setPrice] = useState(10_000);
	const sliderId = useId();
	const monthly = supporters * price * (1 - FEE);

	return (
		<section id="earnings" className="scroll-mt-20 bg-flame/45 py-20 lg:py-28">
			<div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
				<div>
					<h2 className="font-heading text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.03em] text-foreground">
						{"Таны оройнууд хэдийг олж чадах вэ?"}
					</h2>
					<p className="mt-6 max-w-lg text-lg text-foreground/80">
						{
							"Асар олон дагагч хэрэггүй. Санаа тавьдаг хэдэн арван хүн л материал, студийн цаг, шинэ линзний зардлыг чинь нөхөхөд хангалттай."
						}
					</p>
					<Doodle name="float" className="mt-6 w-full max-w-md" />
				</div>

				<div className="rounded-[2rem] border-2 border-foreground bg-background p-6 shadow-[8px_8px_0_var(--foreground)] sm:p-8">
					<div className="flex items-baseline justify-between gap-4">
						<label htmlFor={sliderId} className="font-medium text-foreground">
							{"Дэмжигчид"}
						</label>
						<output
							htmlFor={sliderId}
							className="font-heading text-2xl font-bold text-foreground"
						>
							{supporters}
						</output>
					</div>
					<input
						id={sliderId}
						type="range"
						min={1}
						max={500}
						value={supporters}
						onChange={(event) => setSupporters(Number(event.target.value))}
						className="mt-4 h-2 w-full cursor-pointer accent-primary"
					/>

					<fieldset className="mt-8">
						<legend className="font-medium text-foreground">
							{"Сарын дундаж дэмжлэг"}
						</legend>
						<div className="mt-3 grid grid-cols-4 gap-2">
							{prices.map((option) => (
								<button
									key={option}
									type="button"
									aria-pressed={price === option}
									onClick={() => setPrice(option)}
									className={`h-11 cursor-pointer rounded-xl border text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
										price === option
											? "border-primary bg-primary text-primary-foreground"
											: "border-foreground/15 text-foreground hover:border-foreground/40"
									}`}
								>
									{tugrik(option)}
								</button>
							))}
						</div>
					</fieldset>

					<div className="mt-8 rounded-2xl bg-blush/45 p-5" aria-live="polite">
						<p className="text-sm text-foreground/70">
							{"Таны гарт орох дүн ойролцоогоор"}
						</p>
						<p className="mt-1 font-heading text-4xl font-bold sm:text-5xl tracking-tight text-foreground">
							{tugrik(monthly)}
							<span className="text-xl font-semibold text-foreground/60">
								{" сард"}
							</span>
						</p>
						<p className="mt-2 text-sm text-foreground/60">
							{"Жилд "}
							{tugrik(monthly * 12)}
							{
								", Bonfire-ийн 5%-ийг хассаны дараа. Гүйлгээний шимтгэл ороогүй."
							}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
