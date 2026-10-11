import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { absoluteUrl } from "#/lib/seo";
import { brandButtonVariants } from "@/components/brand-button";
import { Container } from "@/components/container";
import { QrCode } from "./qr-code";

export function QrHero() {
	return (
		<section className="grain relative isolate overflow-hidden pt-36 pb-24 lg:pt-44">
			<Container className="grid items-center gap-14 md:grid-cols-[1.3fr_1fr]">
				<div>
					<h1 className="display-1">{"Уншуул. Дэмж. Энгийн."}</h1>
					<p className="mt-8 max-w-md text-xl leading-relaxed text-foreground/70">
						{
							"Өөрийн QR кодоор ямар ч мөчийг дэмжлэг болго. Дэлгэц, зурагт хуудас, бараа, хаана ч."
						}
					</p>
					<Link
						to="/signup"
						className={cn(brandButtonVariants({ size: "lg" }), "mt-10")}
					>
						{"QR кодоо авах"}
					</Link>
				</div>

				<div className="mx-auto w-full max-w-xs rotate-2 rounded-[2.5rem] bg-flame p-5 text-center text-ink shadow-2xl shadow-black/40">
					<p className="display-3 text-xl">{"Bonfire дээр намайг дэмжээрэй"}</p>
					<div className="mt-4 rounded-[1.75rem] bg-cream p-5">
						<QrCode value={absoluteUrl("/signup")} className="w-full" />
					</div>
					<p className="mt-4 text-sm font-semibold text-ink/70">
						{"Утасныхаа камераар уншуулаарай"}
					</p>
				</div>
			</Container>
		</section>
	);
}
