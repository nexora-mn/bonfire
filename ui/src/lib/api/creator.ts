import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	IMAGE_TYPES,
	MAX_IMAGE_BYTES,
	MEDIA_KINDS,
	type MediaKind,
	SESSION_STALE_TIME,
} from "../constants";
import {
	creatorProfileSchema,
	postSchema,
	slugSchema,
	tierSchema,
} from "../schemas/creator";
import type { creator } from "./client.gen";
import { attempt, getApi, getPublicApi, isNotFound } from "./server";

export type Creator = creator.Creator;
export type Tier = creator.Tier;
export type Post = creator.Post;
export type PublicProfile = creator.PublicProfile;

/** Null until the user makes a creator page. */
export const fetchMyCreator = createServerFn({ method: "GET" }).handler(
	async (): Promise<Creator | null> => {
		const api = await getApi();
		const { creator } = await api.creator.GetMine();
		return creator;
	},
);

export const myCreatorQuery = queryOptions({
	queryKey: ["my-creator"],
	queryFn: () => fetchMyCreator(),
	staleTime: SESSION_STALE_TIME,
});

export const becomeCreator = createServerFn({ method: "POST" })
	.validator(creatorProfileSchema)
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.creator.Become(data));
	});

export const updateCreatorProfile = createServerFn({ method: "POST" })
	.validator(creatorProfileSchema)
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.creator.UpdateProfile(data));
	});

export const checkSlug = createServerFn({ method: "GET" })
	.validator(z.object({ slug: slugSchema }))
	.handler(async ({ data }) => {
		const api = await getApi();
		const { available } = await api.creator.SlugAvailable(data.slug);
		return available;
	});

export const updateOneTime = createServerFn({ method: "POST" })
	.validator(
		z.object({
			enabled: z.boolean(),
			min: z.number().int(),
			presets: z.array(z.number().int()).max(4),
			thanks: z.string().max(500),
		}),
	)
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.creator.UpdateOneTime(data));
	});

/** Uploads an image; the browser posts a FormData with `kind` and `file`. */
export const uploadMedia = createServerFn({ method: "POST" })
	.validator((data: FormData) => {
		const kind = data.get("kind");
		const file = data.get("file");
		if (!MEDIA_KINDS.includes(kind as MediaKind)) throw new Error("bad kind");
		if (!(file instanceof File)) throw new Error("missing file");
		return { kind: kind as MediaKind, file };
	})
	.handler(async ({ data }) => {
		if (!IMAGE_TYPES.includes(data.file.type)) {
			return {
				data: null,
				error: "JPEG, PNG, WebP эсвэл GIF зураг сонгоно уу.",
			};
		}
		if (data.file.size > MAX_IMAGE_BYTES) {
			return { data: null, error: "Зураг 5 MB-аас ихгүй байх ёстой." };
		}
		const api = await getApi();
		return attempt(async () => {
			const resp = await api.creator.UploadMedia("POST", data.kind, data.file, {
				headers: { "Content-Type": data.file.type },
			});
			return (await resp.json()) as { key: string; url: string };
		});
	});

export const removeMedia = createServerFn({ method: "POST" })
	.validator(z.object({ kind: z.enum(["avatar", "cover"]) }))
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.creator.RemoveMedia(data.kind));
	});

export const fetchTiers = createServerFn({ method: "GET" }).handler(
	async () => {
		const api = await getApi();
		const { tiers } = await api.creator.ListTiers();
		return tiers;
	},
);

export const saveTier = createServerFn({ method: "POST" })
	.validator(tierSchema.extend({ id: z.uuid().optional() }))
	.handler(async ({ data: { id, imageKey, ...rest } }) => {
		const api = await getApi();
		// Encore types the Go *string as string, but null is valid on the wire.
		const tier = { ...rest, imageKey: imageKey as string };
		return attempt(() =>
			id ? api.creator.UpdateTier(id, tier) : api.creator.CreateTier(tier),
		);
	});

export const deleteTier = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.creator.DeleteTier(data.id));
	});

export const fetchPosts = createServerFn({ method: "GET" }).handler(
	async () => {
		const api = await getApi();
		const { posts } = await api.creator.ListPosts();
		return posts;
	},
);

export const savePost = createServerFn({ method: "POST" })
	.validator(postSchema.extend({ id: z.uuid().optional() }))
	.handler(async ({ data: { id, imageKey, ...rest } }) => {
		const api = await getApi();
		// Encore types the Go *string as string, but null is valid on the wire.
		const post = { ...rest, imageKey: imageKey as string };
		return attempt(() =>
			id ? api.creator.UpdatePost(id, post) : api.creator.CreatePost(post),
		);
	});

export const deletePost = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.creator.DeletePost(data.id));
	});

/**
 * A creator's public page, or null for an unknown slug. Sent with the
 * viewer's token when signed in, so like state comes back too.
 */
export const fetchPublicCreator = createServerFn({ method: "GET" })
	.validator(z.object({ slug: z.string() }))
	.handler(async ({ data }): Promise<PublicProfile | null> => {
		try {
			const api = await getApi();
			return await api.creator.GetPublic(data.slug);
		} catch (err) {
			if (isNotFound(err)) return null;
			throw err;
		}
	});

/** Maps a QR code's permanent code to the creator's current slug, or null. */
export const resolveCode = createServerFn({ method: "GET" })
	.validator(z.object({ code: z.string() }))
	.handler(async ({ data }) => {
		try {
			const { slug } = await getPublicApi().creator.ResolveCode(data.code);
			return slug;
		} catch (err) {
			if (isNotFound(err)) return null;
			throw err;
		}
	});
