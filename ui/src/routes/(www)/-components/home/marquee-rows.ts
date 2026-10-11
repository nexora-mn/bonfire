import type { MarqueeRow } from "../marquee";

export const homeMarqueeRows: MarqueeRow[] = [
	{
		words: ["Бичих", "Хөгжим", "Бүжиг", "Зураг", "Видео", "Подкаст"],
		className: "-rotate-2 bg-flame text-ink",
		star: "text-ink/40",
		reverse: false,
	},
	{
		words: ["Ургамал", "Хоол", "Кофе", "Йог", "Тэшүүр", "Тэжээвэр амьтан"],
		className: "rotate-1 bg-cream text-ink",
		star: "text-ember",
		reverse: true,
	},
];
