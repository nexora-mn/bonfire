import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { FlameMark } from "@/components/flame-mark";
import { buttonVariants } from "@/components/ui/button";
import type { AuthUser } from "@/lib/auth";
import { AccountMenu } from "../account-menu";
import type { ShellAction, ShellBack, ShellNavGroup } from "../types";
import { NavLink } from "./nav-link";

// Icons only below `xl`; group labels collapse into dividers there.
export function LeftRail({
	user,
	area,
	groups,
	back,
	action,
}: {
	user: AuthUser;
	area: string;
	groups: ShellNavGroup[];
	back?: ShellBack;
	action: ShellAction;
}) {
	return (
		<header className="sticky top-0 hidden h-svh shrink-0 flex-col justify-between overflow-y-auto py-3 sm:flex sm:w-20 sm:items-center xl:w-64 xl:items-stretch xl:px-3">
			<div className="flex flex-col items-center xl:items-stretch">
				{back && (
					<Link
						to={back.to}
						aria-label={back.label}
						className="mb-2 flex size-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground xl:h-10 xl:w-full xl:justify-start xl:px-3"
					>
						<HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
						<span className="hidden xl:inline">{back.label}</span>
					</Link>
				)}
				<Link
					to={groups[0].items[0].to}
					aria-label={`Bonfire ${area}`}
					className="mb-4 flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-foreground/[0.06] xl:px-3"
				>
					<FlameMark className="size-8" />
					<span className="hidden text-lg font-extrabold tracking-tight xl:inline">
						{area}
					</span>
				</Link>
				<nav className="flex flex-col gap-3 xl:gap-5">
					{groups.map((group, i) => (
						<div
							key={group.label}
							className="flex flex-col items-center xl:items-stretch"
						>
							<p className="hidden px-3 pb-1.5 text-xs font-bold tracking-wider text-muted-foreground/80 uppercase xl:block">
								{group.label}
							</p>
							{i > 0 && (
								<span
									aria-hidden
									className="mb-3 h-px w-8 bg-border xl:hidden"
								/>
							)}
							<ul className="flex flex-col gap-0.5">
								{group.items.map((item) => (
									<li key={item.to}>
										<NavLink item={item} />
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
				<Link
					to={action.to}
					// biome-ignore lint/suspicious/noExplicitAny: search shape depends on the target route
					search={action.search as any}
					aria-label={action.label}
					className={cn(
						buttonVariants(),
						"mt-6 size-12 p-0 xl:h-12 xl:w-full xl:px-6",
					)}
				>
					<HugeiconsIcon icon={action.icon} className="size-5 xl:hidden" />
					<span className="hidden xl:inline">{action.label}</span>
				</Link>
			</div>
			<AccountMenu user={user} />
		</header>
	);
}
