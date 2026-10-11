export function CreatorCover({ src }: { src: string }) {
	return (
		<div className="grain relative isolate h-44 overflow-hidden bg-linear-to-br from-flame via-primary/80 to-ink sm:h-64 lg:h-80">
			{src && (
				<img
					src={src}
					alt=""
					fetchPriority="high"
					className="absolute inset-0 -z-10 size-full object-cover"
				/>
			)}
		</div>
	);
}
