import { Copy01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { QrCode } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Creator } from "@/lib/api/creator";
import { COPIED_RESET_MS, QR_DOWNLOAD_SIZE } from "@/lib/constants";
import { downloadBlob, pngBlob, svgMarkup } from "@/lib/utils/download";
import { creatorUrl, qrUrl } from "@/lib/utils/url";

export function QrCard({ creator }: { creator: Creator }) {
	const holder = useRef<HTMLDivElement>(null);
	const [copied, setCopied] = useState(false);
	const target = qrUrl(creator.code);

	function markup() {
		const svg = holder.current?.querySelector("svg");
		return svg ? svgMarkup(svg, QR_DOWNLOAD_SIZE) : null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Таны QR код"}</CardTitle>
				<CardDescription>
					{
						"Хуудасныхаа хаягийг сольсон ч энэ код өөрчлөгдөхгүй тул дахин хэвлэх шаардлагагүй."
					}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				{/* Always dark-on-cream so it scans in both themes. */}
				<div ref={holder} className="w-56 shrink-0 rounded-2xl bg-cream p-5">
					<QrCode value={target} />
				</div>
				<div className="flex flex-col gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">
							{"Уншуулахад нээгдэх хуудас"}
						</p>
						<p className="font-medium break-all">{creatorUrl(creator.slug)}</p>
					</div>
					<div>
						<p className="text-muted-foreground">{"Кодны холбоос"}</p>
						<p className="font-mono break-all">{target}</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button
							size="sm"
							onClick={async () => {
								const svg = markup();
								if (svg)
									downloadBlob(
										await pngBlob(svg, QR_DOWNLOAD_SIZE),
										`bonfire-${creator.slug}.png`,
									);
							}}
						>
							<HugeiconsIcon icon={Download01Icon} />
							{"PNG татах"}
						</Button>
						<Button
							variant="neutral"
							size="sm"
							onClick={() => {
								const svg = markup();
								if (svg)
									downloadBlob(
										new Blob([svg], { type: "image/svg+xml" }),
										`bonfire-${creator.slug}.svg`,
									);
							}}
						>
							<HugeiconsIcon icon={Download01Icon} />
							{"SVG татах"}
						</Button>
						<Button
							variant="neutral"
							size="sm"
							onClick={async () => {
								await navigator.clipboard.writeText(target);
								setCopied(true);
								setTimeout(() => setCopied(false), COPIED_RESET_MS);
							}}
						>
							<HugeiconsIcon icon={Copy01Icon} />
							{copied ? "Хуулсан!" : "Холбоос хуулах"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
