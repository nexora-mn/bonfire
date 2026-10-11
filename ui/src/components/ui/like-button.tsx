import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "cn";
import { useState } from "react";
import { setLike } from "@/lib/api/fan";

const base =
	"inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium tabular-nums transition-colors";

/** Optimistic; rolls back if the request fails. */
export function LikeButton({
	postId,
	liked: initialLiked,
	count: initialCount,
	signedIn,
}: {
	postId: string;
	liked: boolean;
	count: number;
	signedIn: boolean;
}) {
	const [liked, setLiked] = useState(initialLiked);
	const [count, setCount] = useState(initialCount);
	const href = useRouterState({ select: (s) => s.location.href });

	if (!signedIn) {
		return (
			<Link
				to="/login"
				search={{ redirect: href }}
				aria-label="Нэвтэрч таалагдсан гэж тэмдэглэх"
				className={cn(base, "text-muted-foreground hover:bg-muted")}
			>
				<HugeiconsIcon icon={FavouriteIcon} className="size-4" />
				{count}
			</Link>
		);
	}

	return (
		<button
			type="button"
			aria-pressed={liked}
			aria-label={liked ? "Таалагдсанаа болих" : "Таалагдлаа"}
			onClick={async () => {
				const next = !liked;
				setLiked(next);
				setCount((c) => c + (next ? 1 : -1));
				const result = await setLike({ data: { postId, like: next } });
				if (result.data) {
					setLiked(result.data.liked);
					setCount(result.data.likeCount);
				} else {
					setLiked(!next);
					setCount((c) => c + (next ? -1 : 1));
				}
			}}
			className={cn(
				base,
				liked
					? "bg-red-500/10 text-red-600 dark:text-red-400"
					: "text-muted-foreground hover:bg-muted",
			)}
		>
			<HugeiconsIcon
				icon={FavouriteIcon}
				className={cn("size-4", liked && "fill-current")}
			/>
			{count}
		</button>
	);
}
