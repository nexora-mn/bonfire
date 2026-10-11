import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { brandButtonVariants } from "@/components/brand-button";
import { Container } from "@/components/container";
import { Doodle, type DoodleName } from "@/components/doodle";

const tiles: { doodle: DoodleName; tint: string; offset: string }[] = [
	{ doodle: "dancing", tint: "bg-spark", offset: "md:mt-16" },
	{ doodle: "reading-side", tint: "bg-flame", offset: "" },
	{ doodle: "plant", tint: "bg-coral", offset: "md:mt-10" },
];

export function Hero() {
	return (
		<section className="grain relative isolate overflow-hidden pt-36 pb-20 lg:pt-44">
			<Container>
				<h1 className="display-1 max-w-5xl">{"Хоббигоо орлого болго"}</h1>
				<div className="mt-10 flex flex-wrap items-end justify-between gap-8">
					<p className="max-w-lg text-xl leading-relaxed text-foreground/70">
						{
							"Ажлын дараах цагаараа бүтээдэг зүйлээ хуваалцаж, дэмжигчдээсээ сар бүр орлого ол."
						}
					</p>
					<Link to="/signup" className={brandButtonVariants({ size: "lg" })}>
						{"Үнэгүй эхлэх"}
					</Link>
				</div>

				<div
					aria-hidden="true"
					className="mt-16 grid grid-cols-3 items-start gap-3 sm:gap-5"
				>
					{tiles.map((tile) => (
						<div
							key={tile.doodle}
							className={cn(
								"flex aspect-[4/5] items-end overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2.5rem] sm:p-6",
								tile.tint,
								tile.offset,
							)}
						>
							<Doodle name={tile.doodle} priority className="w-full" />
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
