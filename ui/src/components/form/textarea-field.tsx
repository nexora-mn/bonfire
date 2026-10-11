import type { ComponentProps } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell } from "./field-shell";
import type { BaseFieldProps } from "./types";

export function TextareaField<T extends FieldValues, TOut>({
	control,
	name,
	label,
	description,
	className,
	...props
}: BaseFieldProps<T, TOut> &
	Omit<
		ComponentProps<"textarea">,
		"name" | "value" | "onChange" | "className"
	>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FieldShell
					id={name}
					label={label}
					description={description}
					error={fieldState.error}
					className={className}
				>
					<Textarea
						{...props}
						{...field}
						value={field.value ?? ""}
						id={name}
						aria-invalid={fieldState.invalid}
					/>
				</FieldShell>
			)}
		/>
	);
}
