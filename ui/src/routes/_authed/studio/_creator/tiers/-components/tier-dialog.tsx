import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { CurrencyField } from "@/components/form/currency-field";
import { FormStatus } from "@/components/form/form-status";
import { SubmitButton } from "@/components/form/submit-button";
import { SwitchField } from "@/components/form/switch-field";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useActionForm } from "@/hooks/use-action-form";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useRefresh } from "@/hooks/use-refresh";
import { saveTier, type Tier } from "@/lib/api/creator";
import { DEFAULT_TIER_PRICE } from "@/lib/constants";
import { tierSchema } from "@/lib/schemas/creator";
import { ImagePicker } from "../../-components/image-picker";

/** `tier = null` creates a new one. */
export function TierDialog({
	tier,
	nextPosition,
	onClose,
}: {
	tier: Tier | null;
	nextPosition: number;
	onClose: () => void;
}) {
	const refresh = useRefresh();
	const { showDialog } = useConfirmation();
	// Preview URL of the chosen image; the form only tracks its key.
	const [imageUrl, setImageUrl] = useState(tier?.imageUrl ?? null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const { form, onSubmit, pending, error } = useActionForm({
		schema: tierSchema,
		defaultValues: {
			name: tier?.name ?? "",
			description: tier?.description ?? "",
			monthlyPrice: tier?.monthlyPrice ?? DEFAULT_TIER_PRICE,
			position: tier?.position ?? nextPosition,
			isActive: tier?.isActive ?? true,
			imageKey: tier?.imageKey ?? null,
		},
		action: async (values) => {
			const result = await saveTier({ data: { ...values, id: tier?.id } });
			if (result.error) return result.error;
			await refresh();
			onClose();
			return null;
		},
	});

	// Read during render so react-hook-form tracks it.
	const { isDirty } = form.formState;

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (open || pending) return;
				if (!isDirty) return onClose();
				showDialog({
					title: "Өөрчлөлтийг хаях уу?",
					description: "Оруулсан мэдээлэл хадгалагдахгүй.",
					variant: "destructive",
					confirmText: "Хаях",
					cancelText: "Үргэлжлүүлэх",
					onConfirm: onClose,
				});
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{tier ? "Түвшин засах" : "Шинэ түвшин"}</DialogTitle>
					<DialogDescription>
						{"Дэмжигчид энэ түвшинд сар бүр төлбөр төлнө."}
					</DialogDescription>
				</DialogHeader>
				<form id="tier-form" onSubmit={onSubmit} noValidate>
					<FieldGroup>
						<FormStatus
							error={error ?? uploadError}
							saved={false}
							savedMessage=""
						/>
						<Field>
							<FieldLabel>{"Зураг эсвэл дүрс"}</FieldLabel>
							<div className="flex items-center gap-4">
								<div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
									{imageUrl && (
										<>
											<img
												src={imageUrl}
												alt=""
												className="size-full object-cover"
											/>
											<Button
												type="button"
												variant="secondary"
												size="icon-xs"
												aria-label="Зургийг хасах"
												className="absolute top-1 right-1"
												onClick={() => {
													setImageUrl(null);
													form.setValue("imageKey", null, {
														shouldDirty: true,
													});
												}}
											>
												<HugeiconsIcon icon={Cancel01Icon} />
											</Button>
										</>
									)}
								</div>
								<div className="flex flex-col gap-1">
									<ImagePicker
										kind="tier"
										label={imageUrl ? "Солих" : "Зураг нэмэх"}
										onUploaded={(image) => {
											setImageUrl(image.url);
											form.setValue("imageKey", image.key, {
												shouldDirty: true,
											});
										}}
										onError={setUploadError}
									/>
									<FieldDescription>
										{"Дөрвөлжин зураг эсвэл дүрс, 5 MB хүртэл."}
									</FieldDescription>
								</div>
							</div>
						</Field>
						<TextField
							control={form.control}
							name="name"
							label="Нэр"
							placeholder="Жишээ нь: Галын хамгаалагч"
							maxLength={60}
						/>
						<CurrencyField
							control={form.control}
							name="monthlyPrice"
							label="Сарын үнэ"
						/>
						<TextareaField
							control={form.control}
							name="description"
							label="Юу авах вэ?"
							description="Энэ түвшний дэмжигчдэд өгөх давуу талууд."
							rows={4}
							maxLength={1000}
						/>
						<TextField
							control={form.control}
							name="position"
							label="Дараалал"
							description="Бага тоотой нь эхэнд харагдана."
							type="number"
							min={0}
						/>
						<SwitchField
							control={form.control}
							name="isActive"
							label="Хуудсан дээр харуулах"
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<SubmitButton form="tier-form" pending={pending}>
						{"Хадгалах"}
					</SubmitButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
