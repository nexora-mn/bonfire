import { Link } from "@tanstack/react-router";
import { InitialAvatar } from "@/components/initial-avatar";
import type { ExploreCreator } from "@/lib/api/fan";

export function SuggestedCreators({
	creators,
}: {
	creators: ExploreCreator[];
}) {
	if (creators.length === 0) return null;

	return (
		<section className="flex flex-col gap-2">
			<h2 className="px-1 text-xl font-extrabold">{"Санал болгох"}</h2>
			{creators.map((c) => (
				<Link
					key={c.slug}
					to="/$slug"
					params={{ slug: c.slug }}
					className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
				>
					<InitialAvatar
						src={c.avatarUrl}
						name={c.displayName}
						className="size-10"
					/>
					<span className="min-w-0 text-sm">
						<span className="block truncate font-bold hover:underline">
							{c.displayName}
						</span>
						<span className="block truncate text-muted-foreground">{`@${c.slug}`}</span>
					</span>
				</Link>
			))}
			<Link
				to="/home/discover"
				className="px-1 text-sm font-medium text-primary hover:underline"
			>
				{"Илүү ихийг үзэх"}
			</Link>
		</section>
	);
}
