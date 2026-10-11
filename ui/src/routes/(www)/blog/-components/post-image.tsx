import { cn } from "cn";
import { FlameMark } from "@/components/flame-mark";
import { urlFor } from "@/lib/sanity";
import type { SanityImage } from "./posts";

const widths = [480, 768, 1080, 1440, 2048];

const fallbackTints = ["bg-flame", "bg-amber", "bg-coral", "bg-spark"];

/**
 * Cropped to `aspect` (width / height) around the hotspot. Without an image
 * it shows a tinted tile; `seed` (the slug) keeps a post's tint stable.
 */
export function PostImage({
	image,
	aspect,
	sizes,
	priority = false,
	seed = "",
	className,
}: {
	image: SanityImage | null;
	aspect: number;
	sizes: string;
	/** Load eagerly; for images visible on first paint. */
	priority?: boolean;
	seed?: string;
	className?: string;
}) {
	if (!image?.asset) {
		let hash = 0;
		for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
		return (
			<div
				aria-hidden="true"
				style={{ aspectRatio: aspect }}
				className={cn(
					"grid place-items-center",
					fallbackTints[Math.abs(hash) % fallbackTints.length],
					className,
				)}
			>
				{/* Ink the flame so it shows on every tint, flame included. */}
				<FlameMark className="w-1/5 text-ink [&>path:first-child]:fill-ink" />
			</div>
		);
	}

	const src = (width: number) =>
		urlFor(image)
			.width(width)
			.height(Math.round(width / aspect))
			.url();

	return (
		<img
			src={src(1080)}
			srcSet={widths.map((width) => `${src(width)} ${width}w`).join(", ")}
			sizes={sizes}
			alt={image.alt ?? ""}
			width={1080}
			height={Math.round(1080 / aspect)}
			loading={priority ? "eager" : "lazy"}
			decoding="async"
			style={{
				aspectRatio: aspect,
				backgroundImage: image.lqip ? `url(${image.lqip})` : undefined,
			}}
			className={cn("bg-cover bg-center object-cover", className)}
		/>
	);
}
