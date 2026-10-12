import { createFileRoute } from "@tanstack/react-router";
import { fetchPayoutAccount } from "@/lib/api/payout";
import { ListSkeleton } from "../../../-components/list-skeleton";
import { PageHeading } from "../../../-components/page-heading";
import { AccountForm } from "./-components/account-form";

export const Route = createFileRoute("/_authed/studio/_creator/payouts/")({
	staticData: { title: "Төлбөр татах" },
	head: () => ({ meta: [{ title: "Төлбөр татах · Bonfire" }] }),
	loader: () => fetchPayoutAccount(),
	pendingComponent: () => <ListSkeleton rows={1} />,
	component: Payouts,
});

function Payouts() {
	const { account } = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Орлого тань энэ дансанд шилжинэ." />
			<AccountForm account={account} />
		</div>
	);
}
