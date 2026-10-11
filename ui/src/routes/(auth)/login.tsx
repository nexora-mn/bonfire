import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { z } from "zod";
import { useRefresh } from "@/hooks/use-refresh";
import { signIn } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/utils/url";
import { AuthForm } from "./-components/auth-form";

export const Route = createFileRoute("/(auth)/login")({
	validateSearch: z.object({
		redirect: z.string().optional(),
		error: z.string().optional(),
	}),
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/home" });
	},
	component: Login,
});

const errorMessages: Record<string, string> = {
	confirmation_failed:
		"Баталгаажуулах холбоос буруу эсвэл хугацаа нь дууссан байна.",
	oauth_failed:
		"Google эсвэл Discord-оор нэвтэрч чадсангүй. Дахин оролдоно уу.",
};

function Login() {
	const router = useRouter();
	const refresh = useRefresh();
	const search = Route.useSearch();
	const next = safeRedirectPath(search.redirect);

	return (
		<AuthForm
			title="Нэвтрэх"
			description="Үргэлжлүүлэхийн тулд имэйл, нууц үгээ оруулна уу."
			submitLabel="Нэвтрэх"
			notice={search.error ? errorMessages[search.error] : null}
			redirect={next}
			onSubmit={async (credentials) => {
				const { error } = await signIn({ data: credentials });
				if (error) return error;
				await refresh();
				await router.navigate({ to: next });
				return null;
			}}
			footer={
				<>
					{"Бүртгэлгүй юу? "}
					<Link
						to="/signup"
						className="text-foreground underline underline-offset-4"
					>
						{"Бүртгүүлэх"}
					</Link>
				</>
			}
		/>
	);
}
