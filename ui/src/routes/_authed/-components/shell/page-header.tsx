import { useMatches } from "@tanstack/react-router";

/** Shows the deepest matched route's `staticData.title`. */
export function PageHeader() {
	const title = useMatches({
		select: (matches) =>
			matches
				.map((match) => match.staticData.title)
				.filter(Boolean)
				.at(-1),
	});

	return (
		<div className="sticky top-0 z-20 hidden h-14 items-center bg-background/80 px-4 backdrop-blur-xl sm:flex">
			<h1 className="text-xl font-bold">{title}</h1>
		</div>
	);
}
