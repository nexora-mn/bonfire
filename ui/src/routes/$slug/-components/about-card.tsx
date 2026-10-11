import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PublicProfile } from "@/lib/api/creator";
import { formatMonthYear } from "@/lib/utils/date";
import { SocialLinks } from "./social-links";

export function AboutCard({ creator }: { creator: PublicProfile }) {
	return (
		<section className="rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
			<h2 className="display-3">{`${creator.displayName}-ийн тухай`}</h2>
			<p className="mt-4 leading-relaxed whitespace-pre-line text-foreground/80">
				{creator.about || "Бүтээгч өөрийнхөө тухай хараахан бичээгүй байна."}
			</p>
			{creator.links.length > 0 && (
				<div className="mt-6">
					<SocialLinks links={creator.links} />
				</div>
			)}
			<p className="mt-6 flex items-center gap-2 border-t pt-5 text-sm text-muted-foreground">
				<HugeiconsIcon icon={Calendar03Icon} className="size-4" />
				{`Bonfire-д ${formatMonthYear(creator.createdAt)}-с хойш`}
			</p>
		</section>
	);
}
