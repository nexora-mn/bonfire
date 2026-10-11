import {
	Logout03Icon,
	Megaphone01Icon,
	MoreHorizontalIcon,
	UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { InitialAvatar } from "@/components/initial-avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthUser } from "@/lib/auth";
import { displayName } from "@/lib/utils/user";
import { useSignOut } from "../use-sign-out";
import { ThemeSubmenu } from "./theme-submenu";

export function AccountMenu({ user }: { user: AuthUser }) {
	const signOut = useSignOut();
	const name = displayName(user);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-foreground/[0.06] xl:w-full">
				<InitialAvatar src={user.avatarUrl} name={name} className="size-10" />
				<span className="hidden min-w-0 flex-1 xl:block">
					<span className="block truncate text-sm font-bold">{name}</span>
					<span className="block truncate text-sm text-muted-foreground">
						{user.email}
					</span>
				</span>
				<HugeiconsIcon
					icon={MoreHorizontalIcon}
					className="hidden size-5 xl:block"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="top"
				align="start"
				sideOffset={8}
				className="min-w-60"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="truncate">
						{user.email}
					</DropdownMenuLabel>
					<DropdownMenuItem render={<Link to="/home/profile" />}>
						<HugeiconsIcon icon={UserCircleIcon} />
						{"Профайл"}
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link to="/home/changelog" />}>
						<HugeiconsIcon icon={Megaphone01Icon} />
						{"Шинэчлэлүүд"}
					</DropdownMenuItem>
					<ThemeSubmenu />
					<DropdownMenuItem variant="destructive" onClick={() => signOut()}>
						<HugeiconsIcon icon={Logout03Icon} />
						{"Гарах"}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
