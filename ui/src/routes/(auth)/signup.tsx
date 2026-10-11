import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { useRefresh } from "@/hooks/use-refresh";
import { signUp } from "@/lib/auth";
import { AuthForm } from "./-components/auth-form";

export const Route = createFileRoute("/(auth)/signup")({
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/home" });
	},
	component: Signup,
});

function Signup() {
	const router = useRouter();
	const refresh = useRefresh();
	const [notice, setNotice] = useState<string | null>(null);

	return (
		<AuthForm
			title="Бүртгэл үүсгэх"
			description="Имэйл болон нууц үгээрээ бүртгүүлнэ үү."
			submitLabel="Бүртгүүлэх"
			notice={notice}
			onSubmit={async (credentials) => {
				const { error, needsConfirmation } = await signUp({
					data: credentials,
				});
				if (error) return error;
				if (needsConfirmation) {
					setNotice("Баталгаажуулах холбоосыг имэйлээсээ шалгана уу.");
					return null;
				}
				await refresh();
				await router.navigate({ to: "/home" });
				return null;
			}}
			footer={
				<>
					{"Бүртгэлтэй юу? "}
					<Link
						to="/login"
						className="text-foreground underline underline-offset-4"
					>
						{"Нэвтрэх"}
					</Link>
				</>
			}
		/>
	);
}
