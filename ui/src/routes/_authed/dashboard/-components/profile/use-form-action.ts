import { useState } from "react";

const fallbackError = "Алдаа гарлаа. Дахин оролдоно уу.";

/**
 * Tracks pending, error and success state for a form submit.
 * `action` resolves to an error message, or null on success.
 */
export function useFormAction(
	action: (form: FormData) => Promise<string | null>,
) {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const formElement = event.currentTarget;
		setPending(true);
		setError(null);
		setSaved(false);
		try {
			const message = await action(new FormData(formElement));
			setError(message);
			setSaved(!message);
		} catch (err) {
			setError(err instanceof Error ? err.message : fallbackError);
		} finally {
			setPending(false);
		}
	}

	return { pending, error, saved, onSubmit };
}
