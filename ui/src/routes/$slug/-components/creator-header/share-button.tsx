import { Share08Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { COPIED_RESET_MS } from "@/lib/constants";
import { creatorUrl } from "@/lib/utils/url";

// Native share sheet where there is one (phones), otherwise copy the link.
export function ShareButton({ name, slug }: { name: string; slug: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<Button
			variant="neutral"
			size="icon"
			className="size-10"
			aria-label={copied ? "Холбоос хуулагдлаа" : "Хуваалцах"}
			onClick={async () => {
				const url = creatorUrl(slug);
				if (navigator.share) {
					await navigator.share({ title: name, url }).catch(() => {});
					return;
				}
				await navigator.clipboard.writeText(url);
				setCopied(true);
				setTimeout(() => setCopied(false), COPIED_RESET_MS);
			}}
		>
			<HugeiconsIcon icon={copied ? Tick02Icon : Share08Icon} />
		</Button>
	);
}
