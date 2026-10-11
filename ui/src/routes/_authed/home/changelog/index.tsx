import { createFileRoute } from "@tanstack/react-router";
import { ListSkeleton } from "../../-components/list-skeleton";
import { PageHeading } from "../../-components/page-heading";
import { ChangelogCard } from "./-components/changelog-card";
import { fetchChangelogs } from "./-components/changelogs";

export const Route = createFileRoute("/_authed/home/changelog/")({
	loader: () => fetchChangelogs(),
	staticData: { title: "Шинэчлэлүүд" },
	head: () => ({ meta: [{ title: "Шинэчлэлүүд · Bonfire" }] }),
	pendingComponent: ListSkeleton,
	component: Changelog,
});

function Changelog() {
	const entries = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-3">
			<PageHeading description="Bonfire-д нэмэгдсэн шинэ боломж, сайжруулалт, засварууд." />
			{entries.length === 0 ? (
				<p className="py-12 text-center text-muted-foreground">
					{"Одоогоор шинэчлэл алга."}
				</p>
			) : (
				<ol className="flex flex-col gap-3">
					{entries.map((entry) => (
						<li key={entry.id}>
							<ChangelogCard entry={entry} />
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
