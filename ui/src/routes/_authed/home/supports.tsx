import { createFileRoute, Link } from "@tanstack/react-router";
import { InitialAvatar } from "@/components/initial-avatar";
import { Badge } from "@/components/ui/badge";
import { fetchMySupports } from "@/lib/api/fan";
import { formatDate } from "@/lib/utils/date";
import { formatMNT } from "@/lib/utils/money";
import { ListSkeleton } from "../-components/list-skeleton";

export const Route = createFileRoute("/_authed/home/supports")({
	loader: () => fetchMySupports(),
	staticData: { title: "Миний дэмжлэг" },
	head: () => ({ meta: [{ title: "Миний дэмжлэг · Bonfire" }] }),
	pendingComponent: () => <ListSkeleton heading={false} />,
	component: Supports,
});

function Supports() {
	const supports = Route.useLoaderData();
	const total = supports
		.filter((s) => s.status === "succeeded")
		.reduce((sum, s) => sum + s.amount, 0);

	return (
		<div className="flex flex-col gap-3">
			<div className="rounded-3xl bg-card p-5 shadow-sm">
				<p className="text-sm text-muted-foreground">{"Нийт дэмжсэн дүн"}</p>
				<p className="text-3xl font-extrabold tabular-nums">
					{formatMNT(total)}
				</p>
			</div>
			{supports.length === 0 ? (
				<p className="py-12 text-center text-muted-foreground">
					{"Одоогоор дэмжлэг өгөөгүй байна. Төлбөр удахгүй нээгдэнэ."}
				</p>
			) : (
				<ul className="flex flex-col gap-3">
					{supports.map((s) => (
						<li
							key={s.id}
							className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-sm"
						>
							<Link to="/$slug" params={{ slug: s.creator.slug }}>
								<InitialAvatar
									src={s.creator.avatarUrl}
									name={s.creator.displayName}
									className="size-11"
								/>
							</Link>
							<div className="min-w-0 flex-1 text-sm">
								<Link
									to="/$slug"
									params={{ slug: s.creator.slug }}
									className="font-bold hover:underline"
								>
									{s.creator.displayName}
								</Link>
								<p className="truncate text-muted-foreground">
									{s.kind === "membership"
										? (s.tierName ?? "Гишүүнчлэл")
										: "Нэг удаагийн дэмжлэг"}
									{` · ${formatDate(s.createdAt)}`}
								</p>
							</div>
							{s.status !== "succeeded" && (
								<Badge variant="secondary">{s.status}</Badge>
							)}
							<span className="font-bold tabular-nums">
								{formatMNT(s.amount)}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
