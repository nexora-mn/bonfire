import { DEFAULT_API_URL } from "../constants";
import { getSupabaseServerClient } from "../supabase/server";
import Client, { isAPIError } from "./client.gen";

/**
 * Encore client acting as the signed-in user. Server-only: call it from
 * server functions, which forward the Supabase access token as the bearer.
 */
export async function getApi() {
	const supabase = getSupabaseServerClient();
	const { data } = await supabase.auth.getSession();
	return new Client(process.env.API_URL ?? DEFAULT_API_URL, {
		auth: data.session?.access_token,
	});
}

/** Client for public endpoints; sends no credentials. */
export function getPublicApi() {
	return new Client(process.env.API_URL ?? DEFAULT_API_URL);
}

const apiErrorMessages: Record<string, string> = {
	already_exists: "Энэ хаяг аль хэдийн бүртгэгдсэн байна.",
	invalid_argument: "Оруулсан мэдээллээ шалгана уу.",
	unauthenticated: "Дахин нэвтэрнэ үү.",
	resource_exhausted: "Дээд хязгаарт хүрсэн байна.",
	not_found: "Олдсонгүй.",
	failed_precondition: "Эхлээд бүтээгчийн хуудсаа үүсгэнэ үү.",
};

/**
 * Runs a mutation, returning `{ error }` instead of throwing. The backend
 * speaks English, so the message is picked by error code.
 */
export async function attempt<T>(
	fn: () => Promise<T>,
): Promise<{ data: T; error: null } | { data: null; error: string }> {
	try {
		return { data: await fn(), error: null };
	} catch (err) {
		const error = isAPIError(err)
			? (apiErrorMessages[err.code] ?? "Алдаа гарлаа. Дахин оролдоно уу.")
			: "Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.";
		return { data: null, error };
	}
}

export function isNotFound(err: unknown) {
	return isAPIError(err) && err.code === "not_found";
}
