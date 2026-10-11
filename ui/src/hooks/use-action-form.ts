import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type DefaultValues, type FieldValues, useForm } from "react-hook-form";
import type { z } from "zod";

const fallbackError = "Алдаа гарлаа. Дахин оролдоно уу.";

/**
 * react-hook-form + zod for a form that calls a server function on submit.
 * `action` gets the parsed values and resolves to an error message, or null
 * on success. The message lands in `errors.root` (shown by <FormStatus>).
 */
export function useActionForm<TInput extends FieldValues, TOutput>({
	schema,
	defaultValues,
	action,
}: {
	schema: z.ZodType<TOutput, TInput>;
	defaultValues: DefaultValues<TInput>;
	action: (values: TOutput) => Promise<string | null>;
}) {
	const form = useForm<TInput, unknown, TOutput>({
		// biome-ignore lint/suspicious/noExplicitAny: zodResolver's overloads need a concrete zod type
		resolver: zodResolver(schema as any),
		defaultValues,
	});
	const [saved, setSaved] = useState(false);

	const onSubmit = form.handleSubmit(async (values) => {
		setSaved(false);
		try {
			const message = await action(values);
			if (message) form.setError("root", { message });
			else setSaved(true);
		} catch (err) {
			form.setError("root", {
				message: err instanceof Error ? err.message : fallbackError,
			});
		}
	});

	return {
		form,
		onSubmit,
		saved,
		error: form.formState.errors.root?.message ?? null,
		pending: form.formState.isSubmitting,
	};
}
