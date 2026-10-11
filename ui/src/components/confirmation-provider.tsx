import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	ConfirmationContext,
	type ConfirmationOptions,
} from "@/hooks/use-confirmation";

export function ConfirmationProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState<"confirm" | "cancel" | null>(null);
	const [options, setOptions] = useState<ConfirmationOptions>({ title: "" });

	const showDialog = useCallback((next: ConfirmationOptions) => {
		setOptions(next);
		setOpen(true);
	}, []);
	const hideDialog = useCallback(() => setOpen(false), []);
	const value = useMemo(
		() => ({ showDialog, hideDialog }),
		[showDialog, hideDialog],
	);

	// A throwing callback keeps the dialog open so the user can retry.
	async function run(kind: "confirm" | "cancel") {
		setPending(kind);
		try {
			await (kind === "confirm" ? options.onConfirm : options.onCancel)?.();
			setOpen(false);
		} catch {
		} finally {
			setPending(null);
		}
	}

	return (
		<ConfirmationContext.Provider value={value}>
			{children}
			<AlertDialog
				open={open}
				onOpenChange={(next) => !pending && setOpen(next)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{options.title}</AlertDialogTitle>
						{options.description && (
							<AlertDialogDescription>
								{options.description}
							</AlertDialogDescription>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="neutral"
							disabled={!!pending}
							onClick={() => run("cancel")}
						>
							{pending === "cancel" && (
								<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
							)}
							{options.cancelText ?? "Болих"}
						</Button>
						<Button
							variant={options.variant ?? "default"}
							disabled={!!pending}
							onClick={() => run("confirm")}
						>
							{pending === "confirm" && (
								<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
							)}
							{options.confirmText ?? "Тийм"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ConfirmationContext.Provider>
	);
}
