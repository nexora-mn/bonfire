import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "../../../-components/page-heading";
import { QrCard } from "./-components/qr-card";

export const Route = createFileRoute("/_authed/studio/_creator/qr/")({
	staticData: { title: "QR код" },
	head: () => ({ meta: [{ title: "QR код · Bonfire" }] }),
	component: Qr,
});

function Qr() {
	const { creator } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-6">
			<PageHeading description="Хэвлээд тайз, лангуу, бүтээл дээрээ байрлуул. Уншуулахад шууд таны хуудас нээгдэнэ." />
			<QrCard creator={creator} />
		</div>
	);
}
