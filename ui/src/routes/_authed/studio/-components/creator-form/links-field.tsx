import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type Control, useFieldArray } from "react-hook-form";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field";
import { MAX_LINKS, PLATFORM_LABELS } from "@/lib/constants";
import type { CreatorProfileInput } from "@/lib/schemas/creator";

export function LinksField({
	control,
}: {
	control: Control<CreatorProfileInput>;
}) {
	const { fields, append, remove } = useFieldArray({ control, name: "links" });

	return (
		<FieldSet>
			<FieldLabel>{"Сошиал холбоосууд"}</FieldLabel>
			<FieldDescription>
				{"Дэмжигчид таныг өөр хаана дагаж болохыг харуулна."}
			</FieldDescription>
			<div className="flex flex-col gap-3">
				{fields.map((item, index) => (
					<div key={item.id} className="flex items-start gap-2">
						<SelectField
							control={control}
							name={`links.${index}.platform`}
							options={PLATFORM_LABELS}
							aria-label="Платформ"
							className="w-36 shrink-0"
						/>
						<TextField
							control={control}
							name={`links.${index}.url`}
							type="url"
							placeholder="https://"
							aria-label="Холбоос"
							className="flex-1"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label="Устгах"
							onClick={() => remove(index)}
						>
							<HugeiconsIcon icon={Delete02Icon} />
						</Button>
					</div>
				))}
			</div>
			{fields.length < MAX_LINKS && (
				<div>
					<Button
						variant="neutral"
						size="sm"
						onClick={() => append({ platform: "instagram", url: "" })}
					>
						<HugeiconsIcon icon={Add01Icon} />
						{"Холбоос нэмэх"}
					</Button>
				</div>
			)}
		</FieldSet>
	);
}
