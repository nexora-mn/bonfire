import type { PublicProfile } from "@/lib/api/creator";
import { TierCard } from "./tier-card";

export function MembershipCard({ tiers }: { tiers: PublicProfile["tiers"] }) {
	return (
		<section
			id="membership"
			className="scroll-mt-24 rounded-3xl border bg-card p-6 text-card-foreground shadow-sm"
		>
			<h2 className="text-2xl font-extrabold tracking-tight">
				{"Гишүүн болох"}
			</h2>
			<p className="mt-1 text-sm text-muted-foreground">
				{"Сар бүр дэмжиж, гишүүдэд зориулсан нийтлэлүүдийг үзээрэй."}
			</p>
			<div className="mt-5 flex flex-col gap-4">
				{tiers.map((tier) => (
					<TierCard key={tier.id} tier={tier} />
				))}
			</div>
		</section>
	);
}
