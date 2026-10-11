import { cn } from "cn";
import type { PublicProfile } from "@/lib/api/creator";
import { MembershipCard } from "./membership-card";
import { SupportCard } from "./support-card";

export function SupportAside({
	creator,
	className,
}: {
	creator: PublicProfile;
	className?: string;
}) {
	return (
		<aside className={cn("flex flex-col gap-6", className)}>
			{creator.oneTime.enabled && (
				<SupportCard name={creator.displayName} settings={creator.oneTime} />
			)}
			{creator.tiers.length > 0 && <MembershipCard tiers={creator.tiers} />}
		</aside>
	);
}
