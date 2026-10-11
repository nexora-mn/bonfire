import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { fan } from "./client.gen";
import { attempt, getApi } from "./server";

export type FeedPost = fan.FeedPost;
export type ExploreCreator = fan.ExploreCreator;
export type MySupport = fan.MySupport;

export const fetchFeed = createServerFn({ method: "GET" })
	.validator(z.object({ before: z.string().optional() }))
	.handler(async ({ data }) => {
		const api = await getApi();
		return api.fan.Feed({ Before: data.before ?? "" });
	});

export const fetchExplore = createServerFn({ method: "GET" })
	.validator(
		z.object({
			q: z.string().max(100).optional(),
			page: z.number().int().min(0),
		}),
	)
	.handler(async ({ data }) => {
		const api = await getApi();
		return api.fan.Explore({ Q: data.q ?? "", Page: data.page });
	});

export const fetchMySupports = createServerFn({ method: "GET" }).handler(
	async () => {
		const api = await getApi();
		const { supports } = await api.fan.ListMySupports();
		return supports;
	},
);

export const setLike = createServerFn({ method: "POST" })
	.validator(z.object({ postId: z.uuid(), like: z.boolean() }))
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() =>
			data.like ? api.fan.Like(data.postId) : api.fan.Unlike(data.postId),
		);
	});
