import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { type AuthUser, fetchUser } from "../lib/auth";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "../lib/seo";
import { themeScript } from "../lib/theme";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	user: AuthUser | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => ({ user: await fetchUser() }),
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Bonfire: ажлын дараах хоббигоо дэмжүүл",
			},
			{ name: "description", content: DEFAULT_DESCRIPTION },
			{ name: "theme-color", content: "#150f0c" },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:locale", content: "mn_MN" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		// The theme script changes <html>'s class before hydration.
		<html lang="mn" suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static script from our own module */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
