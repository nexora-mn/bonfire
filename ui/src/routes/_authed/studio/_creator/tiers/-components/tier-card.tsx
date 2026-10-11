import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { deleteTier, type Tier } from "@/lib/api/creator";
import { formatMNT } from "@/lib/utils/money";
import { DeleteActions } from "../../-components/delete-actions";

export function TierCard({ tier, onEdit }: { tier: Tier; onEdit: () => void }) {
	return (
		<Card className={tier.isActive ? undefined : "opacity-60"}>
			<CardHeader>
				{tier.imageUrl && (
					<img
						src={tier.imageUrl}
						alt=""
						loading="lazy"
						className="mb-2 size-14 rounded-xl object-cover"
					/>
				)}
				<CardTitle>{tier.name}</CardTitle>
				<CardDescription className="text-lg font-semibold text-foreground tabular-nums">
					{`${formatMNT(tier.monthlyPrice)} / сар`}
				</CardDescription>
				{!tier.isActive && (
					<CardAction>
						<Badge variant="secondary">{"Нуусан"}</Badge>
					</CardAction>
				)}
			</CardHeader>
			{tier.description && (
				<p className="px-6 text-sm whitespace-pre-line text-muted-foreground">
					{tier.description}
				</p>
			)}
			<CardFooter className="mt-auto justify-end gap-2">
				<DeleteActions
					prompt="Түвшинг устгах уу?"
					onEdit={onEdit}
					onDelete={() => deleteTier({ data: { id: tier.id } })}
				/>
			</CardFooter>
		</Card>
	);
}
