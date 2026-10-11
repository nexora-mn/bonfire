import { Link } from "@tanstack/react-router";
import { Doodle } from "@/components/doodle";
import { FlameMark } from "@/components/flame-mark";

/** Flame-colored brand side of the auth split screen; hidden below `lg`. */
export function BrandPanel() {
	return (
		<aside className="sticky top-3 m-3 hidden h-[calc(100svh-1.5rem)] flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-flame p-10 text-ink lg:flex xl:p-12">
			<Link
				to="/"
				className="flex w-fit items-center gap-2 text-2xl leading-none font-extrabold"
			>
				{/* The flame is flame-colored, so ink it to show on this background. */}
				<FlameMark className="size-9 [&>path:first-child]:fill-ink" />
				{"Bonfire"}
			</Link>
			<div className="flex min-h-0 flex-col gap-8">
				<h2 className="display-2 max-w-md">{"Хоббигоо орлого болго"}</h2>
				{/* Capped by height too, so short screens keep the caption in view. */}
				<Doodle
					name="dancing"
					priority
					className="max-h-[38svh] w-full max-w-md object-contain object-left"
				/>
			</div>
			<p className="max-w-sm text-ink/70">
				{
					"Ажлын дараах цагаараа бүтээдэг зүйлээ хуваалцаж, дэмжигчдээсээ орлого ол."
				}
			</p>
		</aside>
	);
}
