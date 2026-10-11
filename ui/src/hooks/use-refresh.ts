import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

/**
 * Reloads route data after a mutation. The cached user and creator page
 * (see `userQuery`, `myCreatorQuery`) are marked stale first, so the
 * `beforeLoad`s that read them fetch fresh copies.
 */
export function useRefresh() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return async () => {
		await queryClient.invalidateQueries();
		await router.invalidate();
	};
}
