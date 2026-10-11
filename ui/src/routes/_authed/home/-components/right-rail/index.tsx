import type { ExploreCreator } from "@/lib/api/fan";
import { RailSearch } from "./search";
import { SuggestedCreators } from "./suggested-creators";

export function RightRail({ suggestions }: { suggestions: ExploreCreator[] }) {
	return (
		<>
			<RailSearch />
			<SuggestedCreators creators={suggestions} />
			<p className="px-4 text-xs text-muted-foreground">{"© Bonfire"}</p>
		</>
	);
}
