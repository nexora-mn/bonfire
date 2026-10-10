import { Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/_authed/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	const { user } = Route.useRouteContext();
	const router = useRouter();

	return (
		<div className="p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">{"Хянах самбар"}</h1>
				<Button
					variant="outline"
					onClick={async () => {
						await signOut();
						await router.invalidate();
						await router.navigate({ to: "/" });
					}}
				>
					<HugeiconsIcon icon={Logout03Icon} />
					{"Гарах"}
				</Button>
			</div>
			<p className="mt-4 text-muted-foreground">
				{user.email}
				{" хаягаар нэвтэрсэн"}
			</p>
		</div>
	);
}
