import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

/** Props every form field takes; `TOut` is the schema's parsed type. */
export type BaseFieldProps<T extends FieldValues, TOut> = {
	control: Control<T, unknown, TOut>;
	name: FieldPath<T>;
	label?: ReactNode;
	description?: ReactNode;
	className?: string;
};
