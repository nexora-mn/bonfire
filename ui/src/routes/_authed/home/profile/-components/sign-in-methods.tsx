import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { siDiscord, siGoogle } from "simple-icons";
import { BrandIcon } from "@/components/brand-icon";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AuthUser } from "@/lib/auth";

const methods = [
	{
		id: "email",
		label: "Имэйл ба нууц үг",
		icon: <HugeiconsIcon icon={Mail01Icon} className="size-4" />,
	},
	{ id: "google", label: "Google", icon: <BrandIcon icon={siGoogle} /> },
	{ id: "discord", label: "Discord", icon: <BrandIcon icon={siDiscord} /> },
];

export function SignInMethods({ user }: { user: AuthUser }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Нэвтрэх аргууд"}</CardTitle>
				<CardDescription>
					{"Таны бүртгэлд холбогдсон нэвтрэх аргууд."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col gap-2">
					{methods.map((method) => {
						const linked = user.providers.includes(method.id);
						return (
							<li
								key={method.id}
								className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3 text-sm"
							>
								<span className="flex size-8 items-center justify-center rounded-2xl bg-muted">
									{method.icon}
								</span>
								<span className="flex-1 font-medium">{method.label}</span>
								<Badge variant={linked ? "default" : "outline"}>
									{linked ? "Холбогдсон" : "Холбогдоогүй"}
								</Badge>
							</li>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
