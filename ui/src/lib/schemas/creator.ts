import { z } from "zod";
import {
	LINK_PLATFORMS,
	MAX_ABOUT_LENGTH,
	MAX_AMOUNT,
	MAX_DISPLAY_NAME_LENGTH,
	MAX_LINKS,
	MAX_PRESETS,
	MAX_THANKS_LENGTH,
	MIN_SUPPORT_AMOUNT,
	MIN_TIER_PRICE,
} from "../constants";
import { formatMNT } from "../utils/money";

// Mirrors server/creator/validate.go; the backend re-checks everything.

export const slugSchema = z
	.string()
	.trim()
	.toLowerCase()
	.regex(
		/^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$/,
		"3–32 тэмдэгт: латин жижиг үсэг, тоо, - эсвэл _.",
	);

export const linkSchema = z.object({
	platform: z.enum(LINK_PLATFORMS),
	url: z
		.url({ protocol: /^https?$/, error: "Зөв холбоос оруулна уу (https://…)." })
		.max(500),
});

export const creatorProfileSchema = z.object({
	slug: slugSchema,
	displayName: z
		.string()
		.trim()
		.min(1, "Нэрээ оруулна уу.")
		.max(MAX_DISPLAY_NAME_LENGTH, "Нэр хэт урт байна."),
	about: z.string().trim().max(MAX_ABOUT_LENGTH, "Хэт урт байна."),
	links: z
		.array(linkSchema)
		.max(MAX_LINKS, `Хамгийн ихдээ ${MAX_LINKS} холбоос.`),
});

export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;

const amount = (min: number) =>
	z.coerce
		.number<string | number>("Дүн оруулна уу.")
		.int("Бүхэл тоо оруулна уу.")
		.min(min, `Хамгийн багадаа ${formatMNT(min)}.`)
		.max(MAX_AMOUNT, "Хэт их дүн байна.");

export const oneTimeSchema = z
	.object({
		enabled: z.boolean(),
		min: amount(MIN_SUPPORT_AMOUNT),
		presets: z
			.array(z.object({ value: amount(MIN_SUPPORT_AMOUNT) }))
			.max(MAX_PRESETS, `Хамгийн ихдээ ${MAX_PRESETS} дүн.`),
		thanks: z.string().trim().max(MAX_THANKS_LENGTH, "Хэт урт байна."),
	})
	.refine((v) => v.presets.every((p) => p.value >= v.min), {
		message: "Санал болгох дүн доод дүнгээс бага байж болохгүй.",
		path: ["presets"],
	});

export const tierSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Нэр оруулна уу.")
		.max(60, "Нэр хэт урт байна."),
	description: z.string().trim().max(1000, "Хэт урт байна."),
	monthlyPrice: amount(MIN_TIER_PRICE),
	position: z.coerce.number<string | number>().int().min(0),
	isActive: z.boolean(),
	imageKey: z.string().nullable(),
});

export const postSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Гарчиг оруулна уу.")
		.max(200, "Гарчиг хэт урт байна."),
	body: z.string().trim().max(20000, "Хэт урт байна."),
	imageKey: z.string().nullable(),
	visibility: z.enum(["public", "members"]),
});
