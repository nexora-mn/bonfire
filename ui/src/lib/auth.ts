import type { AuthError } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSupabaseServerClient } from "./supabase/server";

export type AuthUser = {
	id: string;
	email: string | undefined;
	/** Display name; set on the profile page or taken from the OAuth provider. */
	name: string | undefined;
	avatarUrl: string | undefined;
	/** Sign-in methods linked to the account, such as "email" or "google". */
	providers: string[];
	createdAt: string;
};

export const fetchUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<AuthUser | null> => {
		const supabase = getSupabaseServerClient();
		// getUser() revalidates the token with Supabase; never trust getSession() on the server.
		const { data } = await supabase.auth.getUser();
		const user = data.user;
		if (!user) return null;
		const meta = user.user_metadata;
		return {
			id: user.id,
			email: user.email,
			name: meta.full_name ?? meta.name ?? undefined,
			avatarUrl: meta.avatar_url ?? meta.picture ?? undefined,
			providers: user.app_metadata.providers ?? [],
			createdAt: user.created_at,
		};
	},
);

const authErrorMessages: Record<string, string> = {
	invalid_credentials: "Имэйл эсвэл нууц үг буруу байна.",
	email_not_confirmed: "Имэйлээ баталгаажуулаагүй байна. Имэйлээ шалгана уу.",
	user_already_exists: "Энэ имэйлээр бүртгэл аль хэдийн үүссэн байна.",
	email_exists: "Энэ имэйлээр бүртгэл аль хэдийн үүссэн байна.",
	weak_password: "Нууц үг хэт сул байна. Илүү урт нууц үг сонгоно уу.",
	same_password: "Шинэ нууц үг хуучнаасаа өөр байх ёстой.",
	reauthentication_needed:
		"Аюулгүй байдлын үүднээс дахин нэвтэрсний дараа нууц үгээ солино уу.",
	over_email_send_rate_limit:
		"Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.",
	over_request_rate_limit:
		"Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.",
};

/** Supabase only returns English messages, so translate by error code. */
function authErrorMessage(error: AuthError) {
	return (
		(error.code && authErrorMessages[error.code]) ??
		"Алдаа гарлаа. Дахин оролдоно уу."
	);
}

const credentialsSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export const signIn = createServerFn({ method: "POST" })
	.validator(credentialsSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.auth.signInWithPassword(data);
		if (error) return { error: authErrorMessage(error) };
		return { error: null };
	});

export const signUp = createServerFn({ method: "POST" })
	.validator(credentialsSchema)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const origin = new URL(getRequest().url).origin;
		const { data: result, error } = await supabase.auth.signUp({
			...data,
			options: { emailRedirectTo: `${origin}/auth/confirm` },
		});
		if (error)
			return { error: authErrorMessage(error), needsConfirmation: false };
		// With email confirmation enabled, no session is returned until the link is clicked.
		return { error: null, needsConfirmation: !result.session };
	});

export const signOut = createServerFn({ method: "POST" })
	.validator(z.object({ everywhere: z.boolean() }).optional())
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		// "global" also revokes sessions on the user's other devices.
		await supabase.auth.signOut({
			scope: data?.everywhere ? "global" : "local",
		});
	});

export const updateProfile = createServerFn({ method: "POST" })
	.validator(z.object({ name: z.string().trim().min(1).max(80) }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.auth.updateUser({
			data: { full_name: data.name },
		});
		if (error) return { error: authErrorMessage(error) };
		return { error: null };
	});

export const updatePassword = createServerFn({ method: "POST" })
	.validator(credentialsSchema.pick({ password: true }))
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.auth.updateUser({
			password: data.password,
		});
		if (error) return { error: authErrorMessage(error) };
		return { error: null };
	});
