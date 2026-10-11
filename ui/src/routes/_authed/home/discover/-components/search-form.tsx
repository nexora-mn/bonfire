import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";

export function SearchForm({
	defaultValue,
	onSearch,
}: {
	defaultValue: string;
	onSearch: (q: string) => void;
}) {
	return (
		<search>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					onSearch(String(new FormData(event.currentTarget).get("q")).trim());
				}}
				className="relative"
			>
				<HugeiconsIcon
					icon={Search01Icon}
					className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					name="q"
					type="search"
					defaultValue={defaultValue}
					maxLength={100}
					placeholder="Нэр эсвэл хаягаар хайх"
					aria-label="Бүтээгч хайх"
					className="h-11 pl-9"
				/>
			</form>
		</search>
	);
}
