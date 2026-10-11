import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

/** Headline metric; without a `value` it shows a "coming soon" placeholder. */
export function StatCard({
	label,
	icon,
	value,
}: {
	label: string;
	icon: IconSvgElement;
	value?: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardDescription className="flex items-center gap-2">
					<HugeiconsIcon icon={icon} className="size-4 text-primary" />
					{label}
				</CardDescription>
				<CardTitle className="text-3xl font-bold tabular-nums">
					{value ?? "—"}
				</CardTitle>
				{!value && (
					<CardAction>
						<Badge variant="secondary">{"Удахгүй"}</Badge>
					</CardAction>
				)}
			</CardHeader>
		</Card>
	);
}
