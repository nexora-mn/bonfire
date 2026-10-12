import type { ExploreCreator } from "@/lib/api/fan";
import { RailFooter } from "../../../-components/shell/rail-footer";
import { RailSearch } from "./search";
import { SuggestedCreators } from "./suggested-creators";

export function RightRail({ suggestions }: { suggestions: ExploreCreator[] }) {
	return (
		<>
			<RailSearch />
			<SuggestedCreators creators={suggestions} />
			<RailFooter />
		</>
	);
}
