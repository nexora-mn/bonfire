import { cn } from "cn";
import type { ComponentProps } from "react";

const tones = {
	dark: "",
	// Brand band: `light` switches theme tokens to light mode for dark text.
	flame: "light bg-flame text-foreground",
};

/** Full-bleed page section; tone sets its background and text color. */
export function Band({
	tone = "dark",
	className,
	...props
}: ComponentProps<"section"> & { tone?: keyof typeof tones }) {
	return (
		<section
			className={cn("py-20 lg:py-28", tones[tone], className)}
			{...props}
		/>
	);
}
