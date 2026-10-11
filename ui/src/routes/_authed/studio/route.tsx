import {
	BankIcon,
	Coffee02Icon,
	Coins01Icon,
	DashboardSquare01Icon,
	Layers01Icon,
	News01Icon,
	PencilEdit02Icon,
	QrCodeIcon,
	SparklesIcon,
	UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { myCreatorQuery } from "@/lib/api/creator";
import { SocialShell } from "../-components/shell";
import { ShellSkeleton } from "../-components/shell/shell-skeleton";
import type { ShellNavGroup } from "../-components/shell/types";
import { StudioRail } from "./-components/studio-rail";

const creatorGroups: ShellNavGroup[] = [
	{
		label: "Ерөнхий",
		items: [
			{
				to: "/studio",
				label: "Тойм",
				icon: DashboardSquare01Icon,
				exact: true,
			},
			{ to: "/studio/posts", label: "Нийтлэл", icon: News01Icon },
			{ to: "/studio/page", label: "Миний хуудас", icon: UserCircleIcon },
			{ to: "/studio/qr", label: "QR код", icon: QrCodeIcon, mobile: false },
		],
	},
	{
		label: "Орлого",
		items: [
			{ to: "/studio/earnings", label: "Орлого", icon: Coins01Icon },
			{
				to: "/studio/tiers",
				label: "Гишүүнчлэл",
				icon: Layers01Icon,
				mobile: false,
			},
			{
				to: "/studio/donations",
				label: "Нэг удаагийн",
				icon: Coffee02Icon,
				mobile: false,
			},
			{
				to: "/studio/payouts",
				label: "Төлбөр татах",
				icon: BankIcon,
				mobile: false,
			},
		],
	},
];

const newcomerGroups: ShellNavGroup[] = [
	{
		label: "Эхлэх",
		items: [
			{ to: "/studio/become", label: "Бүтээгч болох", icon: SparklesIcon },
		],
	},
];

const back = { to: "/home", label: "Платформ руу буцах" } as const;

export const Route = createFileRoute("/_authed/studio")({
	// Null until the user becomes a creator; pages under _creator require it.
	beforeLoad: async ({ context }) => ({
		creator: await context.queryClient.fetchQuery(myCreatorQuery),
	}),
	head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
	// Browser-only; the server sends the skeleton.
	ssr: false,
	pendingComponent: ShellSkeleton,
	component: StudioLayout,
});

function StudioLayout() {
	const { user, creator } = Route.useRouteContext();

	return (
		<SocialShell
			user={user}
			area="Студи"
			groups={creator ? creatorGroups : newcomerGroups}
			back={back}
			action={
				creator
					? {
							to: "/studio/posts",
							search: { new: true },
							label: "Нийтлэл бичих",
							icon: PencilEdit02Icon,
						}
					: {
							to: "/studio/become",
							label: "Бүтээгч болох",
							icon: SparklesIcon,
						}
			}
			rightRail={creator && <StudioRail creator={creator} />}
		>
			<Outlet />
		</SocialShell>
	);
}
