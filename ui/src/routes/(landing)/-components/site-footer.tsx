import { FlameMark } from "./flame-mark";

export function SiteFooter() {
	return (
		<footer className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
			<p className="flex items-center gap-2 font-heading font-bold text-foreground">
				<FlameMark className="size-5 text-foreground" />
				{"Bonfire"}
			</p>
			<nav aria-label="Доод цэс" className="flex flex-wrap gap-6">
				<a href="#passions" className="hover:text-foreground">
					{"Сонирхол"}
				</a>
				<a href="#how-it-works" className="hover:text-foreground">
					{"Хэрхэн ажилладаг"}
				</a>
				<a href="#earnings" className="hover:text-foreground">
					{"Орлого"}
				</a>
			</nav>
			<p>&copy; {new Date().getFullYear()} Bonfire</p>
		</footer>
	);
}
