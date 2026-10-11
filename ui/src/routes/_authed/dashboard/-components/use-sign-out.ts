import { useRouter } from "@tanstack/react-router";
import { signOut } from "@/lib/auth";

/** Signs out and lands on the login page. */
export function useSignOut() {
	const router = useRouter();

	return async ({ everywhere = false } = {}) => {
		await signOut({ data: { everywhere } });
		// Navigate rather than invalidate: invalidating re-runs the `_authed`
		// guard in place, which bounces to /login before any navigation we do.
		// The root `beforeLoad` refetches the (now empty) user on this navigation.
		await router.navigate({ to: "/login", replace: true });
	};
}
