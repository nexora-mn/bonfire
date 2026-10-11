import { Controller, type FieldValues } from "react-hook-form";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { BaseFieldProps } from "./types";

export function SwitchField<T extends FieldValues, TOut>({
	control,
	name,
	label,
	description,
	className,
}: BaseFieldProps<T, TOut>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Field orientation="horizontal" className={className}>
					<FieldContent>
						<FieldLabel htmlFor={name}>{label}</FieldLabel>
						{description && <FieldDescription>{description}</FieldDescription>}
					</FieldContent>
					<Switch
						id={name}
						checked={field.value}
						onCheckedChange={field.onChange}
					/>
				</Field>
			)}
		/>
	);
}
