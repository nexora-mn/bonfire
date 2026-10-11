import type { ComponentProps } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/utils/money";
import { FieldShell } from "./field-shell";
import type { BaseFieldProps } from "./types";

/** Shows "15,000" while editing; stores a number, or "" when cleared. */
export function CurrencyField<T extends FieldValues, TOut>({
	control,
	name,
	label,
	description,
	className,
	...props
}: BaseFieldProps<T, TOut> &
	Omit<
		ComponentProps<"input">,
		"name" | "value" | "onChange" | "className" | "type"
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
					<div className="relative">
						<Input
							{...props}
							ref={field.ref}
							name={field.name}
							onBlur={field.onBlur}
							id={name}
							type="text"
							inputMode="numeric"
							autoComplete="off"
							value={
								field.value === "" || field.value == null
									? ""
									: formatAmount(Number(field.value))
							}
							onChange={(e) => {
								const digits = e.target.value.replace(/\D/g, "");
								field.onChange(digits === "" ? "" : Number(digits));
							}}
							aria-invalid={fieldState.invalid}
							className="pr-8 tabular-nums"
						/>
						<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
							{"₮"}
						</span>
					</div>
				</FieldShell>
			)}
		/>
	);
}
