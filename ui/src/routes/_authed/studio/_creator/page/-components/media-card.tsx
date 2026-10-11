import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FormStatus } from "@/components/form/form-status";
import { InitialAvatar } from "@/components/initial-avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useRefresh } from "@/hooks/use-refresh";
import { type Creator, removeMedia } from "@/lib/api/creator";
import { ImagePicker } from "../../-components/image-picker";

/** Images upload as soon as they're picked. */
export function MediaCard({ creator }: { creator: Creator }) {
	const refresh = useRefresh();
	const [error, setError] = useState<string | null>(null);
	const { showDialog } = useConfirmation();

	function remove(kind: "avatar" | "cover") {
		showDialog({
			title:
				kind === "avatar"
					? "Профайл зургийг устгах уу?"
					: "Нүүр зургийг устгах уу?",
			variant: "destructive",
			confirmText: "Устгах",
			onConfirm: async () => {
				setError(null);
				const result = await removeMedia({ data: { kind } });
				if (result.error) setError(result.error);
				else await refresh();
			},
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Зураг"}</CardTitle>
				<CardDescription>
					{
						"Нүүр зураг 1500×500, профайл зураг дөрвөлжин байвал хамгийн гоё харагдана. 5 MB хүртэл."
					}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<FormStatus error={error} saved={false} savedMessage="" />
				<div className="relative">
					<div className="aspect-[3/1] overflow-hidden rounded-xl bg-gradient-to-br from-flame/40 to-primary/20">
						{creator.coverUrl && (
							<img
								src={creator.coverUrl}
								alt=""
								className="size-full object-cover"
							/>
						)}
					</div>
					<InitialAvatar
						src={creator.avatarUrl}
						name={creator.displayName}
						className="absolute -bottom-8 left-4 size-20 border-4 border-card text-2xl"
					/>
				</div>
				<div className="mt-8 flex flex-wrap gap-2">
					<ImagePicker
						kind="avatar"
						label="Профайл зураг солих"
						onUploaded={refresh}
						onError={setError}
					/>
					{creator.avatarUrl && (
						<Button variant="ghost" size="sm" onClick={() => remove("avatar")}>
							<HugeiconsIcon icon={Delete02Icon} />
							{"Профайл зураг устгах"}
						</Button>
					)}
					<ImagePicker
						kind="cover"
						label="Нүүр зураг солих"
						onUploaded={refresh}
						onError={setError}
					/>
					{creator.coverUrl && (
						<Button variant="ghost" size="sm" onClick={() => remove("cover")}>
							<HugeiconsIcon icon={Delete02Icon} />
							{"Нүүр зураг устгах"}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
