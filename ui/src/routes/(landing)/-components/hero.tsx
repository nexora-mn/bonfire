import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Doodle, type DoodleName } from "./doodle";
import { FlameMark } from "./flame-mark";

type Floater = {
	doodle: DoodleName;
	/** Position, size and visibility within the hero. */
	className: string;
	/** Tile color. Doodles are inked in black, so they need a light backing. */
	tint: string;
	/** How far the tile drifts with the pointer, in px. Larger feels closer. */
	depth: number;
	rotate: number;
	delay: string;
};

// Doodle "stickers" pinned around the headline at different depths.
const floaters: Floater[] = [
	{
		doodle: "moshing",
		className: "left-[3%] top-[7%] w-32 sm:w-44 lg:w-56",
		tint: "bg-sky",
		depth: 44,
		rotate: -8,
		delay: "0s",
	},
	{
		doodle: "chilling",
		className: "right-[3%] top-[9%] w-32 sm:w-40 lg:w-52",
		tint: "bg-flame",
		depth: 30,
		rotate: 7,
		delay: "-1.6s",
	},
	{
		doodle: "reading-side",
		className: "-left-6 top-[46%] hidden w-48 md:block lg:w-60",
		tint: "bg-blush",
		depth: 58,
		rotate: 6,
		delay: "-2.8s",
	},
	{
		doodle: "unboxing",
		className: "-right-4 top-[48%] hidden w-44 md:block lg:w-56",
		tint: "bg-sage",
		depth: 36,
		rotate: -6,
		delay: "-0.9s",
	},
	{
		doodle: "clumsy",
		className: "left-[13%] -bottom-6 hidden w-52 lg:block",
		tint: "bg-cream",
		depth: 22,
		rotate: -4,
		delay: "-3.4s",
	},
];

const stickers = [
	{
		text: "Хандивын сав нээлттэй",
		className: "left-[5%] top-[36%] bg-flame text-ink",
		rotate: -9,
		depth: 34,
	},
	{
		text: "Шинэ бүлэг баасан бүр",
		className: "right-[16%] top-[30%] bg-sky text-ink",
		rotate: 6,
		depth: 40,
	},
	{
		text: "Сард ₮10,000",
		className: "right-[24%] bottom-[12%] bg-cream text-ink",
		rotate: -5,
		depth: 26,
	},
];

/** Feeds the pointer position into CSS vars so tiles drift in parallax. */
function usePointerParallax<T extends HTMLElement>() {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (
			!el ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			!window.matchMedia("(pointer: fine)").matches
		) {
			return;
		}

		let frame = 0;
		const onMove = (event: PointerEvent) => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const rect = el.getBoundingClientRect();
				el.style.setProperty(
					"--mx",
					String((event.clientX - rect.left) / rect.width - 0.5),
				);
				el.style.setProperty(
					"--my",
					String((event.clientY - rect.top) / rect.height - 0.5),
				);
			});
		};
		const onLeave = () => {
			el.style.setProperty("--mx", "0");
			el.style.setProperty("--my", "0");
		};

		el.addEventListener("pointermove", onMove);
		el.addEventListener("pointerleave", onLeave);
		return () => {
			cancelAnimationFrame(frame);
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerleave", onLeave);
		};
	}, []);

	return ref;
}

function depthStyle(depth: number, rotate: number) {
	return { "--depth": depth, "--rot": `${rotate}deg` } as React.CSSProperties;
}

export function Hero() {
	const ref = usePointerParallax<HTMLElement>();

	return (
		<section
			ref={ref}
			className="grain relative isolate flex min-h-[min(calc(100svh-4rem),60rem)] items-center overflow-hidden bg-background text-foreground"
		>
			<div
				aria-hidden="true"
				className="ember-glow absolute inset-x-0 -bottom-1/3 -z-10 mx-auto h-[70%] max-w-5xl rounded-full bg-[radial-gradient(closest-side,var(--color-ember),transparent)] opacity-70 blur-3xl"
			/>

			<div aria-hidden="true" className="absolute inset-0 -z-10">
				{floaters.map((item) => (
					<div
						key={item.doodle}
						className={cn("parallax absolute", item.className)}
						style={depthStyle(item.depth, item.rotate)}
					>
						<div className="bob" style={{ animationDelay: item.delay }}>
							<div className={cn("rounded-[1.75rem] p-2", item.tint)}>
								<Doodle name={item.doodle} priority className="w-full" />
							</div>
						</div>
					</div>
				))}
				{stickers.map((sticker) => (
					<div
						key={sticker.text}
						className={cn(
							"parallax absolute hidden rounded-full px-5 py-2 text-xl xl:block",
							sticker.className,
						)}
						style={depthStyle(sticker.depth, sticker.rotate)}
					>
						{sticker.text}
					</div>
				))}
			</div>

			<div className="relative mx-auto w-full max-w-5xl px-4 py-28 text-center sm:px-6">
				<h1 className="font-heading text-[clamp(3.5rem,12.5vw,11rem)] leading-[0.9] font-bold tracking-[-0.01em]">
					{"Хоббигоо орлого болго."}
				</h1>

				<p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
					{
						"Ажлын дараах цагаараа бүтээдэг зүйлээ хуваалцаж, дэмжигчдээсээ сар бүр орлого ол."
					}
				</p>

				<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
					<Link
						to="/signup"
						className={cn(
							buttonVariants({ size: "lg" }),
							"h-14 px-8 text-lg font-semibold",
						)}
					>
						{"Хуудсаа нээх"}
					</Link>
					<a
						href="#how-it-works"
						className={cn(
							buttonVariants({ variant: "ghost", size: "lg" }),
							"h-14 px-8 text-lg text-foreground hover:bg-foreground/10 hover:text-foreground",
						)}
					>
						{"Хэрхэн ажилладгийг үзэх"}
					</a>
				</div>
			</div>

			<Link
				to="/signup"
				aria-label="Хуудсаа нээх, хэн нэгэн дэмжих хүртэл үнэгүй"
				className="absolute right-[5%] bottom-[8%] hidden size-36 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none 2xl:block"
			>
				<svg viewBox="0 0 200 200" aria-hidden="true" className="spin-slow">
					<defs>
						<path
							id="hero-badge-circle"
							d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"
						/>
					</defs>
					<circle cx="100" cy="100" r="98" className="fill-flame" />
					<text className="fill-ink text-[19px] tracking-[0.06em]">
						<textPath href="#hero-badge-circle">
							{"хуудсаа нээ ✦ дэмжих хүртэл үнэгүй ✦"}
						</textPath>
					</text>
				</svg>
				<FlameMark className="absolute inset-0 m-auto size-12 text-ink" />
			</Link>
		</section>
	);
}
