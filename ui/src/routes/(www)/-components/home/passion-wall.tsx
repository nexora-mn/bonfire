import { cn } from "cn";
import { Container } from "@/components/container";
import { Doodle, type DoodleName } from "@/components/doodle";
import { Band } from "../band";

type Passion = {
	title: string;
	line: string;
	doodle: DoodleName;
	/** Card color; doodles are inked in black, so it must stay bright. */
	tint: string;
};

const passions: Passion[] = [
	{
		title: "Бичих",
		line: "Цуврал зохиол, шүлэг, цахим товхимол.",
		doodle: "sitting-reading",
		tint: "bg-amber",
	},
	{
		title: "Хөгжим",
		line: "Шөнийн 2 цагт дуусгасан дуу, ковер, бичлэгүүд.",
		doodle: "dancing",
		tint: "bg-spark",
	},
	{
		title: "Бүжиг",
		line: "Бүжиг дэглэлт, хичээл, дасгалын бичлэг.",
		doodle: "ballet",
		tint: "bg-flame",
	},
	{
		title: "Зураг ба видео",
		line: "Влог, хальсан зураг, нам гүм хөрөг.",
		doodle: "selfie",
		tint: "bg-glow",
	},
	{
		title: "Ургамал",
		line: "Суулгац, арчилгааны зөвлөгөө, гэрийн ногоон булан.",
		doodle: "plant",
		tint: "bg-coral",
	},
	{
		title: "Хоол, ундаа",
		line: "Төгс болтол нь туршсан жор, кофе.",
		doodle: "coffee",
		tint: "bg-amber",
	},
	{
		title: "Тэжээвэр амьтан",
		line: "Сургалтын зөвлөгөө, хамгийн хөөрхөн нохойнууд.",
		doodle: "doggie",
		tint: "bg-glow",
	},
	{
		title: "Йог ба эрүүл мэнд",
		line: "Өглөөний дасгал, тайван үдэш.",
		doodle: "meditating",
		tint: "bg-flame",
	},
	{
		title: "Тэшүүр ба спорт",
		line: "Трик, маршрут, амралтын өдрийн дасгал.",
		doodle: "roller-skating",
		tint: "bg-spark",
	},
];

export function PassionWall() {
	return (
		<Band id="passions" className="scroll-mt-16">
			<Container>
				<div className="flex flex-wrap items-end justify-between gap-6">
					<h2 className="display-2 max-w-3xl">
						{"Ажлын дараах бүх төрлийн бүтээлд"}
					</h2>
					<p className="max-w-sm text-lg text-foreground/65">
						{"Шүлгээс подкаст хүртэл, усан будгаас исгэлэн талх хүртэл."}
					</p>
				</div>
				<ul className="mt-14 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
					{passions.map((passion) => (
						<li key={passion.title} className="group">
							<div
								className={cn(
									"overflow-hidden rounded-[2rem] p-6",
									passion.tint,
								)}
							>
								<Doodle
									name={passion.doodle}
									className="mx-auto w-full max-w-64 transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
								/>
							</div>
							<h3 className="display-3 mt-5">{passion.title}</h3>
							<p className="mt-1.5 text-foreground/60">{passion.line}</p>
						</li>
					))}
				</ul>
			</Container>
		</Band>
	);
}
