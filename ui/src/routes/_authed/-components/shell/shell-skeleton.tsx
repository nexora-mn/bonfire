import { Skeleton } from "@/components/ui/skeleton";
import { ListSkeleton } from "../list-skeleton";

/** Mirrors `SocialShell` while a client-only layout loads. */
export function ShellSkeleton({ children }: { children?: React.ReactNode }) {
	return (
		<div className="min-h-svh bg-background text-foreground" aria-busy>
			<div className="sticky top-0 z-30 flex h-14 items-center justify-between px-3 sm:hidden">
				<Skeleton className="h-7 w-28 rounded-full" />
				<Skeleton className="size-10 rounded-full" />
			</div>
			<div className="mx-auto flex max-w-[80rem] justify-center">
				<div className="sticky top-0 hidden h-svh shrink-0 flex-col justify-between py-3 sm:flex sm:w-20 sm:items-center xl:w-64 xl:items-stretch xl:px-3">
					<div className="flex flex-col items-center gap-0.5 xl:items-stretch">
						<Skeleton className="m-2 mb-6 size-8 rounded-xl xl:mx-3" />
						<Skeleton className="mx-3 mb-2 hidden h-3 w-16 rounded-full xl:block" />
						{Array.from({ length: 5 }, (_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
								key={i}
								className="flex h-12 items-center gap-3 px-3 xl:h-11"
							>
								<Skeleton className="size-6 rounded-lg" />
								<Skeleton className="hidden h-4 w-28 rounded-full xl:block" />
							</div>
						))}
						<Skeleton className="mt-6 size-12 rounded-xl xl:w-full" />
					</div>
					<div className="flex items-center gap-3 p-2">
						<Skeleton className="size-10 rounded-full" />
						<Skeleton className="hidden h-4 flex-1 rounded-full xl:block" />
					</div>
				</div>
				<main className="min-h-svh w-full max-w-[40rem] min-w-0 pb-20 sm:pb-6">
					<div className="hidden h-14 items-center px-4 sm:flex">
						<Skeleton className="h-6 w-32 rounded-full" />
					</div>
					<div className="px-3 pt-2 sm:px-4">
						{children ?? <ListSkeleton />}
					</div>
				</main>
				<aside className="hidden w-80 shrink-0 flex-col gap-4 py-2 pl-6 lg:flex">
					<Skeleton className="h-11 rounded-full" />
					<Skeleton className="h-64 rounded-3xl" />
				</aside>
			</div>
		</div>
	);
}
