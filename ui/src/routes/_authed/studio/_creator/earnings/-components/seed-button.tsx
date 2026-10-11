import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRefresh } from "@/hooks/use-refresh";
import { seedSupports } from "@/lib/api/payout";

/** Dev only: fake supports so the earnings and payouts pages have data. */
export function SeedButton() {
	const refresh = useRefresh();
	const [pending, setPending] = useState(false);

	return (
		<Button
			variant="neutral"
			size="sm"
			disabled={pending}
			onClick={async () => {
				setPending(true);
				await seedSupports();
				await refresh();
				setPending(false);
			}}
		>
			{"Туршилтын дэмжлэг нэмэх (dev)"}
		</Button>
	);
}
