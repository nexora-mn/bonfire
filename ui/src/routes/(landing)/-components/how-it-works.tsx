import { Doodle, type DoodleName } from "./doodle";

const steps: {
	title: string;
	body: string;
	doodle: DoodleName;
	tint: string;
}[] = [
	{
		title: "Хуудсаа үүсгэ",
		body: "Юу бүтээдэг, яагаад гэдгээ бич. Хэдэн гишүүнчлэлийн түвшин эсвэл зүгээр л хандивын сав нэм. Ердөө арав орчим минут зарцуулна.",
		doodle: "laying",
		tint: "bg-sky",
	},
	{
		title: "Хүмүүстэйгээ хуваалц",
		body: "Дагагчид чинь байдаг газар холбоосоо нийтэл. Дэмжигчид хоёрхон товшилтоор нэгдэнэ, апп татах шаардлагагүй.",
		doodle: "groovy",
		tint: "bg-blush",
	},
	{
		title: "Сар бүр орлого ав",
		body: "Дууссан бүтээл, хийж буй ажлаа хуваалц. Орлого чинь сар бүр банкны данс руу чинь орно.",
		doodle: "levitate",
		tint: "bg-sage",
	},
];

export function HowItWorks() {
	return (
		<section id="how-it-works" className="scroll-mt-20 bg-muted/40">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
				<h2 className="max-w-3xl font-heading text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
					{"Хоббиос тогтмол дэмжлэг хүртэл"}
				</h2>
				<ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
					{steps.map((step, i) => (
						<li key={step.title}>
							<div className={`max-w-sm rounded-[2rem] p-4 ${step.tint}`}>
								<Doodle name={step.doodle} className="w-full" />
							</div>
							<p className="outline-numeral mt-6 font-heading text-7xl leading-none font-bold">
								{i + 1}
							</p>
							<h3 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
								{step.title}
							</h3>
							<p className="mt-3 max-w-sm text-lg leading-relaxed text-foreground/70">
								{step.body}
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
