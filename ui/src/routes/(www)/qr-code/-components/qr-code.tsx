import { cn } from "cn";
import { encode } from "uqr";
import { FlameMark } from "@/components/flame-mark";

/** Finder patterns sit in three 7×7 corners; they're drawn as rounded squares. */
function inFinder(x: number, y: number, size: number) {
	const near = (v: number) => v < 7;
	const far = (v: number) => v >= size - 7;
	return (near(x) && near(y)) || (far(x) && near(y)) || (near(x) && far(y));
}

/**
 * A scannable QR code drawn as dots, with the flame mark in the middle.
 * High error correction leaves room for the logo to cover the center.
 */
export function QrCode({
	value,
	className,
}: {
	value: string;
	className?: string;
}) {
	const { data, size } = encode(value, { ecc: "H", border: 0 });
	const logo = Math.round(size * 0.24);
	const logoStart = (size - logo) / 2;
	const inLogo = (x: number, y: number) =>
		x >= logoStart - 1 &&
		x < logoStart + logo + 1 &&
		y >= logoStart - 1 &&
		y < logoStart + logo + 1;
	const corners = [
		[0, 0],
		[size - 7, 0],
		[0, size - 7],
	];

	return (
		<svg
			viewBox={`-1 -1 ${size + 2} ${size + 2}`}
			role="img"
			aria-label="QR код"
			className={cn("text-ink", className)}
		>
			{data.flatMap((row, y) =>
				row.map((dark, x) =>
					dark && !inFinder(x, y, size) && !inLogo(x, y) ? (
						<circle
							// biome-ignore lint/suspicious/noArrayIndexKey: modules are a fixed grid
							key={`${x}-${y}`}
							cx={x + 0.5}
							cy={y + 0.5}
							r={0.42}
							fill="currentColor"
						/>
					) : null,
				),
			)}
			{corners.map(([x, y]) => (
				<g key={`${x}-${y}`} fill="none" stroke="currentColor">
					<rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.8} />
					<rect
						x={x + 2}
						y={y + 2}
						width={3}
						height={3}
						rx={0.9}
						fill="currentColor"
						stroke="none"
					/>
				</g>
			))}
			<rect
				x={logoStart}
				y={logoStart}
				width={logo}
				height={logo}
				rx={logo * 0.28}
				className="fill-ink"
			/>
			<FlameMark
				x={logoStart + logo * 0.15}
				y={logoStart + logo * 0.15}
				width={logo * 0.7}
				height={logo * 0.7}
				className="text-cream"
			/>
		</svg>
	);
}
