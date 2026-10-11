import {
	ArrowLeft01Icon,
	MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ShellBack, ShellNavGroup } from "./types";

/** Items marked `mobile: false` and the back link go into a "more" menu. */
export function MobileTabBar({
	groups,
	back,
}: {
	groups: ShellNavGroup[];
	back?: ShellBack;
}) {
	const items = groups.flatMap((group) => group.items);
	const tabs = items.filter((item) => item.mobile !== false);
	const more = items.filter((item) => item.mobile === false);

	return (
		<nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around bg-background/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl sm:hidden">
			{tabs.map((item) => (
				<Link
					key={item.to}
					to={item.to}
					aria-label={item.label}
					activeOptions={{ exact: item.exact }}
					className="flex size-12 items-center justify-center rounded-full"
				>
					{({ isActive }) => (
						<HugeiconsIcon
							icon={item.icon}
							className="size-7"
							strokeWidth={isActive ? 2.4 : 1.6}
						/>
					)}
				</Link>
			))}
			{(more.length > 0 || back) && (
				<DropdownMenu>
					<DropdownMenuTrigger
						aria-label="Бусад"
						className="flex size-12 items-center justify-center rounded-full"
					>
						<HugeiconsIcon
							icon={MoreHorizontalIcon}
							className="size-7"
							strokeWidth={1.6}
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						align="end"
						sideOffset={8}
						className="min-w-52"
					>
						{more.map((item) => (
							<DropdownMenuItem key={item.to} render={<Link to={item.to} />}>
								<HugeiconsIcon icon={item.icon} />
								{item.label}
							</DropdownMenuItem>
						))}
						{back && (
							<DropdownMenuItem render={<Link to={back.to} />}>
								<HugeiconsIcon icon={ArrowLeft01Icon} />
								{back.label}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</nav>
	);
}
