import {
	ArrowRight01Icon,
	CheckmarkCircle02Icon,
	CircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Creator } from "@/lib/api/creator";

type Step = {
	label: string;
	done: boolean;
	action?: { to: LinkProps["to"]; label: string };
	soon?: boolean;
};

export function GettingStarted({ creator }: { creator: Creator }) {
	const steps: Step[] = [
		{ label: "Бүтээгчийн хуудсаа нээх", done: true },
		{
			label: "Хуудсандаа зураг нэмэх",
			done: !!creator.avatarUrl,
			action: { to: "/studio/page", label: "Зураг нэмэх" },
		},
		{
			label: "Танилцуулгаа бичих",
			done: !!creator.about,
			action: { to: "/studio/page", label: "Бичих" },
		},
		{ label: "Дэмжлэг хүлээн авч эхлэх", done: false, soon: true },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Эхлэх алхмууд"}</CardTitle>
				<CardDescription>
					{"Хуудсаа бэлдэхэд хэдхэн алхам үлдлээ."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col gap-2">
					{steps.map((step) => (
						<li
							key={step.label}
							className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3"
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
							{step.action && !step.done && (
								<Link
									to={step.action.to}
									className={buttonVariants({
										variant: "neutral",
										size: "sm",
									})}
								>
									{step.action.label}
									<HugeiconsIcon icon={ArrowRight01Icon} />
								</Link>
							)}
							{step.soon && (
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
