import { Doodle, type DoodleName } from "./doodle";

type Passion = {
	title: string;
	line: string;
	doodle: DoodleName;
	tint: string;
};

const passions: Passion[] = [
	{
		title: "Бичих",
		line: "Цуврал зохиол, шүлэг, цахим товхимол.",
		doodle: "sitting-reading",
		tint: "bg-cream",
	},
	{
		title: "Хөгжим",
		line: "Шөнийн 2 цагт дуусгасан дуу, ковер, бичлэгүүд.",
		doodle: "dancing",
		tint: "bg-sky/60",
	},
	{
		title: "Бүжиг",
		line: "Бүжиг дэглэлт, хичээл, дасгалын бичлэг.",
		doodle: "ballet",
		tint: "bg-flame/35",
	},
	{
		title: "Зураг ба видео",
		line: "Влог, хальсан зураг, нам гүм хөрөг.",
		doodle: "selfie",
		tint: "bg-sage/60",
	},
	{
		title: "Ургамал",
		line: "Суулгац, арчилгааны зөвлөгөө, гэрийн ногоон булан.",
		doodle: "plant",
		tint: "bg-blush/60",
	},
	{
		title: "Хоол, ундаа",
		line: "Төгс болтол нь туршсан жор, кофе.",
		doodle: "coffee",
		tint: "bg-cream",
	},
	{
		title: "Тэжээвэр амьтан",
		line: "Сургалтын зөвлөгөө, хамгийн хөөрхөн нохойнууд.",
		doodle: "doggie",
		tint: "bg-sage/60",
	},
	{
		title: "Йог ба эрүүл мэнд",
		line: "Өглөөний дасгал, тайван үдэш.",
		doodle: "meditating",
		tint: "bg-flame/35",
	},
	{
		title: "Тэшүүр ба спорт",
		line: "Трик, маршрут, амралтын өдрийн дасгал.",
		doodle: "roller-skating",
		tint: "bg-sky/60",
	},
];

export function PassionWall() {
	return (
		<section
			id="passions"
			className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28"
		>
			<h2 className="max-w-3xl font-heading text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
				{"Ажлын дараах бүх төрлийн бүтээлд"}
			</h2>
			<ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{passions.map((passion) => (
					<li
						key={passion.title}
						className={`group overflow-hidden rounded-[2rem] p-6 ${passion.tint}`}
					>
						<Doodle
							name={passion.doodle}
							className="mx-auto w-full max-w-80 transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105 motion-reduce:transition-none"
						/>
						<h3 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
							{passion.title}
						</h3>
						<p className="mt-1 text-foreground/70">{passion.line}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
