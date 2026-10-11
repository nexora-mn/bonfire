import type { ComponentProps } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell } from "./field-shell";
import type { BaseFieldProps } from "./types";

export function TextField<T extends FieldValues, TOut>({
	control,
	name,
	label,
	description,
	className,
	...props
}: BaseFieldProps<T, TOut> &
	Omit<ComponentProps<"input">, "name" | "value" | "onChange" | "className">) {
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
					<Input
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
