import { Alert, AlertDescription } from "@/components/ui/alert";

/** Error or success message under a profile form; renders nothing when idle. */
export function FormStatus({
	error,
	saved,
	savedMessage,
}: {
	error: string | null;
	saved: boolean;
	savedMessage: string;
}) {
	if (!error && !saved) return null;

	return (
		<Alert variant={error ? "destructive" : "default"}>
			<AlertDescription>{error ?? savedMessage}</AlertDescription>
		</Alert>
	);
}
