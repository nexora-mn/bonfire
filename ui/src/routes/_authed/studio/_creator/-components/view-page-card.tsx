import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { InitialAvatar } from "@/components/initial-avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Creator } from "@/lib/api/creator";
import { creatorUrl } from "@/lib/utils/url";

export function ViewPageCard({ creator }: { creator: Creator }) {
	return (
		<Card>
			<CardContent className="flex flex-wrap items-center gap-4">
				<InitialAvatar
					src={creator.avatarUrl}
					name={creator.displayName}
					className="size-12 text-lg"
				/>
				<div className="min-w-0 flex-1">
					<p className="font-semibold">{creator.displayName}</p>
					<p className="truncate text-sm text-muted-foreground">
						{creatorUrl(creator.slug)}
					</p>
				</div>
				<Link
					to="/$slug"
					params={{ slug: creator.slug }}
					target="_blank"
					className={buttonVariants({ variant: "neutral" })}
				>
					{"Хуудсаа үзэх"}
					<HugeiconsIcon icon={ArrowUpRight01Icon} />
				</Link>
			</CardContent>
		</Card>
	);
}
