import { FlameMark } from "./flame-mark";

const words = [
	"Ваар урлал",
	"Гар хийцийн сэтгүүл",
	"Lo-fi хөгжим",
	"Усан будаг",
	"Инди тоглоом",
	"Исгэлэн талх",
	"Гудамжны гэрэл зураг",
	"Богино өгүүллэг",
	"Подкаст",
	"Хатгамал",
];

function Row({ hidden }: { hidden?: boolean }) {
	return (
		<ul aria-hidden={hidden} className="flex shrink-0 items-center gap-8 pr-8">
			{words.map((word) => (
				<li key={word} className="flex items-center gap-8 whitespace-nowrap">
					{word}
					<FlameMark className="size-9 text-primary-foreground" />
				</li>
			))}
		</ul>
	);
}

export function Marquee() {
	return (
		<section
			aria-label="Bonfire дээр хүмүүсийн бүтээдэг зүйлс"
			className="overflow-hidden bg-primary py-5 font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl"
		>
			<div className="marquee flex w-max">
				<Row />
				<Row hidden />
			</div>
		</section>
	);
}
