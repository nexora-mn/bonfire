import { Controller, type FieldValues } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FieldShell } from "./field-shell";
import type { BaseFieldProps } from "./types";

/** `options` is `{ value: label }`. */
export function SelectField<T extends FieldValues, TOut>({
	control,
	name,
	label,
	description,
	className,
	options,
	placeholder,
	"aria-label": ariaLabel,
	triggerClassName = "w-full",
}: BaseFieldProps<T, TOut> & {
	options: Record<string, string>;
	placeholder?: string;
	"aria-label"?: string;
	triggerClassName?: string;
}) {
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
					<Select
						items={options}
						value={field.value ?? null}
						onValueChange={(value) => value && field.onChange(value)}
					>
						<SelectTrigger
							id={name}
							className={triggerClassName}
							aria-label={ariaLabel}
							aria-invalid={fieldState.invalid}
						>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(options).map(([value, text]) => (
								<SelectItem key={value} value={value}>
									{text}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FieldShell>
			)}
		/>
	);
}
