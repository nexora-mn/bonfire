import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Photo when there is one, otherwise the name's first letter on flame. */
export function InitialAvatar({
	src,
	name,
	className,
	fallbackClassName,
}: {
	src?: string | null;
	name: string;
	className?: string;
	fallbackClassName?: string;
}) {
	return (
		<Avatar className={className}>
			{src && <AvatarImage src={src} alt="" />}
			<AvatarFallback
				className={cn(
					"bg-flame font-semibold text-ink uppercase",
					fallbackClassName,
				)}
			>
				{name.charAt(0)}
			</AvatarFallback>
		</Avatar>
	);
}
