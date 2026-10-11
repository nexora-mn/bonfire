import { cn } from "cn";
import { useMemo } from "react";
import { encode } from "uqr";
import { FlameMark } from "@/components/flame-mark";

/**
 * Scannable QR code drawn as dots with the flame mark in the middle; high
 * error correction leaves room for the logo. All dots form one path, so a
 * code is a handful of DOM nodes instead of hundreds of circles.
 */
export function QrCode({
	value,
	className,
}: {
	value: string;
	className?: string;
}) {
	const { size, dots, logo, logoStart } = useMemo(() => {
		const { data, size } = encode(value, { ecc: "H", border: 0 });
		const logo = Math.round(size * 0.24);
		const logoStart = (size - logo) / 2;
		const logoMin = logoStart - 1;
		const logoMax = logoStart + logo + 1;
		let dots = "";
		data.forEach((row, y) => {
			row.forEach((dark, x) => {
				// Finder patterns (three 7×7 corners) are drawn separately.
				const finder =
					(x < 7 && y < 7) ||
					(x >= size - 7 && y < 7) ||
					(x < 7 && y >= size - 7);
				const inLogo =
					x >= logoMin && x < logoMax && y >= logoMin && y < logoMax;
				if (dark && !finder && !inLogo) {
					dots += `M${x + 0.08} ${y + 0.5}a.42 .42 0 1 0 .84 0a.42 .42 0 1 0-.84 0`;
				}
			});
		});
		return { size, dots, logo, logoStart };
	}, [value]);

	return (
		<svg
			viewBox={`-1 -1 ${size + 2} ${size + 2}`}
			role="img"
			aria-label="QR код"
			className={cn("text-ink", className)}
		>
			<path d={dots} fill="currentColor" />
			{[
				[0, 0],
				[size - 7, 0],
				[0, size - 7],
			].map(([x, y]) => (
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
