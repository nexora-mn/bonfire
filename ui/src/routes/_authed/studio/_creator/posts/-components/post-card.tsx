import { SquareLock02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { deletePost, type Post } from "@/lib/api/creator";
import { formatDate } from "@/lib/utils/date";
import { DeleteActions } from "../../-components/delete-actions";

export function PostCard({ post, onEdit }: { post: Post; onEdit: () => void }) {
	return (
		<Card className="overflow-hidden">
			{post.imageUrl && (
				<img
					src={post.imageUrl}
					alt=""
					loading="lazy"
					className="-mt-6 aspect-[2/1] w-full object-cover"
				/>
			)}
			<CardHeader>
				<CardTitle>{post.title}</CardTitle>
				<CardDescription>{formatDate(post.createdAt)}</CardDescription>
				{post.visibility === "members" && (
					<CardAction>
						<Badge variant="secondary">
							<HugeiconsIcon icon={SquareLock02Icon} />
							{"Гишүүдэд"}
						</Badge>
					</CardAction>
				)}
			</CardHeader>
			{post.body && (
				<CardContent>
					<p className="line-clamp-4 text-sm whitespace-pre-line text-muted-foreground">
						{post.body}
					</p>
				</CardContent>
			)}
			<CardFooter className="justify-end gap-2">
				<DeleteActions
					prompt="Нийтлэлийг устгах уу?"
					onEdit={onEdit}
					onDelete={() => deletePost({ data: { id: post.id } })}
				/>
			</CardFooter>
		</Card>
	);
}
