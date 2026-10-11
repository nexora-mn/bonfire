import { Link } from "@tanstack/react-router";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";
import { InitialAvatar } from "@/components/initial-avatar";
import { buttonVariants } from "@/components/ui/button";
import type { PublicProfile } from "@/lib/api/creator";
import { ShareButton } from "./share-button";

export function CreatorHeader({
	creator,
	signedIn,
}: {
	creator: PublicProfile;
	signedIn: boolean;
}) {
	return (
		<header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-md">
			<Container className="flex h-16 max-w-6xl items-center gap-2 sm:gap-4">
				<div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
					<Link
						to="/"
						aria-label="Bonfire"
						className="hidden shrink-0 sm:block"
					>
						<FlameMark className="size-7" />
					</Link>
					<span className="hidden h-7 w-px shrink-0 bg-border sm:block" />
					<InitialAvatar
						src={creator.avatarUrl}
						name={creator.displayName}
						className="size-10 shrink-0"
						fallbackClassName="font-extrabold"
					/>
					<div className="min-w-0">
						<h1 className="truncate leading-tight font-extrabold">
							{creator.displayName}
						</h1>
						<p className="truncate text-xs text-muted-foreground">
							{`@${creator.slug}`}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<ShareButton name={creator.displayName} slug={creator.slug} />
					<Link
						to={signedIn ? "/home" : "/signup"}
						className={buttonVariants({ size: "sm" })}
					>
						{signedIn ? "Платформ" : "Бүртгүүлэх"}
					</Link>
				</div>
			</Container>
		</header>
	);
}
