import { FormStatus } from "@/components/form/form-status";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { FieldGroup } from "@/components/ui/field";
import { useActionForm } from "@/hooks/use-action-form";
import {
	type CreatorProfileInput,
	creatorProfileSchema,
} from "@/lib/schemas/creator";
import { LinksField } from "./links-field";
import { SlugField } from "./slug-field";

/** Used both to create and to edit a page. */
export function CreatorProfileForm({
	defaultValues,
	submitLabel,
	savedMessage,
	action,
}: {
	defaultValues: CreatorProfileInput;
	submitLabel: string;
	savedMessage: string;
	action: (values: CreatorProfileInput) => Promise<string | null>;
}) {
	const { form, onSubmit, pending, error, saved } = useActionForm({
		schema: creatorProfileSchema,
		defaultValues,
		action,
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<FieldGroup>
				<FormStatus error={error} saved={saved} savedMessage={savedMessage} />
				<SlugField control={form.control} />
				<TextField
					control={form.control}
					name="displayName"
					label="Нэр"
					description="Хуудасны тань дээр том үсгээр харагдана."
					maxLength={80}
				/>
				<TextareaField
					control={form.control}
					name="about"
					label="Миний тухай"
					description="Юу бүтээдэг, яагаад дэмжлэг хэрэгтэй байгаагаа товч бичээрэй."
					rows={6}
					maxLength={5000}
				/>
				<LinksField control={form.control} />
				<div className="flex justify-end">
					<SubmitButton pending={pending}>{submitLabel}</SubmitButton>
				</div>
			</FieldGroup>
		</form>
	);
}
