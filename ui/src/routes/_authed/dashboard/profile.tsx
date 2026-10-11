import { createFileRoute } from "@tanstack/react-router";
import { PasswordForm } from "./-components/profile/password-form";
import { ProfileForm } from "./-components/profile/profile-form";
import { SessionsCard } from "./-components/profile/sessions-card";
import { SignInMethods } from "./-components/profile/sign-in-methods";

export const Route = createFileRoute("/_authed/dashboard/profile")({
	staticData: { title: "Профайл" },
	head: () => ({ meta: [{ title: "Профайл · Bonfire" }] }),
	component: Profile,
});

function Profile() {
	const { user } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">{"Профайл"}</h2>
				<p className="mt-1 text-muted-foreground">
					{"Бүртгэл, нэвтрэх тохиргоогоо удирдах."}
				</p>
			</div>
			<ProfileForm user={user} />
			<SignInMethods user={user} />
			<PasswordForm user={user} />
			<SessionsCard />
		</div>
	);
}
