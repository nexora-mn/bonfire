import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";

export function EmptyState({
	icon,
	title,
	text,
	className,
}: {
	icon: IconSvgElement;
	title: string;
	text: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-3xl border-2 border-dashed px-6 py-14 text-center",
				className,
			)}
		>
			<span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
				<HugeiconsIcon icon={icon} className="size-6" />
			</span>
			<h3 className="mt-4 font-bold">{title}</h3>
			<p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>
		</div>
	);
}
