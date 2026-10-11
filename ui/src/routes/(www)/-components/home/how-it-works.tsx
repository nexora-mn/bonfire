import { Container } from "@/components/container";
import { Band } from "../band";

const steps = [
	{
		title: "Хуудсаа үүсгэ",
		body: "Юу бүтээдэг, яагаад гэдгээ бич. Гишүүнчлэлийн түвшин эсвэл хандивын сав нэм.",
	},
	{
		title: "Хүмүүстэйгээ хуваалц",
		body: "Холбоосоо нийтэл. Дэмжигчид хоёрхон товшилтоор нэгдэнэ, апп татах шаардлагагүй.",
	},
	{
		title: "Сар бүр орлого ав",
		body: "Бүтээлээ хуваалцсаар бай. Орлого чинь сар бүр банкны данс руу орно.",
	},
];

export function HowItWorks() {
	return (
		<Band tone="flame" id="how-it-works" className="scroll-mt-16">
			<Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
				<div>
					<h2 className="display-2">{"Орлогоо өөрийнхөөрөө"}</h2>
					<p className="mt-6 max-w-md text-xl leading-relaxed text-foreground/70">
						{
							"Хэрхэн орлого олохоо өөрөө шийд. Хуудсаа арав орчим минутад нээгээд, өөрийн хурдаараа бүтээ."
						}
					</p>
				</div>
				<ol className="divide-y divide-foreground/15 border-y border-foreground/15">
					{steps.map((step, i) => (
						<li key={step.title} className="flex gap-6 py-7">
							<span className="font-hand text-4xl leading-none text-foreground/40">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div>
								<h3 className="display-3">{step.title}</h3>
								<p className="mt-2 text-lg text-foreground/65">{step.body}</p>
							</div>
						</li>
					))}
				</ol>
			</Container>
		</Band>
	);
}
