// Loaded with `node --import` before the app, so Sentry can instrument Node
// APIs. Vite hasn't loaded .env yet at this point, so read it here (it's
// absent in production, where the host sets the variables).
import * as Sentry from "@sentry/tanstackstart-react";

try {
	process.loadEnvFile(".env");
} catch {}

const production = process.env.NODE_ENV === "production";

Sentry.init({
	dsn: process.env.VITE_SENTRY_DSN,
	environment: production ? "production" : "development",
	tracesSampleRate: production ? 0.2 : 1.0,
});
