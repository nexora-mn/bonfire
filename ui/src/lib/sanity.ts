import { createClient } from "@sanity/client";
import {
	createImageUrlBuilder,
	type SanityImageSource,
} from "@sanity/image-url";

export const sanity = createClient({
	projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
	dataset: import.meta.env.VITE_SANITY_DATASET,
	apiVersion: "2026-10-01",
	useCdn: true,
	perspective: "published",
});

const builder = createImageUrlBuilder(sanity);

export function urlFor(source: SanityImageSource) {
	return builder.image(source).auto("format");
}

/** A 1200×630 JPEG for Open Graph and Twitter cards. */
export function shareImageUrl(source: SanityImageSource) {
	return builder
		.image(source)
		.width(1200)
		.height(630)
		.fit("crop")
		.format("jpg")
		.url();
}
