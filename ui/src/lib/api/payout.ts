import { createServerFn } from "@tanstack/react-start";
import { payoutAccountSchema } from "../schemas/payout";
import type { payout } from "./client.gen";
import { attempt, getApi } from "./server";

export type Earnings = payout.Earnings;
export type PayoutAccount = payout.Account;
export type PayoutItem = payout.PayoutItem;

export const fetchEarnings = createServerFn({ method: "GET" }).handler(
	async () => {
		const api = await getApi();
		return api.payout.GetEarnings();
	},
);

export const fetchPayouts = createServerFn({ method: "GET" }).handler(
	async () => {
		const api = await getApi();
		const [{ account }, { payouts }] = await Promise.all([
			api.payout.GetAccount(),
			api.payout.ListPayouts(),
		]);
		return { account, payouts };
	},
);

export const savePayoutAccount = createServerFn({ method: "POST" })
	.validator(payoutAccountSchema)
	.handler(async ({ data }) => {
		const api = await getApi();
		return attempt(() => api.payout.SaveAccount(data));
	});

/** Dev only: fills the page with fake supports (the backend refuses in prod). */
export const seedSupports = createServerFn({ method: "POST" }).handler(
	async () => {
		const api = await getApi();
		return attempt(() => api.payout.SeedSupports());
	},
);
