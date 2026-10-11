import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./-components/app-sidebar";
import { DashboardHeader } from "./-components/dashboard-header";

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		/** Page name shown in the dashboard header. */
		title?: string;
	}
}

export const Route = createFileRoute("/_authed/dashboard")({
	head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
	component: DashboardLayout,
});

/** Shell for every dashboard page: sidebar navigation plus a top bar. */
function DashboardLayout() {
	const { user } = Route.useRouteContext();

	return (
		<TooltipProvider>
			{/* Backdrop one step below the panels, so they always sit on top of it. */}
			<SidebarProvider className="bg-muted dark:bg-background">
				<AppSidebar user={user} />
				<SidebarInset className="bg-transparent">
					<DashboardHeader />
					<div className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8 **:data-[slot=card]:shadow-lg **:data-[slot=card]:shadow-black/5">
						<Outlet />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
