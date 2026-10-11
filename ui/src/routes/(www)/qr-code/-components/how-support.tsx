import { Container } from "@/components/container";
import { Doodle } from "@/components/doodle";
import { Band } from "../../-components/band";

const steps = [
	{ title: "QR кодыг уншуул", body: "Утасны камер хангалттай, апп хэрэггүй." },
	{
		title: "Дүнгээ сонго",
		body: "Нэг удаа дэмжих эсвэл сар бүрийн гишүүнчлэлд нэгдэнэ.",
	},
	{ title: "Дэмжлэг хүрлээ", body: "Мөнгө шууд бүтээгч рүү очно." },
];

export function QrHowSupport() {
	return (
		<Band>
			<Container className="grid items-center gap-14 md:grid-cols-[1.2fr_1fr]">
				<div>
					<h2 className="display-2">{"Дэмжлэг хэрхэн ирдэг вэ"}</h2>
					<ol className="mt-10 divide-y divide-foreground/15 border-y border-foreground/15">
						{steps.map((step, i) => (
							<li key={step.title} className="flex gap-6 py-6">
								<span className="font-hand text-4xl leading-none text-flame">
									{String(i + 1).padStart(2, "0")}
								</span>
								<div>
									<h3 className="display-3">{step.title}</h3>
									<p className="mt-1 text-lg text-foreground/65">{step.body}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
				<div className="mx-auto w-full max-w-md rounded-[2.5rem] bg-spark p-8">
					<Doodle name="selfie" className="w-full" />
				</div>
			</Container>
		</Band>
	);
}
