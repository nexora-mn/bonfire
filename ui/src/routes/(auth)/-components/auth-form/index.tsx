import { ArrowLeft01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useState } from "react";
import { siDiscord, siGoogle } from "simple-icons";
import { BrandIcon } from "@/components/brand-icon";
import { FlameMark } from "@/components/flame-mark";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type OAuthProvider, oauthProviders } from "@/lib/oauth";
import { BrandPanel } from "./brand-panel";

// Brand styling for each provider's button.
const providerDetails: Record<
	OAuthProvider,
	{
		/** Full button text; Mongolian case suffixes differ per name. */
		action: string;
		icon: React.ReactNode;
		className: string;
	}
> = {
	google: {
		action: "Google-ээр үргэлжлүүлэх",
		icon: <BrandIcon icon={siGoogle} color={`#${siGoogle.hex}`} />,
		// Google's neutral button: white with a grey outline (dark: #131314).
		className:
			"border-[#747775] bg-white text-[#1f1f1f] hover:bg-[#f2f2f2] hover:text-[#1f1f1f] dark:border-[#8e918f] dark:bg-[#131314] dark:text-[#e3e3e3] dark:hover:bg-[#1f1f20] dark:hover:text-[#e3e3e3]",
	},
	discord: {
		action: "Discord-оор үргэлжлүүлэх",
		icon: <BrandIcon icon={siDiscord} />,
		// Discord "blurple".
		className:
			"border-transparent bg-[#5865F2] text-white hover:bg-[#4752C4] hover:text-white dark:bg-[#5865F2] dark:hover:bg-[#4752C4]",
	},
};

type AuthFormProps = {
	title: string;
	description: string;
	submitLabel: string;
	footer: React.ReactNode;
	notice?: string | null;
	/** Path to return to after signing in with an OAuth provider. */
	redirect?: string;
	onSubmit: (credentials: {
		email: string;
		password: string;
	}) => Promise<string | null>;
};

/** Split-screen auth page: form on the left, brand panel on the right. */
export function AuthForm({
	title,
	description,
	submitLabel,
	footer,
	notice,
	redirect,
	onSubmit,
}: AuthFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		setPending(true);
		setError(null);
		try {
			setError(
				await onSubmit({
					email: String(form.get("email")),
					password: String(form.get("password")),
				}),
			);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Алдаа гарлаа. Дахин оролдоно уу.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="grid min-h-svh lg:grid-cols-[1.2fr_1fr]">
			<main className="flex flex-col p-4 sm:p-6 lg:p-8">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className={cn(
							buttonVariants({ variant: "ghost", size: "sm" }),
							"-ml-2 text-muted-foreground",
						)}
					>
						<HugeiconsIcon icon={ArrowLeft01Icon} />
						{"Нүүр хуудас"}
					</Link>
					{/* The brand panel carries the logo on wide screens. */}
					<Link
						to="/"
						className="flex items-center gap-2 text-xl leading-none font-extrabold lg:hidden"
					>
						<FlameMark className="size-7" />
						{"Bonfire"}
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center py-10">
					<div className="flex w-full max-w-md flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h1 className="display-3 text-4xl">{title}</h1>
							<p className="text-lg text-muted-foreground">{description}</p>
						</div>
						<FieldGroup>
							{(error ?? notice) && (
								<Alert variant={error ? "destructive" : "default"}>
									<AlertDescription>{error ?? notice}</AlertDescription>
								</Alert>
							)}
							{/* Full page navigations: the server route redirects to the provider. */}
							<div className="flex flex-col gap-2">
								{oauthProviders.map((provider) => (
									<a
										key={provider}
										href={`/auth/oauth/${provider}${
											redirect
												? `?redirect=${encodeURIComponent(redirect)}`
												: ""
										}`}
										className={cn(
											buttonVariants({ variant: "outline", size: "lg" }),
											"h-11 w-full font-medium",
											providerDetails[provider].className,
										)}
									>
										{providerDetails[provider].icon}
										{providerDetails[provider].action}
									</a>
								))}
							</div>
							<FieldSeparator>{"эсвэл имэйлээр"}</FieldSeparator>
							<form onSubmit={handleSubmit}>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="email">{"Имэйл"}</FieldLabel>
										<Input
											id="email"
											name="email"
											type="email"
											autoComplete="email"
											className="h-11"
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="password">{"Нууц үг"}</FieldLabel>
										<Input
											id="password"
											name="password"
											type="password"
											autoComplete="current-password"
											minLength={6}
											className="h-11"
											required
										/>
									</Field>
									<Button
										type="submit"
										size="lg"
										className="h-11 w-full"
										disabled={pending}
									>
										{pending && (
											<HugeiconsIcon
												icon={Loading03Icon}
												className="animate-spin"
											/>
										)}
										{submitLabel}
									</Button>
								</FieldGroup>
							</form>
						</FieldGroup>
						<p className="text-center text-sm text-muted-foreground">
							{footer}
						</p>
					</div>
				</div>
			</main>
			<BrandPanel />
		</div>
	);
}
