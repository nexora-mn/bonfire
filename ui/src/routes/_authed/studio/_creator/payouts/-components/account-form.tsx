import { FormStatus } from "@/components/form/form-status";
import { SelectField } from "@/components/form/select-field";
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
import { useRefresh } from "@/hooks/use-refresh";
import { type PayoutAccount, savePayoutAccount } from "@/lib/api/payout";
import { BANK_LABELS, type BankCode } from "@/lib/constants";
import { payoutAccountSchema } from "@/lib/schemas/payout";

export function AccountForm({ account }: { account: PayoutAccount | null }) {
	const refresh = useRefresh();
	const { form, onSubmit, pending, error, saved } = useActionForm({
		schema: payoutAccountSchema,
		defaultValues: {
			bankCode: account?.bankCode as BankCode | undefined,
			accountHolder: account?.accountHolder ?? "",
			accountNumber: account?.accountNumber ?? "",
		},
		action: async (values) => {
			const result = await savePayoutAccount({ data: values });
			if (!result.error) await refresh();
			return result.error;
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Дансны мэдээлэл"}</CardTitle>
				<CardDescription>
					{"Төлбөрийг зөвхөн таны нэр дээрх дансанд шилжүүлнэ."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="account-form" onSubmit={onSubmit} noValidate>
					<FieldGroup>
						<FormStatus
							error={error}
							saved={saved}
							savedMessage="Дансны мэдээлэл хадгалагдлаа."
						/>
						<SelectField
							control={form.control}
							name="bankCode"
							label="Банк"
							placeholder="Банкаа сонгоно уу"
							options={BANK_LABELS}
						/>
						<TextField
							control={form.control}
							name="accountHolder"
							label="Данс эзэмшигчийн нэр"
							autoComplete="name"
							maxLength={100}
						/>
						<TextField
							control={form.control}
							name="accountNumber"
							label="Дансны дугаар"
							description="Дансны дугаар эсвэл IBAN (MN…)."
							inputMode="numeric"
							autoComplete="off"
							maxLength={34}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="justify-end">
				<SubmitButton form="account-form" pending={pending}>
					{"Хадгалах"}
				</SubmitButton>
			</CardFooter>
		</Card>
	);
}
