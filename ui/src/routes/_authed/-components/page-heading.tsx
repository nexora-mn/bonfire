/** The title itself is in the sticky header (`staticData.title`). */
export function PageHeading({
	description,
	children,
}: {
	description: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<p className="text-muted-foreground">{description}</p>
			{children}
		</div>
	);
}
