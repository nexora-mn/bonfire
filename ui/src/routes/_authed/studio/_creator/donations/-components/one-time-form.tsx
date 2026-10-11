import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import { useFieldArray, useWatch } from "react-hook-form";
import { CurrencyField } from "@/components/form/currency-field";
import { FormStatus } from "@/components/form/form-status";
import { SubmitButton } from "@/components/form/submit-button";
import { SwitchField } from "@/components/form/switch-field";
import { TextareaField } from "@/components/form/textarea-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { useActionForm } from "@/hooks/use-action-form";
import { useRefresh } from "@/hooks/use-refresh";
import { type Creator, updateOneTime } from "@/lib/api/creator";
import {
	DEFAULT_PRESET_AMOUNT,
	MAX_PRESETS,
	MAX_THANKS_LENGTH,
} from "@/lib/constants";
import { oneTimeSchema } from "@/lib/schemas/creator";

export function OneTimeForm({ settings }: { settings: Creator["oneTime"] }) {
	const refresh = useRefresh();
	const { form, onSubmit, pending, error, saved } = useActionForm({
		schema: oneTimeSchema,
		defaultValues: {
			enabled: settings.enabled,
			min: settings.min,
			presets: settings.presets.map((value) => ({ value })),
			thanks: settings.thanks,
		},
		action: async ({ presets, ...values }) => {
			const result = await updateOneTime({
				data: { ...values, presets: presets.map((p) => p.value) },
			});
			if (result.error) return result.error;
			form.reset(form.getValues());
			await refresh();
			return null;
		},
	});
	const presets = useFieldArray({ control: form.control, name: "presets" });
	const [enabled, thanks] = useWatch({
		control: form.control,
		name: ["enabled", "thanks"],
	});
	const { isDirty, errors } = form.formState;
	const presetsError = errors.presets;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Тохиргоо"}</CardTitle>
				<CardDescription>
					{"Дүнгийн хязгаар, санал болгох дүнгүүд болон талархлын үг."}
				</CardDescription>
				<CardAction>
					<Badge variant={enabled ? "default" : "secondary"}>
						{enabled ? "Идэвхтэй" : "Унтраалттай"}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<form id="one-time-form" onSubmit={onSubmit} noValidate>
					<FieldGroup>
						<FormStatus
							error={error}
							saved={saved && !isDirty}
							savedMessage="Тохиргоо хадгалагдлаа."
						/>
						<SwitchField
							control={form.control}
							name="enabled"
							label="Нэг удаагийн дэмжлэг авах"
							description="Унтраавал хуудсан дээр зөвхөн гишүүнчлэл харагдана."
							className="rounded-2xl bg-muted/50 p-4"
						/>
						<FieldSet
							className={cn("transition-opacity", !enabled && "opacity-60")}
						>
							<FieldLegend>{"Дүн"}</FieldLegend>
							<FieldDescription>
								{
									"Дэмжигч нэг товшилтоор дүн сонгох эсвэл хүссэн дүнгээ бичиж болно."
								}
							</FieldDescription>
							<CurrencyField
								control={form.control}
								name="min"
								label="Хамгийн бага дүн"
								className="sm:max-w-56"
							/>
							<FieldGroup className="gap-3">
								<div className="flex items-baseline justify-between gap-2">
									<p className="text-sm font-medium">
										{"Санал болгох дүнгүүд"}
									</p>
									<span className="text-xs text-muted-foreground tabular-nums">
										{`${presets.fields.length}/${MAX_PRESETS}`}
									</span>
								</div>
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
									{presets.fields.map((item, index) => (
										<div key={item.id} className="group relative">
											<CurrencyField
												control={form.control}
												name={`presets.${index}.value`}
												aria-label={`Дүн ${index + 1}`}
											/>
											<Button
												type="button"
												variant="neutral"
												size="icon-xs"
												aria-label={`Дүн ${index + 1}-г хасах`}
												className="absolute -top-2 -right-2 rounded-full opacity-100 transition-opacity focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
												onClick={() => presets.remove(index)}
											>
												<HugeiconsIcon icon={Cancel01Icon} />
											</Button>
										</div>
									))}
									{presets.fields.length < MAX_PRESETS && (
										<button
											type="button"
											onClick={() =>
												presets.append({ value: DEFAULT_PRESET_AMOUNT })
											}
											className="flex h-9 items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-sm font-medium text-muted-foreground transition-colors outline-none hover:border-primary hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
										>
											<HugeiconsIcon icon={Add01Icon} className="size-4" />
											{"Дүн нэмэх"}
										</button>
									)}
								</div>
								<FieldError
									errors={[
										presetsError?.root ?? presetsError,
										...(Array.isArray(presetsError)
											? presetsError.map((e) => e?.value)
											: []),
									]}
								/>
							</FieldGroup>
						</FieldSet>
						<FieldSeparator />
						<TextareaField
							control={form.control}
							name="thanks"
							label="Талархлын үг"
							description={
								<span className="flex justify-between gap-2">
									{"Дэмжлэг илгээсний дараа дэмжигчид харагдана."}
									<span className="tabular-nums">
										{`${thanks.length}/${MAX_THANKS_LENGTH}`}
									</span>
								</span>
							}
							placeholder="Дэмжсэнд баярлалаа! Таны ачаар..."
							rows={4}
							maxLength={MAX_THANKS_LENGTH}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className="justify-between gap-3 border-t">
				<span className="text-sm text-muted-foreground">
					{isDirty && "Хадгалаагүй өөрчлөлт байна."}
				</span>
				<SubmitButton
					form="one-time-form"
					pending={pending}
					disabled={!isDirty || pending}
				>
					{"Хадгалах"}
				</SubmitButton>
			</CardFooter>
		</Card>
	);
}
