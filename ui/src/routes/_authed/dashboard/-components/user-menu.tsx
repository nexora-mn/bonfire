import {
	Logout03Icon,
	UnfoldMoreIcon,
	UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import type { AuthUser } from "@/lib/auth";
import { ThemeSubmenu } from "./theme-submenu";
import { useSignOut } from "./use-sign-out";
import { displayName, UserAvatar } from "./user-avatar";

/** Account button at the bottom of the sidebar. */
export function UserMenu({ user }: { user: AuthUser }) {
	const { isMobile } = useSidebar();
	const signOut = useSignOut();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="aria-expanded:bg-sidebar-accent"
							/>
						}
					>
						<UserAvatar user={user} className="size-8" />
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{displayName(user)}</span>
							<span className="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
						<HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={8}
						className="min-w-56"
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="truncate">
								{user.email}
							</DropdownMenuLabel>
							<DropdownMenuItem render={<Link to="/dashboard/profile" />}>
								<HugeiconsIcon icon={UserCircleIcon} />
								{"Профайл"}
							</DropdownMenuItem>
							<ThemeSubmenu />
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={() => signOut()}>
							<HugeiconsIcon icon={Logout03Icon} />
							{"Гарах"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
