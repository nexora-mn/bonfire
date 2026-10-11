import type { AuthUser } from "@/lib/auth";
import { LeftRail } from "./left-rail";
import { MobileTabBar } from "./mobile-tab-bar";
import { MobileTopBar } from "./mobile-top-bar";
import { PageHeader } from "./page-header";
import type { ShellAction, ShellBack, ShellNavGroup } from "./types";

/**
 * X-style layout shared by the fan board and the studio: nav rail, center
 * column, optional right rail. Phones get a top bar and a bottom tab bar.
 */
export function SocialShell({
	user,
	area,
	groups,
	back,
	action,
	rightRail,
	children,
}: {
	user: AuthUser;
	area: string;
	groups: ShellNavGroup[];
	back?: ShellBack;
	action: ShellAction;
	rightRail?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<MobileTopBar user={user} area={area} action={action} />
			<div className="mx-auto flex max-w-[80rem] justify-center">
				<LeftRail
					user={user}
					area={area}
					groups={groups}
					back={back}
					action={action}
				/>
				<main className="min-h-svh w-full max-w-[40rem] min-w-0 pb-20 sm:pb-6">
					<PageHeader />
					<div className="px-3 pt-2 sm:px-4">{children}</div>
				</main>
				{rightRail && (
					<aside className="sticky top-0 hidden h-svh w-80 shrink-0 flex-col gap-4 overflow-y-auto py-2 pl-6 lg:flex">
						{rightRail}
					</aside>
				)}
			</div>
			<MobileTabBar groups={groups} back={back} />
		</div>
	);
}
