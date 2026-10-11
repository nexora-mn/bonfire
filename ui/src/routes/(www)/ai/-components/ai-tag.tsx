import { cn } from "cn";

export type AiTagKind = "assisted" | "generated";

const tags: Record<AiTagKind, { label: string; className: string }> = {
	assisted: { label: "AI assisted", className: "bg-spark text-ink" },
	generated: { label: "AI generated", className: "bg-coral text-ink" },
};

/** The label shown on a post whose creator marked it as made with AI. */
export function AiTag({
	kind,
	className,
}: {
	kind: AiTagKind;
	className?: string;
}) {
	const tag = tags[kind];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
				tag.className,
				className,
			)}
		>
			<span aria-hidden="true">✦</span>
			{tag.label}
		</span>
	);
}
