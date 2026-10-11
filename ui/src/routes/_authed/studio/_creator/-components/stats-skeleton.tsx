import { Skeleton } from "@/components/ui/skeleton";

/** Description, three `StatCard`s and a large card below. */
export function StatsSkeleton() {
	return (
		<div className="flex flex-col gap-6" aria-busy>
			<Skeleton className="h-5 w-2/3 rounded-full" />
			<div className="grid gap-4 sm:grid-cols-3">
				{Array.from({ length: 3 }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
					<Skeleton key={i} className="h-28 rounded-3xl" />
				))}
			</div>
			<Skeleton className="h-72 rounded-3xl" />
		</div>
	);
}
