import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { signOut } from "@/lib/auth";

export function useSignOut() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return async ({ everywhere = false } = {}) => {
		await signOut({ data: { everywhere } });
		queryClient.removeQueries();
		// Navigate rather than invalidate: invalidating re-runs the `_authed`
		// guard in place, which bounces to /login before our navigation.
		await router.navigate({ to: "/login", replace: true });
	};
}
