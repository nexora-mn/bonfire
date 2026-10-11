import { DashboardSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { FlameMark } from "@/components/flame-mark";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import type { AuthUser } from "@/lib/auth";
import { UserMenu } from "./user-menu";

// Add new dashboard sections here as features land.
const navItems = [
	{ to: "/dashboard", label: "Тойм", icon: DashboardSquare01Icon },
] as const;

export function AppSidebar({ user }: { user: AuthUser }) {
	const matchRoute = useMatchRoute();

	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							tooltip="Bonfire"
							render={<Link to="/" />}
						>
							<FlameMark className="size-8! shrink-0 text-foreground" />
							<span className="text-lg font-extrabold">{"Bonfire"}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{"Цэс"}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.to}>
									<SidebarMenuButton
										tooltip={item.label}
										isActive={!!matchRoute({ to: item.to })}
										render={<Link to={item.to} />}
									>
										<HugeiconsIcon icon={item.icon} />
										<span>{item.label}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserMenu user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
