import {
	createServerClient,
	parseCookieHeader,
	serializeCookieHeader,
} from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

export function getSupabaseServerClient() {
	return createServerClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			cookies: {
				getAll() {
					return Object.entries(getCookies()).map(([name, value]) => ({
						name,
						value,
					}));
				},
				setAll(cookies) {
					for (const { name, value, options } of cookies) {
						setCookie(name, value, options);
					}
				},
			},
		},
	);
}

/**
 * Client for server route handlers that build their own `Response`.
 * Auth cookies (session, PKCE verifier) are collected into `headers`,
 * which must be sent on the returned response.
 */
export function createSupabaseRouteClient(request: Request) {
	const headers = new Headers();
	const supabase = createServerClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "").map(
						({ name, value }) => ({ name, value: value ?? "" }),
					);
				},
				setAll(cookies, cacheHeaders) {
					for (const { name, value, options } of cookies) {
						headers.append(
							"Set-Cookie",
							serializeCookieHeader(name, value, options),
						);
					}
					for (const [key, value] of Object.entries(cacheHeaders)) {
						headers.set(key, value);
					}
				},
			},
		},
	);
	return { supabase, headers };
}
