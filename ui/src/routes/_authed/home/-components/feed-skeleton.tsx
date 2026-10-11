import { Skeleton } from "@/components/ui/skeleton";

/** Shaped like `FeedPostCard`. */
export function FeedSkeleton() {
	return (
		<div className="flex flex-col gap-3" aria-busy>
			{Array.from({ length: 3 }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
					key={i}
					className="flex gap-3 rounded-3xl bg-card p-4 shadow-sm"
				>
					<Skeleton className="size-10 shrink-0 rounded-full" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-1/2 rounded-full" />
						<Skeleton className="h-4 w-3/4 rounded-full" />
						<Skeleton className="mt-1 aspect-video w-full" />
					</div>
				</div>
			))}
		</div>
	);
}
