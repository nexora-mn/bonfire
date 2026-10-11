import { Crown02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { PublicProfile } from "@/lib/api/creator";
import { formatMNT } from "@/lib/utils/money";

export function TierCard({ tier }: { tier: PublicProfile["tiers"][number] }) {
	return (
		<article className="overflow-hidden rounded-2xl border bg-background">
			{tier.imageUrl && (
				<div className="px-3 pt-3">
					<img
						src={tier.imageUrl}
						alt=""
						loading="lazy"
						className="h-auto w-full rounded-xl"
					/>
				</div>
			)}
			<div className="p-5">
				<h3 className="flex items-center gap-2 font-bold">
					{!tier.imageUrl && (
						<span className="flex size-7 items-center justify-center rounded-lg bg-flame text-ink">
							<HugeiconsIcon icon={Crown02Icon} className="size-4" />
						</span>
					)}
					{tier.name}
				</h3>
				<p className="mt-0.5 flex items-baseline gap-1">
					<span className="text-2xl font-extrabold tracking-tight tabular-nums">
						{formatMNT(tier.monthlyPrice)}
					</span>
					<span className="text-sm text-muted-foreground">{"/ сар"}</span>
				</p>
				{tier.description && (
					<p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
						{tier.description}
					</p>
				)}
				<Button className="mt-4 w-full" disabled>
					{"Нэгдэх · Удахгүй"}
				</Button>
			</div>
		</article>
	);
}
