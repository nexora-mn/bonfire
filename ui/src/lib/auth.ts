import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { AuthError } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseServerClient } from "./supabase/server";

export type AuthUser = { id: string; email: string | undefined };

export const fetchUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthUser | null> => {
    const supabase = getSupabaseServerClient();
    // getUser() revalidates the token with Supabase; never trust getSession() on the server.
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return { id: data.user.id, email: data.user.email };
  },
);

const authErrorMessages: Record<string, string> = {
  invalid_credentials: "Имэйл эсвэл нууц үг буруу байна.",
  email_not_confirmed: "Имэйлээ баталгаажуулаагүй байна. Имэйлээ шалгана уу.",
  user_already_exists: "Энэ имэйлээр бүртгэл аль хэдийн үүссэн байна.",
  email_exists: "Энэ имэйлээр бүртгэл аль хэдийн үүссэн байна.",
  weak_password: "Нууц үг хэт сул байна. Илүү урт нууц үг сонгоно уу.",
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

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
});
