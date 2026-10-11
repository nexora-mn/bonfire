import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

/**
 * Chunky brand button with a pressed-down bevel. Each variant sets `--bevel`
 * (the colored ledge under the button); each size sets how deep it is.
 * Use `brandButtonVariants` to style a `<Link>` or `<a>` the same way.
 */
export const brandButtonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 font-extrabold tracking-wide whitespace-nowrap uppercase transition-[translate,box-shadow,filter] select-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				flame: "border-flame bg-flame text-ink [--bevel:var(--color-ember)]",
				/** For flame backgrounds, where the flame button would disappear. */
				ink: "border-ink bg-ink text-cream [--bevel:rgb(0_0_0/0.35)]",
				neutral:
					"border-secondary bg-secondary text-secondary-foreground [--bevel:color-mix(in_oklch,var(--secondary),black_22%)]",
				destructive:
					"border-destructive bg-destructive text-white [--bevel:color-mix(in_oklch,var(--destructive),black_35%)]",
			},
			size: {
				lg: "h-14 px-8 text-base shadow-[0_5px_0_0_var(--bevel)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--bevel)] [&_svg]:size-5",
				default:
					"h-11 px-5 text-sm shadow-[0_4px_0_0_var(--bevel)] active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--bevel)] [&_svg]:size-4",
				sm: "h-10 px-4 text-sm shadow-[0_3px_0_0_var(--bevel)] active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--bevel)] [&_svg]:size-4",
			},
		},
		defaultVariants: { variant: "flame", size: "default" },
	},
);

export function BrandButton({
	variant,
	size,
	className,
	type = "button",
	...props
}: ComponentProps<"button"> & VariantProps<typeof brandButtonVariants>) {
	return (
		<button
			type={type}
			className={cn(brandButtonVariants({ variant, size }), className)}
			{...props}
		/>
	);
}
