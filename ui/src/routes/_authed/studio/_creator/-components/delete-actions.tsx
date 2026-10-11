import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useRefresh } from "@/hooks/use-refresh";

export function DeleteActions({
	prompt,
	onEdit,
	onDelete,
}: {
	prompt: string;
	onEdit: () => void;
	onDelete: () => Promise<unknown>;
}) {
	const refresh = useRefresh();
	const { showDialog } = useConfirmation();

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={() =>
					showDialog({
						title: prompt,
						description: "Устгасны дараа сэргээх боломжгүй.",
						variant: "destructive",
						confirmText: "Устгах",
						onConfirm: async () => {
							await onDelete();
							await refresh();
						},
					})
				}
			>
				<HugeiconsIcon icon={Delete02Icon} />
				{"Устгах"}
			</Button>
			<Button variant="outline" size="sm" onClick={onEdit}>
				<HugeiconsIcon icon={PencilEdit02Icon} />
				{"Засах"}
			</Button>
		</>
	);
}
