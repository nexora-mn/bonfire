import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

export function SubmitButton({
	pending,
	children,
	...props
}: ComponentProps<typeof Button> & { pending: boolean }) {
	return (
		<Button type="submit" disabled={pending} {...props}>
			{pending && (
				<HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
			)}
			{children}
		</Button>
	);
}
