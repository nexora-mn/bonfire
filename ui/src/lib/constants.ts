// Limits mirror the backend's validation (server/creator, server/payout);
// change both sides together.

// Site

export const SITE_NAME = "Bonfire";
export const SITE_URL = (
	import.meta.env.VITE_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
export const DEFAULT_DESCRIPTION =
	"Ажлын дараах цагаараа бүтээдэг зүйлээ хуваалцаж, дэмжигчдээсээ сар бүр орлого ол.";

/** Fallback Encore API origin when API_URL isn't set (`encore run`). */
export const DEFAULT_API_URL = "http://localhost:4000";

// Sentry. The server rate lives in instrument.server.mjs (plain JS); keep it in sync.

/** Share of page loads and navigations traced; every one in dev. */
export const SENTRY_TRACES_SAMPLE_RATE = import.meta.env.DEV ? 1.0 : 0.2;
/** Share of sessions recorded by Replay; sessions with an error are always kept. */
export const SENTRY_REPLAY_SAMPLE_RATE = 0.1;

/** How long the signed-in user and their creator page stay cached between navigations. */
export const SESSION_STALE_TIME = 5 * 60_000;

/** OAuth providers enabled in the Supabase dashboard, in display order. */
export const OAUTH_PROVIDERS = ["google", "discord"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

// Creator page

export const MAX_DISPLAY_NAME_LENGTH = 80;
export const MAX_ABOUT_LENGTH = 5000;
export const MAX_LINKS = 10;

export const LINK_PLATFORMS = [
	"website",
	"facebook",
	"instagram",
	"x",
	"youtube",
	"tiktok",
	"twitch",
	"discord",
	"github",
	"other",
] as const;

export type LinkPlatform = (typeof LINK_PLATFORMS)[number];

export const PLATFORM_LABELS: Record<LinkPlatform, string> = {
	website: "Вэбсайт",
	facebook: "Facebook",
	instagram: "Instagram",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	twitch: "Twitch",
	discord: "Discord",
	github: "GitHub",
	other: "Бусад",
};

// Money (whole tögrög)

export const MAX_AMOUNT = 10_000_000;
export const MIN_TIER_PRICE = 1000;
export const MIN_SUPPORT_AMOUNT = 100;
export const MAX_TIERS = 10;
export const MAX_PRESETS = 4;
export const MAX_THANKS_LENGTH = 500;
/** Price filled in when a creator adds a new tier. */
export const DEFAULT_TIER_PRICE = 5000;
/** Amount filled in when a creator adds a one-time preset. */
export const DEFAULT_PRESET_AMOUNT = 10000;

// Media

export const MEDIA_KINDS = ["avatar", "cover", "post", "tier"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
];
/** Pixel size of downloaded QR code images. */
export const QR_DOWNLOAD_SIZE = 1024;

// Posts

export const POST_VISIBILITY_LABELS = {
	public: "Бүх хүнд",
	members: "Зөвхөн гишүүдэд",
} as const;

// Payouts

/** Bank codes mirror server/payout/bank.go. */
export const BANK_LABELS = {
	khan: "Хаан банк",
	golomt: "Голомт банк",
	tdb: "Худалдаа хөгжлийн банк",
	xac: "Хас банк",
	state: "Төрийн банк",
	capitron: "Капитрон банк",
	bogd: "Богд банк",
	arig: "Ариг банк",
	transbank: "Тээвэр хөгжлийн банк",
	nibank: "Үндэсний хөрөнгө оруулалтын банк",
	mbank: "М банк",
} as const;

export type BankCode = keyof typeof BANK_LABELS;
export const BANK_CODES = Object.keys(BANK_LABELS) as [BankCode, ...BankCode[]];

export const PAYOUT_STATUS_LABELS: Record<string, string> = {
	pending: "Хүлээгдэж буй",
	processing: "Шилжүүлж байна",
	paid: "Шилжүүлсэн",
	failed: "Амжилтгүй",
};

// UI feedback

/** How long a "copied" checkmark stays before reverting. */
export const COPIED_RESET_MS = 2000;

// Landing page motion

/** gsap.matchMedia query that gates every landing animation. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Seconds for one marquee row to loop at rest. */
export const MARQUEE_LOOP_SECONDS = 28;
/** Caps how much scroll velocity can speed the marquee up. */
export const MARQUEE_MAX_BOOST = 5;
/** Layouts that pin and scrub only kick in at this width. */
export const DESKTOP_QUERY = "(min-width: 1024px)";
/** Upper bound of the earnings calculator's supporter slider. */
export const EARNINGS_MAX_SUPPORTERS = 500;
/** Dots in the earnings supporter crowd; each stands for MAX / SIZE people. */
export const EARNINGS_CROWD_SIZE = 50;
/** Seconds ScrollSmoother takes to catch up to the native scroll position. */
export const SMOOTH_SCROLL_SECONDS = 1.1;
