import { Compass01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { fetchExplore, fetchFeed } from "@/lib/api/fan";
import { CreatorCard } from "./-components/creator-card";
import { FeedList } from "./-components/feed-list";
import { FeedSkeleton } from "./-components/feed-skeleton";

export const Route = createFileRoute("/_authed/home/")({
	staticData: { title: "Нүүр" },
	head: () => ({ meta: [{ title: "Нүүр · Bonfire" }] }),
	loader: async () => {
		const feed = await fetchFeed({ data: {} });
		const suggestions =
			feed.posts.length === 0
				? (await fetchExplore({ data: { page: 0 } })).creators.slice(0, 6)
				: [];
		return { feed, suggestions };
	},
	pendingComponent: FeedSkeleton,
	component: Feed,
});

function Feed() {
	const { feed, suggestions } = Route.useLoaderData();

	if (feed.posts.length > 0) {
		return <FeedList posts={feed.posts} nextCursor={feed.nextCursor ?? null} />;
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col items-center gap-3 py-10 text-center">
				<HugeiconsIcon icon={Compass01Icon} className="size-12 text-primary" />
				<p className="text-2xl font-extrabold">{"Тавтай морил!"}</p>
				<p className="max-w-sm text-muted-foreground">
					{"Бүтээгчид нийтлэл оруулмагц энд гарч ирнэ."}
				</p>
				<Link to="/home/discover" className={buttonVariants({ size: "lg" })}>
					{"Бүтээгч хайх"}
				</Link>
			</div>
			{suggestions.length > 0 && (
				<section>
					<h2 className="mb-3 text-xl font-extrabold">
						{"Санал болгох бүтээгчид"}
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{suggestions.map((c) => (
							<CreatorCard key={c.slug} creator={c} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
