import type { EmailOtpType } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/url";

// Callback for Supabase email links and OAuth providers: handles both the
// PKCE `code` flow and the `token_hash` email template flow.
export const Route = createFileRoute("/(auth)/auth/confirm")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const code = url.searchParams.get("code");
				const tokenHash = url.searchParams.get("token_hash");
				const type = url.searchParams.get("type") as EmailOtpType | null;
				const next = safeRedirectPath(url.searchParams.get("next"));

				const { supabase, headers } = createSupabaseRouteClient(request);
				let error: unknown = new Error("Missing confirmation parameters");
				if (code) {
					({ error } = await supabase.auth.exchangeCodeForSession(code));
				} else if (tokenHash && type) {
					({ error } = await supabase.auth.verifyOtp({
						type,
						token_hash: tokenHash,
					}));
				}

				// Providers report failures (e.g. the user cancelled) via `error`.
				const failure = url.searchParams.has("error")
					? "oauth_failed"
					: "confirmation_failed";
				headers.set("Location", error ? `/login?error=${failure}` : next);
				return new Response(null, { status: 302, headers });
			},
		},
	},
});
