import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for pages that list cards under a short description. */
export function ListSkeleton({
	rows = 4,
	heading = true,
}: {
	rows?: number;
	heading?: boolean;
}) {
	return (
		<div className="flex flex-col gap-3" aria-busy>
			{heading && <Skeleton className="mb-3 h-5 w-2/3 rounded-full" />}
			{Array.from({ length: rows }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
					key={i}
					className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-sm"
				>
					<Skeleton className="size-11 shrink-0 rounded-full" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-1/3 rounded-full" />
						<Skeleton className="h-3.5 w-2/3 rounded-full" />
					</div>
				</div>
			))}
		</div>
	);
}
