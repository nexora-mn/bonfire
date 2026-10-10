/** OAuth providers enabled in the Supabase dashboard, in display order. */
export const oauthProviders = ["google", "discord"] as const;

export type OAuthProvider = (typeof oauthProviders)[number];

export function isOAuthProvider(value: string): value is OAuthProvider {
	return (oauthProviders as readonly string[]).includes(value);
}
