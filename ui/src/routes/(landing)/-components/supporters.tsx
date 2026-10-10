import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Doodle } from "./doodle";

const points = [
	{
		title: "Дуртай бүтээлээ дэмж",
		body: "Сар бүрийн гишүүнчлэлд нэгдэх эсвэл нэг удаа хандив өгөөрэй. Мөнгө чинь бүтээгч рүү шууд очно.",
	},
	{
		title: "Боломжоороо төл",
		body: "Ихэнх гишүүнчлэл ₮5,000–₮10,000-аас эхэлдэг. Түвшнээ хүссэн үедээ солино.",
	},
	{
		title: "Нэг товшилтоор цуцал",
		body: "Гэрээ, далд сунгалт байхгүй. Гишүүнчлэлээ хүссэн үедээ бүртгэлээсээ зогсоох эсвэл түр хойшлуулна.",
	},
];

export function Supporters() {
	return (
		<section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
			<Doodle name="loving" className="mx-auto w-full max-w-xl lg:order-2" />
			<div>
				<h2 className="max-w-xl font-heading text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
					{"Дэмжигчдэд чинь энгийн"}
				</h2>
				<ul className="mt-10 space-y-7">
					{points.map((point) => (
						<li key={point.title} className="flex gap-4">
							<HugeiconsIcon
								icon={CheckmarkCircle02Icon}
								aria-hidden="true"
								className="mt-1 size-7 shrink-0 text-primary"
							/>
							<div>
								<h3 className="font-heading text-2xl font-bold tracking-tight">
									{point.title}
								</h3>
								<p className="mt-1 max-w-md text-lg leading-relaxed text-foreground/70">
									{point.body}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
