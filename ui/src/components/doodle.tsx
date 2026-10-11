/**
 * Open Doodles by Pablo Stanley (CC0, https://opendoodles.com), recolored to
 * the theme's reds and optimized into /public/doodles.
 */
export type DoodleName =
	| "ballet"
	| "chilling"
	| "clumsy"
	| "coffee"
	| "dancing"
	| "doggie"
	| "float"
	| "groovy"
	| "jumping"
	| "laying"
	| "levitate"
	| "loving"
	| "meditating"
	| "moshing"
	| "plant"
	| "reading-side"
	| "roller-skating"
	| "rolling"
	| "selfie"
	| "sitting-reading"
	| "unboxing";

export function Doodle({
	name,
	className,
	priority = false,
}: {
	name: DoodleName;
	className?: string;
	/** Load immediately; use for doodles visible on first paint. */
	priority?: boolean;
}) {
	return (
		<img
			src={`/doodles/${name}.svg`}
			alt=""
			width={1024}
			height={768}
			loading={priority ? "eager" : "lazy"}
			decoding="async"
			draggable={false}
			className={className}
		/>
	);
}
