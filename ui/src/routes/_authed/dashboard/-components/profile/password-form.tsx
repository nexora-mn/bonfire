import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrandButton } from "@/components/brand-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type AuthUser, updatePassword } from "@/lib/auth";
import { FormStatus } from "./form-status";
import { useFormAction } from "./use-form-action";

export function PasswordForm({ user }: { user: AuthUser }) {
	// OAuth-only accounts have no password yet; setting one enables email sign-in.
	const hasPassword = user.providers.includes("email");
	const { pending, error, saved, onSubmit } = useFormAction(async (form) => {
		const password = String(form.get("password"));
		if (password !== form.get("confirm")) return "Нууц үгнүүд таарахгүй байна.";
		const result = await updatePassword({ data: { password } });
		return result.error;
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
				<form
					id="password-form"
					onSubmit={async (event) => {
						const formElement = event.currentTarget;
						await onSubmit(event);
						formElement.reset();
					}}
				>
					<FieldGroup>
						<FormStatus
							error={error}
							saved={saved}
							savedMessage="Нууц үг шинэчлэгдлээ."
						/>
						<Field>
							<FieldLabel htmlFor="password">{"Шинэ нууц үг"}</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								minLength={6}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm">{"Нууц үгээ давтах"}</FieldLabel>
							<Input
								id="confirm"
								name="confirm"
								type="password"
								autoComplete="new-password"
								minLength={6}
								required
							/>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="justify-end">
				<BrandButton type="submit" form="password-form" disabled={pending}>
					{pending && (
						<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
					)}
					{hasPassword ? "Нууц үг солих" : "Нууц үг тохируулах"}
				</BrandButton>
			</CardFooter>
		</Card>
	);
}
