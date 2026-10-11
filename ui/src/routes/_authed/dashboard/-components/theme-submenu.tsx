import {
	ComputerIcon,
	Moon02Icon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/lib/theme";

const options: { value: Theme; label: string; icon: typeof Sun03Icon }[] = [
	{ value: "light", label: "Цайвар", icon: Sun03Icon },
	{ value: "dark", label: "Бараан", icon: Moon02Icon },
	{ value: "system", label: "Системийн", icon: ComputerIcon },
];

/** Light / dark / system picker, nested inside the account menu. */
export function ThemeSubmenu() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				{/* Icons follow the applied `.dark` class, so no hydration mismatch. */}
				<HugeiconsIcon icon={Sun03Icon} className="dark:hidden" />
				<HugeiconsIcon icon={Moon02Icon} className="hidden dark:block" />
				{"Өнгөний горим"}
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="min-w-40">
				<DropdownMenuRadioGroup
					value={theme}
					onValueChange={(value) => setTheme(value as Theme)}
				>
					{options.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							<HugeiconsIcon icon={option.icon} />
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
