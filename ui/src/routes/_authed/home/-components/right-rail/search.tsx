import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";

export function RailSearch() {
	const navigate = useNavigate();

	return (
		<search>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					const q = String(new FormData(event.currentTarget).get("q")).trim();
					navigate({ to: "/home/discover", search: { q: q || undefined } });
				}}
				className="relative"
			>
				<HugeiconsIcon
					icon={Search01Icon}
					className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<input
					name="q"
					type="search"
					maxLength={100}
					placeholder="Бүтээгч хайх"
					aria-label="Бүтээгч хайх"
					className="h-11 w-full rounded-xl bg-card pr-4 pl-11 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
				/>
			</form>
		</search>
	);
}
