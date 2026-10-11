import * as Sentry from "@sentry/tanstackstart-react";
import {
	SENTRY_REPLAY_SAMPLE_RATE,
	SENTRY_TRACES_SAMPLE_RATE,
} from "./lib/constants";

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.MODE,
	tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
	replaysSessionSampleRate: SENTRY_REPLAY_SAMPLE_RATE,
	replaysOnErrorSampleRate: 1.0,
});

// Replay is large, so it loads from Sentry's CDN after startup instead of
// sitting in the main bundle.
Sentry.lazyLoadIntegration("replayIntegration")
	.then((replay) => Sentry.addIntegration(replay()))
	.catch(() => {});
