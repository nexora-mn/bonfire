import {
	ArrowRight01Icon,
	CheckmarkCircle02Icon,
	CircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { brandButtonVariants } from "@/components/brand-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AuthUser } from "@/lib/auth";

/** Onboarding checklist; steps tick off as the account fills in. */
export function GettingStarted({ user }: { user: AuthUser }) {
	const steps = [
		{ label: "Бүртгэл үүсгэх", done: true },
		{
			label: "Профайлдаа нэрээ оруулах",
			done: !!user.name,
			action: { to: "/dashboard/profile", label: "Профайл руу" },
		},
		{ label: "Дэмжлэг хүлээн авч эхлэх", done: false, soon: true },
	] as const;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Эхлэх алхмууд"}</CardTitle>
				<CardDescription>
					{"Хуудсаа бэлдэхэд хэдхэн алхам үлдлээ."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="divide-y">
					{steps.map((step) => (
						<li
							key={step.label}
							className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
						>
							<HugeiconsIcon
								icon={step.done ? CheckmarkCircle02Icon : CircleIcon}
								className={cn(
									"size-5 shrink-0",
									step.done ? "text-primary" : "text-muted-foreground",
								)}
							/>
							<span
								className={cn(
									"flex-1 text-sm",
									step.done && "text-muted-foreground line-through",
								)}
							>
								{step.label}
							</span>
							{"action" in step && !step.done && (
								<Link
									to={step.action.to}
									className={brandButtonVariants({
										variant: "neutral",
										size: "sm",
									})}
								>
									{step.action.label}
									<HugeiconsIcon icon={ArrowRight01Icon} />
								</Link>
							)}
							{"soon" in step && (
								<span className="text-xs text-muted-foreground">
									{"Удахгүй"}
								</span>
							)}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
