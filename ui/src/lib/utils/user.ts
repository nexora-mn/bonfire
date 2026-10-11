import type { AuthUser } from "../auth";

export const displayName = (user: AuthUser) =>
	user.name ?? user.email?.split("@")[0] ?? "Хэрэглэгч";
