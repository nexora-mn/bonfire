import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchTiers, type Tier } from "@/lib/api/creator";
import { MAX_TIERS } from "@/lib/constants";
import { ListSkeleton } from "../../../-components/list-skeleton";
import { PageHeading } from "../../../-components/page-heading";
import { TierCard } from "./-components/tier-card";
import { TierDialog } from "./-components/tier-dialog";

export const Route = createFileRoute("/_authed/studio/_creator/tiers/")({
	staticData: { title: "Гишүүнчлэл" },
	head: () => ({ meta: [{ title: "Гишүүнчлэл · Bonfire" }] }),
	loader: () => fetchTiers(),
	pendingComponent: ListSkeleton,
	component: Tiers,
});

function Tiers() {
	const tiers = Route.useLoaderData();
	// undefined: closed; null: creating; a tier: editing it.
	const [editing, setEditing] = useState<Tier | null | undefined>();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Дэмжигчид сар бүр төлөх түвшнүүд. Төлбөр хүлээн авах удахгүй нээгдэнэ.">
				{tiers.length < MAX_TIERS && (
					<Button onClick={() => setEditing(null)}>
						<HugeiconsIcon icon={Add01Icon} />
						{"Түвшин нэмэх"}
					</Button>
				)}
			</PageHeading>
			{tiers.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						{
							"Одоогоор түвшин алга. Жишээ нь «Дэмжигч — 5,000₮/сар» гэж эхэлж болно."
						}
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{tiers.map((tier) => (
						<TierCard
							key={tier.id}
							tier={tier}
							onEdit={() => setEditing(tier)}
						/>
					))}
				</div>
			)}
			{editing !== undefined && (
				<TierDialog
					tier={editing}
					nextPosition={tiers.length}
					onClose={() => setEditing(undefined)}
				/>
			)}
		</div>
	);
}
