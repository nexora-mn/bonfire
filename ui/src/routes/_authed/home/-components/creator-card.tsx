import { Link } from "@tanstack/react-router";
import { InitialAvatar } from "@/components/initial-avatar";
import { Card } from "@/components/ui/card";

type CardCreator = {
	slug: string;
	displayName: string;
	avatarUrl?: string | null;
	coverUrl?: string | null;
	about: string;
};

export function CreatorCard({ creator }: { creator: CardCreator }) {
	return (
		<Card className="gap-0 overflow-hidden py-0">
			<Link to="/$slug" params={{ slug: creator.slug }} className="block">
				<div className="h-24 bg-gradient-to-br from-flame via-primary/60 to-ink">
					{creator.coverUrl && (
						<img
							src={creator.coverUrl}
							alt=""
							className="size-full object-cover"
						/>
					)}
				</div>
			</Link>
			<div className="flex flex-1 flex-col p-4">
				<Link
					to="/$slug"
					params={{ slug: creator.slug }}
					className="-mt-10 w-fit"
				>
					<InitialAvatar
						src={creator.avatarUrl}
						name={creator.displayName}
						className="size-14 rounded-2xl border-4 border-card text-xl"
						fallbackClassName="rounded-xl"
					/>
				</Link>
				<Link
					to="/$slug"
					params={{ slug: creator.slug }}
					className="mt-2 font-semibold hover:underline"
				>
					{creator.displayName}
				</Link>
				<p className="text-xs text-muted-foreground">{`@${creator.slug}`}</p>
				{creator.about && (
					<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
						{creator.about}
					</p>
				)}
			</div>
		</Card>
	);
}
