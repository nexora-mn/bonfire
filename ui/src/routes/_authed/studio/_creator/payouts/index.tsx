import { createFileRoute } from "@tanstack/react-router";
import { fetchPayouts } from "@/lib/api/payout";
import { ListSkeleton } from "../../../-components/list-skeleton";
import { PageHeading } from "../../../-components/page-heading";
import { AccountForm } from "./-components/account-form";
import { PayoutHistory } from "./-components/payout-history";

export const Route = createFileRoute("/_authed/studio/_creator/payouts/")({
	staticData: { title: "Төлбөр татах" },
	head: () => ({ meta: [{ title: "Төлбөр татах · Bonfire" }] }),
	loader: () => fetchPayouts(),
	pendingComponent: () => <ListSkeleton rows={2} />,
	component: Payouts,
});

function Payouts() {
	const { account, payouts } = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Сар бүрийн 1-нд өмнөх сарын орлогыг таны дансанд шилжүүлнэ." />
			<AccountForm account={account} />
			<PayoutHistory payouts={payouts} />
		</div>
	);
}
