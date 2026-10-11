import * as Sentry from "@sentry/tanstackstart-react";
import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { FlameMark } from "@/components/flame-mark";
import { Button } from "@/components/ui/button";

/** Router error boundaries swallow errors, so report them here. */
export function RouteError({ error, reset }: ErrorComponentProps) {
	const router = useRouter();

	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
			<FlameMark className="w-14" />
			<h1 className="text-2xl font-extrabold">{"Алдаа гарлаа"}</h1>
			<p className="max-w-sm text-muted-foreground">
				{"Бид мэдэгдэл хүлээн авлаа. Дахин оролдоно уу."}
			</p>
			<Button
				onClick={async () => {
					await router.invalidate();
					reset();
				}}
			>
				{"Дахин оролдох"}
			</Button>
		</div>
	);
}
