import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { signUp } from "@/lib/auth";
import { AuthForm } from "./-components/auth-form";

export const Route = createFileRoute("/(auth)/signup")({
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/dashboard" });
	},
	component: Signup,
});

function Signup() {
	const router = useRouter();
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
				await router.invalidate();
				await router.navigate({ to: "/dashboard" });
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
