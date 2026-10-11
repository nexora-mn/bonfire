import { Alert, AlertDescription } from "@/components/ui/alert";

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
