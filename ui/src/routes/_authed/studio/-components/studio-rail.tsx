import { ArrowUpRight01Icon, QrCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import type { Creator } from "@/lib/api/creator";
import { creatorUrl } from "@/lib/utils/url";
import { RailFooter } from "../../-components/shell/rail-footer";

export function StudioRail({ creator }: { creator: Creator }) {
	return (
		<>
			<section className="overflow-hidden rounded-3xl bg-card shadow-sm">
				<div className="h-20 bg-gradient-to-br from-flame via-primary/60 to-ink">
					{creator.coverUrl && (
						<img
							src={creator.coverUrl}
							alt=""
							className="size-full object-cover"
						/>
					)}
				</div>
				<div className="p-4">
					<div className="-mt-12 size-16 overflow-hidden rounded-2xl border-4 border-card bg-flame">
						{creator.avatarUrl ? (
							<img
								src={creator.avatarUrl}
								alt=""
								className="size-full object-cover"
							/>
						) : (
							<span className="flex size-full items-center justify-center text-xl font-bold text-ink uppercase">
								{creator.displayName.charAt(0)}
							</span>
						)}
					</div>
					<p className="mt-2 font-bold">{creator.displayName}</p>
					<p className="truncate text-sm text-muted-foreground">
						{creatorUrl(creator.slug)}
					</p>
					<div className="mt-4 flex gap-2">
						<Link
							to="/$slug"
							params={{ slug: creator.slug }}
							target="_blank"
							className={cn(buttonVariants({ size: "sm" }), "flex-1")}
						>
							{"Хуудсаа үзэх"}
							<HugeiconsIcon icon={ArrowUpRight01Icon} />
						</Link>
						<Link
							to="/studio/qr"
							aria-label="QR код"
							className={buttonVariants({
								variant: "neutral",
								size: "sm",
							})}
						>
							<HugeiconsIcon icon={QrCodeIcon} />
						</Link>
					</div>
				</div>
			</section>
			<section className="rounded-3xl bg-card p-4 text-sm shadow-sm">
				<p className="font-bold">{"Санамж"}</p>
				<p className="mt-1 text-muted-foreground">
					{
						"Тогтмол нийтлэл оруулдаг бүтээгчид илүү олон дагагчтай болдог. Долоо хоногт нэг ч болов шинэчлэл хуваалцаарай."
					}
				</p>
			</section>
			<RailFooter />
		</>
	);
}
