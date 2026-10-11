import { useMatches } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Top bar with the sidebar toggle and the current page's `staticData.title`. */
export function DashboardHeader() {
	const title = useMatches({
		select: (matches) =>
			matches
				.map((match) => match.staticData.title)
				.filter(Boolean)
				.at(-1),
	});

	return (
		<header className="sticky top-2 z-10 mx-2 mt-2 flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-card/80 px-4 shadow-lg shadow-black/5 backdrop-blur-xl sm:mx-4">
			<SidebarTrigger className="-ml-1" />
			<Separator
				orientation="vertical"
				className="mr-1 h-4 self-center my-auto"
			/>
			<h1 className="text-sm font-medium">{title}</h1>
		</header>
	);
}
