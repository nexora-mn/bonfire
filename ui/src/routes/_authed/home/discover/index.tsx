import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { fetchExplore } from "@/lib/api/fan";
import { ListSkeleton } from "../../-components/list-skeleton";
import { Results } from "./-components/results";
import { SearchForm } from "./-components/search-form";

export const Route = createFileRoute("/_authed/home/discover/")({
	validateSearch: z.object({ q: z.string().optional() }),
	loaderDeps: ({ search }) => ({ q: search.q }),
	loader: ({ deps }) => fetchExplore({ data: { q: deps.q, page: 0 } }),
	staticData: { title: "Бүтээгч хайх" },
	head: () => ({ meta: [{ title: "Бүтээгч хайх · Bonfire" }] }),
	pendingComponent: () => <ListSkeleton heading={false} />,
	component: Discover,
});

function Discover() {
	const { q } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	return (
		<div className="flex flex-col gap-4">
			<SearchForm
				defaultValue={q ?? ""}
				onSearch={(next) => navigate({ search: { q: next || undefined } })}
			/>
			{/* Remount on a new search so the extra pages reset. */}
			<Results key={q ?? ""} />
		</div>
	);
}
