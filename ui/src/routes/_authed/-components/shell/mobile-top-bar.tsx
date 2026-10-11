import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { FlameMark } from "@/components/flame-mark";
import type { AuthUser } from "@/lib/auth";
import { AccountMenu } from "./account-menu";
import type { ShellAction } from "./types";

export function MobileTopBar({
	user,
	area,
	action,
}: {
	user: AuthUser;
	area: string;
	action: ShellAction;
}) {
	return (
		<header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-background/85 px-3 backdrop-blur-xl sm:hidden">
			<span className="flex items-center gap-2">
				<FlameMark className="size-7" />
				<span className="text-lg font-extrabold">{area}</span>
			</span>
			<div className="flex items-center gap-1">
				<Link
					to={action.to}
					// biome-ignore lint/suspicious/noExplicitAny: search shape depends on the target route
					search={action.search as any}
					aria-label={action.label}
					className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-foreground/10"
				>
					<HugeiconsIcon icon={action.icon} className="size-6" />
				</Link>
				<AccountMenu user={user} />
			</div>
		</header>
	);
}
