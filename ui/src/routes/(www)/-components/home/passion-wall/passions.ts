import type { DoodleName } from "@/components/doodle";

export type Passion = {
	title: string;
	line: string;
	doodle: DoodleName;
	/** Card color; doodles are inked in black, so it must stay bright. */
	tint: string;
};

export const passions: Passion[] = [
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
