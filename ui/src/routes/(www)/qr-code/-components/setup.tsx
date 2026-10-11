import { Container } from "@/components/container";
import { Band } from "../../-components/band";

const steps = [
	{
		title: "Хянах самбараа нээ",
		body: "Хянах самбарын «QR код» хэсэг рүү ор.",
	},
	{
		title: "QR кодоо татаж ав",
		body: "Зөвхөн танд зориулсан QR кодоо PNG эсвэл SVG-ээр татна.",
	},
	{
		title: "Хуваалц",
		body: "Дэмжигчид чинь харах газар байрлуул. Тэд уншуулаад шууд дэмжинэ.",
	},
];

export function QrSetup() {
	return (
		<Band tone="flame">
			<Container>
				<h2 className="display-2">{"Хэдхэн секундэд бэлэн"}</h2>
				<ol className="mt-14 grid gap-5 md:grid-cols-3">
					{steps.map((step, i) => (
						<li key={step.title} className="rounded-[2.5rem] bg-cream p-8">
							<span className="font-hand text-4xl leading-none text-foreground/40">
								{String(i + 1).padStart(2, "0")}
							</span>
							<h3 className="display-3 mt-8">{step.title}</h3>
							<p className="mt-2 text-lg text-foreground/65">{step.body}</p>
						</li>
					))}
				</ol>
			</Container>
		</Band>
	);
}
