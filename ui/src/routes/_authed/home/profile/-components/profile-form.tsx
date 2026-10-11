import { FormStatus } from "@/components/form/form-status";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { InitialAvatar } from "@/components/initial-avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { useRefresh } from "@/hooks/use-refresh";
import { type AuthUser, updateProfile } from "@/lib/auth";
import { profileSchema } from "@/lib/schemas/auth";
import { formatLongDate } from "@/lib/utils/date";
import { displayName } from "@/lib/utils/user";

export function ProfileForm({ user }: { user: AuthUser }) {
	const refresh = useRefresh();
	const { form, onSubmit, pending, error, saved } = useActionForm({
		schema: profileSchema,
		defaultValues: { name: user.name ?? "" },
		action: async (values) => {
			const result = await updateProfile({ data: values });
			if (!result.error) await refresh();
			return result.error;
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Хувийн мэдээлэл"}</CardTitle>
				<CardDescription>
					{"Таны нэр дэмжигчдэд болон хяналтын самбарт харагдана."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="profile-form" onSubmit={onSubmit} noValidate>
					<FieldGroup>
						<div className="flex items-center gap-4">
							<InitialAvatar
								src={user.avatarUrl}
								name={displayName(user)}
								className="size-16 text-xl"
							/>
							<div className="text-sm">
								<p className="font-medium">{user.email}</p>
								<p className="text-muted-foreground">
									{`${formatLongDate(user.createdAt)}-с хойш гишүүн`}
								</p>
							</div>
						</div>
						<FormStatus
							error={error}
							saved={saved}
							savedMessage="Мэдээлэл хадгалагдлаа."
						/>
						<TextField
							control={form.control}
							name="name"
							label="Нэр"
							autoComplete="name"
						/>
						<Field>
							<FieldLabel htmlFor="email">{"Имэйл"}</FieldLabel>
							<Input id="email" value={user.email ?? ""} disabled readOnly />
							<FieldDescription>
								{"Имэйл хаягийг өөрчлөх боломжгүй."}
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="justify-end">
				<SubmitButton form="profile-form" pending={pending}>
					{"Хадгалах"}
				</SubmitButton>
			</CardFooter>
		</Card>
	);
}
