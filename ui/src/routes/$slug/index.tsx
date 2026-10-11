import { createFileRoute } from "@tanstack/react-router";
import { cn } from "cn";
import { Container } from "@/components/container";
import { fetchPublicCreator } from "@/lib/api/creator";
import { seo } from "@/lib/seo";
import { AboutCard } from "./-components/about-card";
import { CreatorCover } from "./-components/creator-cover";
import { CreatorFooter } from "./-components/creator-footer";
import { CreatorHeader } from "./-components/creator-header";
import { CreatorNotFound } from "./-components/creator-not-found";
import { CreatorTopBar } from "./-components/creator-top-bar";
import { PostList } from "./-components/post-list";
import { SupportAside } from "./-components/support-aside";

// Static routes always win over this param route; the backend also refuses
// their slugs.
export const Route = createFileRoute("/$slug/")({
	loader: ({ params }) => fetchPublicCreator({ data: { slug: params.slug } }),
	head: ({ loaderData, params }) => {
		const path = `/${params.slug}`;
		if (!loaderData) {
			return seo({ title: "Хуудас олдсонгүй", path, noindex: true });
		}
		return seo({
			title: loaderData.displayName,
			description:
				loaderData.about.slice(0, 160) ||
				`${loaderData.displayName}-г Bonfire дээр дэмжээрэй.`,
			path,
			image: loaderData.coverUrl ? { url: loaderData.coverUrl } : undefined,
		});
	},
	component: CreatorPage,
});

function CreatorPage() {
	const creator = Route.useLoaderData();
	const { user } = Route.useRouteContext();

	if (!creator) {
		return (
			<div className="min-h-svh bg-background text-foreground">
				<CreatorTopBar signedIn={!!user} />
				<CreatorNotFound />
			</div>
		);
	}

	const hasAside = creator.oneTime.enabled || creator.tiers.length > 0;

	return (
		<div className="min-h-svh bg-background pb-16 text-foreground">
			<CreatorHeader creator={creator} signedIn={!!user} />
			<CreatorCover src={creator.coverUrl} />
			<Container
				className={cn(
					"relative -mt-12 grid items-start gap-6 sm:-mt-20",
					hasAside
						? "max-w-6xl lg:grid-cols-[minmax(0,1fr)_24rem]"
						: "max-w-3xl",
				)}
			>
				<div className="flex min-w-0 flex-col gap-6">
					<AboutCard creator={creator} />
					<PostList posts={creator.posts} signedIn={!!user} />
				</div>
				{hasAside && (
					<SupportAside creator={creator} className="max-lg:order-first" />
				)}
			</Container>
			<CreatorFooter signedIn={!!user} />
		</div>
	);
}
