import { Link } from "@tanstack/react-router";
import { cn } from "cn";

const pill =
	"rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** Category pills; the choice lives in the `?category=` search param. */
export function CategoryFilter({
	categories,
	active,
}: {
	categories: string[];
	active: string | undefined;
}) {
	const options = [undefined, ...categories];

	return (
		<nav aria-label="Ангилал" className="flex flex-wrap gap-2">
			{options.map((category) => {
				const selected = category === active;
				return (
					<Link
						key={category ?? "all"}
						to="/blog"
						search={{ category }}
						resetScroll={false}
						aria-current={selected ? "page" : undefined}
						className={cn(
							pill,
							selected
								? "bg-flame text-ink"
								: "bg-card text-foreground/75 hover:bg-muted hover:text-foreground",
						)}
					>
						{category ?? "Бүгд"}
					</Link>
				);
			})}
		</nav>
	);
}
