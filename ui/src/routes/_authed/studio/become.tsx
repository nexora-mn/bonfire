import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRefresh } from "@/hooks/use-refresh";
import { becomeCreator } from "@/lib/api/creator";
import { displayName } from "@/lib/utils/user";
import { CreatorProfileForm } from "./-components/creator-form";

export const Route = createFileRoute("/_authed/studio/become")({
	beforeLoad: ({ context }) => {
		if (context.creator) throw redirect({ to: "/studio/page" });
	},
	staticData: { title: "Бүтээгч болох" },
	head: () => ({ meta: [{ title: "Бүтээгч болох · Bonfire" }] }),
	component: BecomeCreator,
});

function BecomeCreator() {
	const { user } = Route.useRouteContext();
	const router = useRouter();
	const refresh = useRefresh();
	// Suggest a URL from the email, e.g. "bat.erdene@…" → "baterdene".
	const slug = (user.email?.split("@")[0] ?? "")
		.toLowerCase()
		.replace(/[^a-z0-9_-]/g, "")
		.slice(0, 32);

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle className="text-2xl">{"Бүтээгчийн хуудсаа нээх"}</CardTitle>
				<CardDescription>
					{
						"Хаягаа сонгоод өөрийгөө танилцуулаарай. Зураг, гишүүнчлэлийн түвшинг дараагийн алхамд нэмнэ."
					}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<CreatorProfileForm
					defaultValues={{
						slug: slug.length >= 3 ? slug : "",
						displayName: displayName(user),
						about: "",
						links: [],
					}}
					submitLabel="Хуудсаа нээх"
					savedMessage="Хуудас нээгдлээ."
					action={async (values) => {
						const result = await becomeCreator({ data: values });
						if (result.error) return result.error;
						await refresh();
						await router.navigate({ to: "/studio/page" });
						return null;
					}}
				/>
			</CardContent>
		</Card>
	);
}
