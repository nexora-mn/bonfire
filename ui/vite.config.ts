import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Vite doesn't put .env into process.env, and the Sentry plugin needs it.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools(),
      // Tracing keeps Sentry external, so the app shares the instance that
      // instrument.server.mjs set up via `node --import`, and copies it into
      // .output so the server runs without the repo's node_modules.
      nitro(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      // Must be last. Uploads source maps on `vite build` when a token is set.
      sentryTanstackStart({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        sourcemaps: { disable: !env.SENTRY_AUTH_TOKEN },
        telemetry: false,
      }),
    ],
  };
});
