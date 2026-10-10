export function FlameMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
			<path
				d="M16 2c1.2 4.6 6.8 7.6 6.8 14.2A6.8 6.8 0 0 1 16 23a6.8 6.8 0 0 1-6.8-6.8c0-2.6 1.1-4.4 2.5-5.9.3 2 1.3 3.3 2.6 3.9C13.4 10 14.6 5.6 16 2Z"
				className="fill-flame"
			/>
			<path
				d="M16 13.5c.6 2 2.9 3.2 2.9 5.6A2.9 2.9 0 0 1 16 22a2.9 2.9 0 0 1-2.9-2.9c0-2.2 2.3-3.4 2.9-5.6Z"
				className="fill-cream"
			/>
			<path
				d="M5 27.5 27 24M5 24l22 3.5"
				className="stroke-current"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}
