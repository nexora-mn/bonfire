import { News01Icon } from "@hugeicons/core-free-icons";
import type { PublicProfile } from "@/lib/api/creator";
import { EmptyState } from "../empty-state";
import { PostCard } from "./post-card";

export function PostList({
	posts,
	signedIn,
}: {
	posts: PublicProfile["posts"];
	signedIn: boolean;
}) {
	return (
		<section className="rounded-3xl border bg-card text-card-foreground shadow-sm">
			<h2 className="display-3 p-6 pb-0 sm:px-8 sm:pt-8">{"Нийтлэлүүд"}</h2>
			{posts.length === 0 ? (
				<EmptyState
					icon={News01Icon}
					title="Нийтлэл алга байна"
					text="Шинэ нийтлэл гармагц энд харагдана. Дагаад мэдэгдэл аваарай."
					className="m-6 sm:m-8"
				/>
			) : (
				<div className="mt-2 divide-y">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} signedIn={signedIn} />
					))}
				</div>
			)}
		</section>
	);
}
