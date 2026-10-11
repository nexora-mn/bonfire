import type { SimpleIcon } from "simple-icons";

export function BrandIcon({
	icon,
	color,
}: {
	icon: SimpleIcon;
	color?: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-4"
			fill={color ?? "currentColor"}
		>
			<path d={icon.path} />
		</svg>
	);
}
