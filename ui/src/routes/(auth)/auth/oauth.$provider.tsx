import { createFileRoute } from "@tanstack/react-router";
import { OAUTH_PROVIDERS, type OAuthProvider } from "@/lib/constants";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/url";

// Starts an OAuth (PKCE) sign-in, e.g. /auth/oauth/google. Supabase stores the
// code verifier in a cookie, so the redirect must carry the Set-Cookie headers.
export const Route = createFileRoute("/(auth)/auth/oauth/$provider")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const failed = new Response(null, {
					status: 303,
					headers: { Location: "/login?error=oauth_failed" },
				});
				const provider = params.provider as OAuthProvider;
				if (!OAUTH_PROVIDERS.includes(provider)) return failed;

				const url = new URL(request.url);
				const next = safeRedirectPath(url.searchParams.get("redirect"));
				const callback = new URL("/auth/confirm", url.origin);
				callback.searchParams.set("next", next);

				const { supabase, headers } = createSupabaseRouteClient(request);
				const { data, error } = await supabase.auth.signInWithOAuth({
					provider,
					options: {
						redirectTo: callback.toString(),
						// Let people with several Google accounts pick one.
						queryParams:
							provider === "google" ? { prompt: "select_account" } : undefined,
					},
				});
				if (error || !data.url) return failed;

				headers.set("Location", data.url);
				return new Response(null, { status: 303, headers });
			},
		},
	},
});
