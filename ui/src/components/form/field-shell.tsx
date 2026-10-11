import type { ReactNode } from "react";
import type { FieldError as RHFFieldError } from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";

export function FieldShell({
	id,
	label,
	description,
	error,
	className,
	children,
}: {
	id: string;
	/** Omit when the control has an `aria-label`. */
	label?: ReactNode;
	description?: ReactNode;
	error?: RHFFieldError;
	className?: string;
	children: ReactNode;
}) {
	return (
		<Field data-invalid={!!error} className={className}>
			{label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
			{children}
			{description && <FieldDescription>{description}</FieldDescription>}
			<FieldError errors={[error]} />
		</Field>
	);
}
