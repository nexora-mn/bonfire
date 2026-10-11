import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type ExploreCreator, fetchExplore } from "@/lib/api/fan";
import { CreatorCard } from "../../-components/creator-card";

const route = getRouteApi("/_authed/home/discover/");

export function Results() {
	const first = route.useLoaderData();
	const { q } = route.useSearch();
	const [creators, setCreators] = useState<ExploreCreator[]>(first.creators);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(first.hasMore);
	const [pending, setPending] = useState(false);

	if (creators.length === 0) {
		return (
			<p className="py-12 text-center text-muted-foreground">
				{q ? `«${q}» гэсэн бүтээгч олдсонгүй.` : "Одоогоор бүтээгч алга."}
			</p>
		);
	}

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2">
				{creators.map((c) => (
					<CreatorCard key={c.slug} creator={c} />
				))}
			</div>
			{hasMore && (
				<Button
					variant="neutral"
					className="self-center"
					disabled={pending}
					onClick={async () => {
						setPending(true);
						try {
							const next = await fetchExplore({ data: { q, page: page + 1 } });
							setCreators((prev) => [...prev, ...next.creators]);
							setPage(page + 1);
							setHasMore(next.hasMore);
						} finally {
							setPending(false);
						}
					}}
				>
					{pending ? "Ачаалж байна…" : "Цааш үзэх"}
				</Button>
			)}
		</>
	);
}
