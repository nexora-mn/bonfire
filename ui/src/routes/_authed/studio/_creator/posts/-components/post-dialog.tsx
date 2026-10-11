import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FormStatus } from "@/components/form/form-status";
import { SelectField } from "@/components/form/select-field";
import { SubmitButton } from "@/components/form/submit-button";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useActionForm } from "@/hooks/use-action-form";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useRefresh } from "@/hooks/use-refresh";
import { type Post, savePost } from "@/lib/api/creator";
import { POST_VISIBILITY_LABELS } from "@/lib/constants";
import { postSchema } from "@/lib/schemas/creator";
import { ImagePicker } from "../../-components/image-picker";

/** `post = null` writes a new one. */
export function PostDialog({
	post,
	onClose,
}: {
	post: Post | null;
	onClose: () => void;
}) {
	const refresh = useRefresh();
	const { showDialog } = useConfirmation();
	// Preview URL of the chosen image; the form only tracks its key.
	const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const { form, onSubmit, pending, error } = useActionForm({
		schema: postSchema,
		defaultValues: {
			title: post?.title ?? "",
			body: post?.body ?? "",
			imageKey: post?.imageKey ?? null,
			visibility: (post?.visibility as "public" | "members") ?? "public",
		},
		action: async (values) => {
			const result = await savePost({ data: { ...values, id: post?.id } });
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
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>{post ? "Нийтлэл засах" : "Шинэ нийтлэл"}</DialogTitle>
					<DialogDescription>
						{"Гишүүдэд зориулсан нийтлэлийг бусад нь зөвхөн гарчгаар нь харна."}
					</DialogDescription>
				</DialogHeader>
				<form id="post-form" onSubmit={onSubmit} noValidate>
					<FieldGroup>
						<FormStatus
							error={error ?? uploadError}
							saved={false}
							savedMessage=""
						/>
						<TextField
							control={form.control}
							name="title"
							label="Гарчиг"
							maxLength={200}
						/>
						<TextareaField
							control={form.control}
							name="body"
							label="Агуулга"
							rows={8}
							maxLength={20000}
						/>
						<Field>
							<FieldLabel>{"Зураг"}</FieldLabel>
							{imageUrl && (
								<div className="relative">
									<img
										src={imageUrl}
										alt=""
										className="aspect-[2/1] w-full rounded-lg object-cover"
									/>
									<Button
										type="button"
										variant="secondary"
										size="icon"
										aria-label="Зургийг хасах"
										className="absolute top-2 right-2"
										onClick={() => {
											setImageUrl(null);
											form.setValue("imageKey", null, { shouldDirty: true });
										}}
									>
										<HugeiconsIcon icon={Cancel01Icon} />
									</Button>
								</div>
							)}
							<div>
								<ImagePicker
									kind="post"
									label={imageUrl ? "Зураг солих" : "Зураг нэмэх"}
									onUploaded={(image) => {
										setImageUrl(image.url);
										form.setValue("imageKey", image.key, { shouldDirty: true });
									}}
									onError={setUploadError}
								/>
							</div>
						</Field>
						<SelectField
							control={form.control}
							name="visibility"
							label="Хэнд харагдах вэ?"
							options={POST_VISIBILITY_LABELS}
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<SubmitButton form="post-form" pending={pending}>
						{post ? "Хадгалах" : "Нийтлэх"}
					</SubmitButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
