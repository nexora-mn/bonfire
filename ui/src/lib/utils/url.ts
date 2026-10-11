import { SITE_URL } from "../constants";

export const siteHost = new URL(SITE_URL).host;

export const absoluteUrl = (path: string) =>
	new URL(path, `${SITE_URL}/`).toString();

export const creatorUrl = (slug: string) => `${SITE_URL}/${slug}`;

/** Permanent QR target; keeps working when the slug changes. */
export const qrUrl = (code: string) => `${SITE_URL}/c/${code}`;

/** Only same-origin relative paths; "//host" would leave the site. */
export function safeRedirectPath(
	path: string | null | undefined,
	fallback = "/home",
) {
	return path?.startsWith("/") && !path.startsWith("//") ? path : fallback;
}
