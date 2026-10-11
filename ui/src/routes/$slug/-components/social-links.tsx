import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import {
	type SimpleIcon,
	siDiscord,
	siFacebook,
	siGithub,
	siInstagram,
	siTiktok,
	siTwitch,
	siX,
	siYoutube,
} from "simple-icons";
import { BrandIcon } from "@/components/brand-icon";
import type { PublicProfile } from "@/lib/api/creator";
import { type LinkPlatform, PLATFORM_LABELS } from "@/lib/constants";

const icons: Partial<Record<LinkPlatform, SimpleIcon>> = {
	facebook: siFacebook,
	instagram: siInstagram,
	x: siX,
	youtube: siYoutube,
	tiktok: siTiktok,
	twitch: siTwitch,
	discord: siDiscord,
	github: siGithub,
};

export function SocialLinks({
	links,
	labeled = false,
}: {
	links: PublicProfile["links"];
	labeled?: boolean;
}) {
	if (links.length === 0) return null;

	return (
		<ul className="flex flex-wrap gap-2">
			{links.map((link) => {
				const platform = link.platform as LinkPlatform;
				const icon = icons[platform];
				const label = PLATFORM_LABELS[platform] ?? link.platform;
				return (
					<li key={link.url}>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer nofollow"
							aria-label={labeled ? undefined : label}
							className={cn(
								"flex h-10 items-center justify-center gap-2 rounded-full bg-muted text-foreground transition-colors hover:bg-muted-foreground/20",
								labeled ? "px-4 text-sm font-semibold" : "w-10",
							)}
						>
							{icon ? (
								<BrandIcon icon={icon} />
							) : (
								<HugeiconsIcon icon={Globe02Icon} className="size-4" />
							)}
							{labeled && label}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
