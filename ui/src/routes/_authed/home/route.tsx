import {
	FavouriteIcon,
	Home01Icon,
	Search01Icon,
	SparklesIcon,
	UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { myCreatorQuery } from "@/lib/api/creator";
import { fetchExplore } from "@/lib/api/fan";
import { SESSION_STALE_TIME } from "@/lib/constants";
import { SocialShell } from "../-components/shell";
import { ShellSkeleton } from "../-components/shell/shell-skeleton";
import type { ShellNavGroup } from "../-components/shell/types";
import { RightRail } from "./-components/right-rail";

const groups: ShellNavGroup[] = [
	{
		label: "Нээх",
		items: [
			{ to: "/home", label: "Нүүр", icon: Home01Icon, exact: true },
			{ to: "/home/discover", label: "Хайх", icon: Search01Icon },
		],
	},
	{
		label: "Миний",
		items: [
			{ to: "/home/supports", label: "Миний дэмжлэг", icon: FavouriteIcon },
			{ to: "/home/profile", label: "Профайл", icon: UserCircleIcon },
		],
	},
];

export const Route = createFileRoute("/_authed/home")({
	beforeLoad: async ({ context }) => ({
		creator: await context.queryClient.fetchQuery(myCreatorQuery),
	}),
	loader: async ({ context }) => {
		const { creators } = await fetchExplore({ data: { page: 0 } });
		const suggestions = creators
			.filter((c) => c.slug !== context.creator?.slug)
			.slice(0, 4);
		return { suggestions };
	},
	// Suggestions don't need refreshing on every page change in the layout.
	staleTime: SESSION_STALE_TIME,
	head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
	// Browser-only; the server sends the skeleton.
	ssr: false,
	pendingComponent: ShellSkeleton,
	component: HomeLayout,
});

function HomeLayout() {
	const { user, creator } = Route.useRouteContext();
	const { suggestions } = Route.useLoaderData();

	return (
		<SocialShell
			user={user}
			area="Платформ"
			groups={groups}
			action={
				creator
					? { to: "/studio", label: "Студи", icon: SparklesIcon }
					: { to: "/studio/become", label: "Бүтээгч болох", icon: SparklesIcon }
			}
			rightRail={<RightRail suggestions={suggestions} />}
		>
			<Outlet />
		</SocialShell>
	);
}
