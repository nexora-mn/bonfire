import { SquareLock02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

export function LockedCover({
	slug,
	className,
}: {
	slug: string;
	className?: string;
}) {
	const onPage =
		useParams({ strict: false, select: (params) => params.slug }) === slug;
	return (
		<div
			className={cn(
				"grain relative isolate flex aspect-21/9 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-linear-to-br from-flame/90 via-primary/70 to-ink p-6 text-center text-cream",
				className,
			)}
		>
			<span className="flex size-12 items-center justify-center rounded-2xl bg-black/25 backdrop-blur-sm">
				<HugeiconsIcon icon={SquareLock02Icon} className="size-6" />
			</span>
			<p className="font-semibold">{"Гишүүдэд зориулсан нийтлэл"}</p>
			<Link
				to="/$slug"
				params={{ slug }}
				hash="membership"
				resetScroll={!onPage}
				className={buttonVariants({ variant: "ink", size: "sm" })}
			>
				{"Гишүүн болох"}
			</Link>
		</div>
	);
}
