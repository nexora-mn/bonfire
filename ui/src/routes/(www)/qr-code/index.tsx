import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CallToAction } from "../-components/cta";
import { Faq } from "../-components/faq";
import { qrFaqs } from "./-components/faqs";
import { QrHero } from "./-components/hero";
import { QrHowSupport } from "./-components/how-support";
import { QrSetup } from "./-components/setup";

export const Route = createFileRoute("/(www)/qr-code/")({
	head: () =>
		seo({
			title: "QR код",
			description:
				"Өөрийн QR кодоор ямар ч мөчийг дэмжлэг болго. Зурагт хуудас, бараа, стрим, хаана ч.",
			path: "/qr-code",
		}),
	component: QrCodePage,
});

function QrCodePage() {
	return (
		<>
			<QrHero />
			<QrSetup />
			<QrHowSupport />
			<Faq items={qrFaqs} />
			<CallToAction />
		</>
	);
}
