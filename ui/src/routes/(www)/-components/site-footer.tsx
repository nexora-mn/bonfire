import { Link } from "@tanstack/react-router";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";

const columns = [
	{
		title: "Bonfire",
		links: [
			{ to: "/blog", label: "Блог" },
			{ to: "/ai", label: "AI" },
		],
	},
	{
		title: "Эхлэх",
		links: [
			{ to: "/signup", label: "Бүртгүүлэх" },
			{ to: "/login", label: "Нэвтрэх" },
		],
	},
] as const;

export function SiteFooter() {
	return (
		<footer className="overflow-hidden border-t border-foreground/10 pt-16">
			<Container>
				<div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
					<div>
						<Link
							to="/"
							className="inline-flex items-center gap-2 text-2xl font-extrabold"
						>
							<FlameMark className="size-8 text-foreground" />
							{"Bonfire"}
						</Link>
						<p className="mt-4 max-w-xs text-foreground/60">
							{"Ажлын дараах цагаараа бүтээдэг хүмүүсийн гал."}
						</p>
					</div>
					{columns.map((column) => (
						<nav key={column.title} aria-label={column.title}>
							<h2 className="text-sm font-semibold tracking-wide text-foreground/45 uppercase">
								{column.title}
							</h2>
							<ul className="mt-4 space-y-3">
								{column.links.map((link) => (
									<li key={link.to}>
										<Link
											to={link.to}
											className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
				<p className="mt-16 border-t border-foreground/10 pt-6 text-sm text-foreground/45">
					&copy; {new Date().getFullYear()} {"Bonfire"}
				</p>
			</Container>
			<p
				aria-hidden="true"
				className="pointer-events-none mt-6 mb-[-0.2em] text-center text-[clamp(5rem,24vw,22rem)] leading-[0.8] font-extrabold  text-foreground/6 select-none"
			>
				{"Bonfire"}
			</p>
		</footer>
	);
}
