import { FormStatus } from "@/components/form/form-status";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useActionForm } from "@/hooks/use-action-form";
import { type AuthUser, updatePassword } from "@/lib/auth";
import { newPasswordSchema } from "@/lib/schemas/auth";

export function PasswordForm({ user }: { user: AuthUser }) {
	// OAuth-only accounts have no password; setting one enables email sign-in.
	const hasPassword = user.providers.includes("email");
	const { form, onSubmit, pending, error, saved } = useActionForm({
		schema: newPasswordSchema,
		defaultValues: { password: "", confirm: "" },
		action: async ({ password }) => {
			const result = await updatePassword({ data: { password } });
			if (!result.error) form.reset();
			return result.error;
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{hasPassword ? "Нууц үг солих" : "Нууц үг тохируулах"}
				</CardTitle>
				<CardDescription>
					{hasPassword
						? "Хамгийн багадаа 6 тэмдэгттэй шинэ нууц үг сонгоно уу."
						: "Нууц үг тохируулбал имэйлээрээ ч нэвтрэх боломжтой болно."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="password-form" onSubmit={onSubmit} noValidate>
					<FieldGroup>
						<FormStatus
							error={error}
							saved={saved}
							savedMessage="Нууц үг шинэчлэгдлээ."
						/>
						<TextField
							control={form.control}
							name="password"
							label="Шинэ нууц үг"
							type="password"
							autoComplete="new-password"
						/>
						<TextField
							control={form.control}
							name="confirm"
							label="Нууц үгээ давтах"
							type="password"
							autoComplete="new-password"
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="justify-end">
				<SubmitButton form="password-form" pending={pending}>
					{hasPassword ? "Нууц үг солих" : "Нууц үг тохируулах"}
				</SubmitButton>
			</CardFooter>
		</Card>
	);
}
