import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPosts, type Post } from "@/lib/api/creator";
import { ListSkeleton } from "../../../-components/list-skeleton";
import { PageHeading } from "../../../-components/page-heading";
import { PostCard } from "./-components/post-card";
import { PostDialog } from "./-components/post-dialog";

export const Route = createFileRoute("/_authed/studio/_creator/posts/")({
	staticData: { title: "Нийтлэл" },
	head: () => ({ meta: [{ title: "Нийтлэл · Bonfire" }] }),
	// `?new=true` (the rail's "write a post" button) opens the editor.
	validateSearch: z.object({ new: z.boolean().optional() }),
	loader: () => fetchPosts(),
	pendingComponent: ListSkeleton,
	component: Posts,
});

function Posts() {
	const posts = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	// undefined: closed; null: writing a new post; a post: editing it.
	const [editing, setEditing] = useState<Post | null | undefined>();
	const open = search.new ? null : editing;

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Ажлынхаа явц, шинэ бүтээлээ дэмжигчидтэйгээ хуваалцаарай.">
				<Button onClick={() => setEditing(null)}>
					<HugeiconsIcon icon={Add01Icon} />
					{"Шинэ нийтлэл"}
				</Button>
			</PageHeading>
			{posts.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						{"Одоогоор нийтлэл алга. Анхны нийтлэлээ бичээрэй!"}
					</CardContent>
				</Card>
			) : (
				<div className="flex flex-col gap-4">
					{posts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							onEdit={() => setEditing(post)}
						/>
					))}
				</div>
			)}
			{open !== undefined && (
				<PostDialog
					post={open}
					onClose={() => {
						setEditing(undefined);
						if (search.new) navigate({ search: {} });
					}}
				/>
			)}
		</div>
	);
}
