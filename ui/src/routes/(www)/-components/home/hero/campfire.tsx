import { cn } from "cn";

// The brand flame mark's geometry, layered ember → flame → cream.
const FLAME =
	"M16 2c1.2 4.6 6.8 7.6 6.8 14.2A6.8 6.8 0 0 1 16 23a6.8 6.8 0 0 1-6.8-6.8c0-2.6 1.1-4.4 2.5-5.9.3 2 1.3 3.3 2.6 3.9C13.4 10 14.6 5.6 16 2Z";

export function Campfire({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 32 30"
			aria-hidden="true"
			className={cn("overflow-visible", className)}
		>
			<path data-flame d={FLAME} fill="#BC3908" />
			<g transform="translate(16 23) scale(0.74) translate(-16 -23)">
				<path data-flame d={FLAME} className="fill-flame" />
			</g>
			<path
				data-flame
				d="M16 12.5c.7 2.3 3.3 3.6 3.3 6.4A3.3 3.3 0 0 1 16 22.2a3.3 3.3 0 0 1-3.3-3.3c0-2.6 2.6-3.9 3.3-6.4Z"
				className="fill-cream"
			/>
			<path
				d="M5 27.5 27 24M5 24l22 3.5"
				stroke="#621708"
				strokeWidth="2.6"
				strokeLinecap="round"
			/>
		</svg>
	);
}
