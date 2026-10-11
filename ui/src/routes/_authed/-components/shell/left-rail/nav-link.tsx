import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import type { ShellNavItem } from "../types";

export function NavLink({ item }: { item: ShellNavItem }) {
	return (
		<Link
			to={item.to}
			activeOptions={{ exact: item.exact }}
			aria-label={item.label}
			className="group flex size-12 items-center justify-center gap-3 rounded-xl text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground data-[status=active]:bg-foreground/[0.08] data-[status=active]:text-foreground xl:h-11 xl:w-full xl:justify-start xl:px-3"
		>
			{({ isActive }) => (
				<>
					<HugeiconsIcon
						icon={item.icon}
						className="size-6"
						strokeWidth={isActive ? 2.2 : 1.7}
					/>
					<span
						className={cn(
							"hidden text-[0.9375rem] whitespace-nowrap xl:inline",
							isActive ? "font-bold" : "font-medium",
						)}
					>
						{item.label}
					</span>
				</>
			)}
		</Link>
	);
}
