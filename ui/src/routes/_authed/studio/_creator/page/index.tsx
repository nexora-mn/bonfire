import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRefresh } from "@/hooks/use-refresh";
import { updateCreatorProfile } from "@/lib/api/creator";
import type { LinkPlatform } from "@/lib/constants";
import { PageHeading } from "../../../-components/page-heading";
import { CreatorProfileForm } from "../../-components/creator-form";
import { MediaCard } from "./-components/media-card";

export const Route = createFileRoute("/_authed/studio/_creator/page/")({
	staticData: { title: "Миний хуудас" },
	head: () => ({ meta: [{ title: "Миний хуудас · Bonfire" }] }),
	component: CreatorPage,
});

function CreatorPage() {
	const { creator } = Route.useRouteContext();
	const refresh = useRefresh();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Дэмжигчдийн харах хуудсаа тохируулах." />
			<MediaCard creator={creator} />
			<Card>
				<CardHeader>
					<CardTitle>{"Танилцуулга"}</CardTitle>
					<CardDescription>
						{"Хаяг, нэр, тайлбар болон сошиал холбоосууд."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CreatorProfileForm
						// Remount after saving so the form picks up normalized values.
						key={creator.slug}
						defaultValues={{
							slug: creator.slug,
							displayName: creator.displayName,
							about: creator.about,
							links: creator.links.map((l) => ({
								platform: l.platform as LinkPlatform,
								url: l.url,
							})),
						}}
						submitLabel="Хадгалах"
						savedMessage="Хуудас шинэчлэгдлээ."
						action={async (values) => {
							const result = await updateCreatorProfile({ data: values });
							if (!result.error) await refresh();
							return result.error;
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
