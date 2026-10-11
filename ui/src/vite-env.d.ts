/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_SUPABASE_KEY: string;
	readonly VITE_SANITY_PROJECT_ID: string;
	readonly VITE_SANITY_DATASET: string;
	readonly VITE_SITE_URL?: string;
	readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
