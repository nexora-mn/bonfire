import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "@tanstack/react-router";
import { BrandButton } from "@/components/brand-button";
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
import { type AuthUser, updateProfile } from "@/lib/auth";
import { UserAvatar } from "../user-avatar";
import { FormStatus } from "./form-status";
import { useFormAction } from "./use-form-action";

const memberSince = new Intl.DateTimeFormat("mn-MN", { dateStyle: "long" });

export function ProfileForm({ user }: { user: AuthUser }) {
	const router = useRouter();
	const { pending, error, saved, onSubmit } = useFormAction(async (form) => {
		const result = await updateProfile({
			data: { name: String(form.get("name")) },
		});
		// Refresh the route context so the sidebar shows the new name.
		if (!result.error) await router.invalidate();
		return result.error;
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
				<form id="profile-form" onSubmit={onSubmit}>
					<FieldGroup>
						<div className="flex items-center gap-4">
							<UserAvatar user={user} className="size-16 text-xl" />
							<div className="text-sm">
								<p className="font-medium">{user.email}</p>
								<p className="text-muted-foreground">
									{`${memberSince.format(new Date(user.createdAt))}-с хойш гишүүн`}
								</p>
							</div>
						</div>
						<FormStatus
							error={error}
							saved={saved}
							savedMessage="Мэдээлэл хадгалагдлаа."
						/>
						<Field>
							<FieldLabel htmlFor="name">{"Нэр"}</FieldLabel>
							<Input
								id="name"
								name="name"
								defaultValue={user.name}
								autoComplete="name"
								maxLength={80}
								required
							/>
						</Field>
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
				<BrandButton type="submit" form="profile-form" disabled={pending}>
					{pending && (
						<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
					)}
					{"Хадгалах"}
				</BrandButton>
			</CardFooter>
		</Card>
	);
}
