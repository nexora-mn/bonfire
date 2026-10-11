import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AuthUser } from "@/lib/auth";

/** Name to show for a user, falling back to the part of the email before "@". */
export function displayName(user: AuthUser) {
	return user.name ?? user.email?.split("@")[0] ?? "Хэрэглэгч";
}

/** Provider photo when there is one, otherwise the first letter of the name. */
export function UserAvatar({
	user,
	className,
}: {
	user: AuthUser;
	className?: string;
}) {
	return (
		<Avatar className={className}>
			{user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
			<AvatarFallback className="bg-flame font-semibold text-ink uppercase">
				{displayName(user).charAt(0)}
			</AvatarFallback>
		</Avatar>
	);
}
