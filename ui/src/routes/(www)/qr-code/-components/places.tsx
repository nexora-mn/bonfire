import { cn } from "cn";
import { Container } from "@/components/container";
import { Band } from "../../-components/band";

const places = [
	{
		title: "Зурагт хуудас",
		body: "Тоглолт, үзэсгэлэн, кофе шопын хананд.",
		tint: "bg-flame",
	},
	{
		title: "Бараа, лангуу",
		body: "Футболк, наалт, гар урлалын лангуун дээр.",
		tint: "bg-glow",
	},
	{
		title: "Шууд дамжуулалт",
		body: "Стримийн булан эсвэл видеоны төгсгөлд.",
		tint: "bg-spark",
	},
	{
		title: "Нэрийн хуудас",
		body: "Гитарын хайрцаг, ном, зургийн арын хэсэгт.",
		tint: "bg-coral",
	},
];

export function QrPlaces() {
	return (
		<Band className="pt-0 lg:pt-0">
			<Container>
				<h2 className="display-2">{"Хаана ч байрлуул"}</h2>
				<ul className="mt-14 grid gap-5 sm:grid-cols-2">
					{places.map((place, i) => (
						<li
							key={place.title}
							className={cn(
								"flex min-h-56 flex-col justify-between rounded-[2.5rem] p-8 text-ink",
								place.tint,
							)}
						>
							<span className="font-hand text-3xl leading-none text-ink/50">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div>
								<h3 className="display-3 text-3xl">{place.title}</h3>
								<p className="mt-2 text-lg text-ink/75">{place.body}</p>
							</div>
						</li>
					))}
				</ul>
			</Container>
		</Band>
	);
}
