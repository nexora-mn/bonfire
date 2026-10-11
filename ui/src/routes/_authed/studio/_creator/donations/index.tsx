import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "../../../-components/page-heading";
import { OneTimeForm } from "./-components/one-time-form";

export const Route = createFileRoute("/_authed/studio/_creator/donations/")({
	staticData: { title: "Нэг удаагийн дэмжлэг" },
	head: () => ({ meta: [{ title: "Нэг удаагийн дэмжлэг · Bonfire" }] }),
	component: Donations,
});

function Donations() {
	const { creator } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Гишүүн болохгүйгээр нэг удаа дэмжих боломж, «кофе авч өгөх» шиг." />
			<OneTimeForm settings={creator.oneTime} />
		</div>
	);
}
