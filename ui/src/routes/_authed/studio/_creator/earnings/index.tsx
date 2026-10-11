import {
	Coins01Icon,
	FavouriteIcon,
	Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { createFileRoute } from "@tanstack/react-router";
import { fetchEarnings } from "@/lib/api/payout";
import { formatMNT } from "@/lib/utils/money";
import { PageHeading } from "../../../-components/page-heading";
import { StatCard } from "../-components/stat-card";
import { StatsSkeleton } from "../-components/stats-skeleton";
import { EarningsChart } from "./-components/earnings-chart";
import { RecentSupports } from "./-components/recent-supports";
import { SeedButton } from "./-components/seed-button";

export const Route = createFileRoute("/_authed/studio/_creator/earnings/")({
	staticData: { title: "Орлого" },
	head: () => ({ meta: [{ title: "Орлого · Bonfire" }] }),
	loader: () => fetchEarnings(),
	pendingComponent: StatsSkeleton,
	component: Earnings,
});

function Earnings() {
	const earnings = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Гишүүнчлэл болон нэг удаагийн дэмжлэгээс орсон орлого.">
				{import.meta.env.DEV && <SeedButton />}
			</PageHeading>
			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard
					label="Энэ сар"
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
			<EarningsChart monthly={earnings.monthly} />
			<RecentSupports supports={earnings.recent} />
		</div>
	);
}
