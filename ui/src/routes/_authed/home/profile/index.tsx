import { createFileRoute } from "@tanstack/react-router";
import { PasswordForm } from "./-components/password-form";
import { ProfileForm } from "./-components/profile-form";
import { SessionsCard } from "./-components/sessions-card";
import { SignInMethods } from "./-components/sign-in-methods";

export const Route = createFileRoute("/_authed/home/profile/")({
	staticData: { title: "Профайл" },
	head: () => ({ meta: [{ title: "Профайл · Bonfire" }] }),
	component: Profile,
});

function Profile() {
	const { user } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-6">
			<ProfileForm user={user} />
			<SignInMethods user={user} />
			<PasswordForm user={user} />
			<SessionsCard />
		</div>
	);
}
