import {
	Coins01Icon,
	FavouriteIcon,
	Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { createFileRoute } from "@tanstack/react-router";
import { fetchEarnings } from "@/lib/api/payout";
import { formatMNT } from "@/lib/utils/money";
import { displayName } from "@/lib/utils/user";
import { GettingStarted } from "./-components/getting-started";
import { StatCard } from "./-components/stat-card";
import { StatsSkeleton } from "./-components/stats-skeleton";
import { ViewPageCard } from "./-components/view-page-card";

export const Route = createFileRoute("/_authed/studio/_creator/")({
	staticData: { title: "Тойм" },
	head: () => ({ meta: [{ title: "Студи · Bonfire" }] }),
	loader: () => fetchEarnings(),
	pendingComponent: StatsSkeleton,
	component: StudioOverview,
});

function StudioOverview() {
	const { user, creator } = Route.useRouteContext();
	const earnings = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					{`Сайн байна уу, ${displayName(user)}`}
				</h2>
				<p className="mt-1 text-muted-foreground">
					{"Бүтээгчийн хуудасны тань товч мэдээлэл."}
				</p>
			</div>
			{/* The right rail shows this on wide screens. */}
			<div className="lg:hidden">
				<ViewPageCard creator={creator} />
			</div>
			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard
					label="Энэ сарын орлого"
					icon={Wallet01Icon}
					value={formatMNT(earnings.thisMonth)}
				/>
				<StatCard
					label="Нийт орлого"
					icon={Coins01Icon}
					value={formatMNT(earnings.allTime)}
				/>
				<StatCard
					label="Дэмжлэгийн тоо"
					icon={FavouriteIcon}
					value={String(earnings.supportCount)}
				/>
			</div>
			<GettingStarted creator={creator} />
		</div>
	);
}
