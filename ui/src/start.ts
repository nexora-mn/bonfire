import {
	sentryGlobalFunctionMiddleware,
	sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import { createStart } from "@tanstack/react-start";

// Sentry's middleware must stay first in each list.
export const startInstance = createStart(() => ({
	requestMiddleware: [sentryGlobalRequestMiddleware],
	functionMiddleware: [sentryGlobalFunctionMiddleware],
}));
