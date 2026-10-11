import {
	Coins01Icon,
	FavouriteIcon,
	ViewIcon,
} from "@hugeicons/core-free-icons";
import { createFileRoute } from "@tanstack/react-router";
import { GettingStarted } from "./-components/getting-started";
import { StatCard } from "./-components/stat-card";
import { displayName } from "./-components/user-avatar";

export const Route = createFileRoute("/_authed/dashboard/")({
	staticData: { title: "Тойм" },
	head: () => ({ meta: [{ title: "Тойм · Bonfire" }] }),
	component: Overview,
});

function Overview() {
	const { user } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					{`Сайн байна уу, ${displayName(user)}`}
				</h2>
				<p className="mt-1 text-muted-foreground">
					{"Таны Bonfire хуудасны товч мэдээлэл."}
				</p>
			</div>
			{/* Placeholders until supporter payments ship. */}
			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard label="Дэмжигчид" icon={FavouriteIcon} />
				<StatCard label="Орлого" icon={Coins01Icon} />
				<StatCard label="Хуудас үзэлт" icon={ViewIcon} />
			</div>
			<GettingStarted user={user} />
		</div>
	);
}
