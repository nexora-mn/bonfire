import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { siDiscord } from "simple-icons";
import { BrandIcon } from "@/components/brand-icon";
import { FlameMark } from "@/components/flame-mark";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { GoogleLogo } from "@/components/google-logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { useActionForm } from "@/hooks/use-action-form";
import { OAUTH_PROVIDERS, type OAuthProvider } from "@/lib/constants";
import { type Credentials, credentialsSchema } from "@/lib/schemas/auth";
import { BrandPanel } from "./brand-panel";

const providerDetails: Record<
	OAuthProvider,
	{
		/** Full text: Mongolian case suffixes differ per name. */
		action: string;
		icon: React.ReactNode;
		className: string;
	}
> = {
	google: {
		action: "Google-ээр үргэлжлүүлэх",
		icon: <GoogleLogo />,
		// Google's dark-theme button: #131314 fill, #8E918F outline, #E3E3E3 text.
		className: "border-[#8e918f] bg-[#131314] text-[#e3e3e3] [--bevel:#444746]",
	},
	discord: {
		action: "Discord-оор үргэлжлүүлэх",
		icon: <BrandIcon icon={siDiscord} />,
		// Discord "blurple".
		className: "border-[#5865F2] bg-[#5865F2] text-white [--bevel:#3c45a5]",
	},
};

type AuthFormProps = {
	title: string;
	description: string;
	submitLabel: string;
	footer: React.ReactNode;
	notice?: string | null;
	/** Where an OAuth sign-in returns to. */
	redirect?: string;
	onSubmit: (credentials: Credentials) => Promise<string | null>;
};

export function AuthForm({
	title,
	description,
	submitLabel,
	footer,
	notice,
	redirect,
	onSubmit,
}: AuthFormProps) {
	const {
		form,
		onSubmit: handleSubmit,
		pending,
		error,
	} = useActionForm({
		schema: credentialsSchema,
		defaultValues: { email: "", password: "" },
		action: onSubmit,
	});

	return (
		// Always dark, whatever the theme setting.
		<div className="dark grid min-h-svh bg-background text-foreground lg:grid-cols-[1.2fr_1fr]">
			<main className="flex flex-col p-4 sm:p-6 lg:p-8">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className={cn(buttonVariants({ variant: "neutral", size: "sm" }))}
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
							<div className="flex flex-col gap-3">
								{OAUTH_PROVIDERS.map((provider) => (
									<a
										key={provider}
										href={`/auth/oauth/${provider}${
											redirect
												? `?redirect=${encodeURIComponent(redirect)}`
												: ""
										}`}
										className={cn(
											buttonVariants(),
											// Provider names keep their own casing.
											"w-full tracking-normal normal-case",
											providerDetails[provider].className,
										)}
									>
										{providerDetails[provider].icon}
										{providerDetails[provider].action}
									</a>
								))}
							</div>
							<FieldSeparator>{"эсвэл имэйлээр"}</FieldSeparator>
							<form onSubmit={handleSubmit} noValidate>
								<FieldGroup>
									<TextField
										control={form.control}
										name="email"
										label="Имэйл"
										type="email"
										autoComplete="email"
									/>
									<TextField
										control={form.control}
										name="password"
										label="Нууц үг"
										type="password"
										autoComplete="current-password"
									/>
									<SubmitButton pending={pending} className="mt-2 w-full">
										{submitLabel}
									</SubmitButton>
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
