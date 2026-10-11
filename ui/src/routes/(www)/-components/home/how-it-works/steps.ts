import type { DoodleName } from "@/components/doodle";

export type Step = {
	title: string;
	body: string;
	doodle: DoodleName;
	tint: string;
};

export const steps: Step[] = [
	{
		title: "Хуудсаа үүсгэ",
		body: "Юу бүтээдэг, яагаад гэдгээ бич. Гишүүнчлэлийн түвшин эсвэл хандивын сав нэм.",
		doodle: "unboxing",
		tint: "bg-cream",
	},
	{
		title: "Хүмүүстэйгээ хуваалц",
		body: "Холбоосоо нийтэл. Дэмжигчид хоёрхон товшилтоор нэгдэнэ, апп татах шаардлагагүй.",
		doodle: "selfie",
		tint: "bg-spark",
	},
	{
		title: "Сар бүр орлого ав",
		body: "Бүтээлээ хуваалцсаар бай. Орлого чинь сар бүр банкны данс руу орно.",
		doodle: "levitate",
		tint: "bg-coral",
	},
];
