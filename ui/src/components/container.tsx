import { cn } from "cn";
import type { ComponentProps } from "react";

/** Centers page content at the site's max width with consistent side padding. */
export function Container({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}
			{...props}
		/>
	);
}
