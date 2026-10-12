import {
	BankIcon,
	Coffee02Icon,
	Coins01Icon,
	DashboardSquare01Icon,
	Layers01Icon,
	News01Icon,
	PencilEdit02Icon,
	QrCodeIcon,
	UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SocialShell } from "../../-components/shell";
import { ShellSkeleton } from "../../-components/shell/shell-skeleton";
import type { ShellNavGroup } from "../../-components/shell/types";
import { StudioRail } from "../-components/studio-rail";

const groups: ShellNavGroup[] = [
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

const back = { to: "/home", label: "Платформ руу буцах" } as const;

const action = {
	to: "/studio/posts",
	search: { new: true },
	label: "Нийтлэл бичих",
	icon: PencilEdit02Icon,
} as const;

export const Route = createFileRoute("/_authed/studio/_creator")({
	beforeLoad: ({ context }) => {
		if (!context.creator) throw redirect({ to: "/studio/create" });
		return { creator: context.creator };
	},
	pendingComponent: ShellSkeleton,
	component: CreatorLayout,
});

function CreatorLayout() {
	const { user, creator } = Route.useRouteContext();

	return (
		<SocialShell
			user={user}
			area="Студи"
			groups={groups}
			back={back}
			action={action}
			rightRail={<StudioRail creator={creator} />}
		>
			<Outlet />
		</SocialShell>
	);
}
