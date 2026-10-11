import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// Raised variants set `--bevel` (the ledge under the button) and sizes set
// `--depth`; flat variants leave `--bevel` unset so no ledge is drawn.
const raised =
	"shadow-[0_var(--depth)_0_0_var(--bevel)] hover:brightness-95 dark:hover:brightness-110 active:translate-y-[calc(var(--depth)-1px)] active:shadow-[0_1px_0_0_var(--bevel)]";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-transparent font-extrabold tracking-wide whitespace-nowrap uppercase transition-[translate,box-shadow,filter,background-color,color] outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: `border-flame bg-flame text-ink [--bevel:var(--color-ember)] ${raised}`,
				/** For flame backgrounds, where the default button would disappear. */
				ink: `border-ink bg-ink text-cream [--bevel:rgb(0_0_0/0.35)] ${raised}`,
				neutral: `border-secondary bg-secondary text-secondary-foreground [--bevel:color-mix(in_oklch,var(--secondary),black_22%)] ${raised}`,
				destructive: `border-destructive bg-destructive text-white [--bevel:color-mix(in_oklch,var(--destructive),black_35%)] ${raised}`,
				outline:
					"border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
				ghost:
					"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
				link: "text-primary normal-case underline-offset-4 hover:underline",
			},
			size: {
				lg: "h-14 px-8 text-base [--depth:5px] [&_svg:not([class*='size-'])]:size-5",
				default:
					"h-11 px-5 text-sm [--depth:4px] [&_svg:not([class*='size-'])]:size-4",
				sm: "h-10 px-4 text-sm [--depth:3px] [&_svg:not([class*='size-'])]:size-4",
				icon: "size-11 [--depth:4px] [&_svg:not([class*='size-'])]:size-4",
				"icon-xs":
					"size-6 rounded-lg border-0 [--depth:1px] [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8 [--depth:2px] [&_svg:not([class*='size-'])]:size-4",
				"icon-lg": "size-14 [--depth:5px] [&_svg:not([class*='size-'])]:size-5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
