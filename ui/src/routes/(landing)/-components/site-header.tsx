import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { FlameMark } from "./flame-mark";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
	return (
		<header className="sticky top-0 z-40 border-b border-background/10 bg-foreground/95 text-background backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6">
				<Link
					to="/"
					className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
				>
					<FlameMark className="size-7 text-background" />
					{"Bonfire"}
				</Link>
				<nav
					aria-label="Үндсэн цэс"
					className="hidden items-center gap-6 text-sm text-background/70 md:flex"
				>
					<a href="#passions" className="hover:text-background">
						{"Танилцах"}
					</a>
				</nav>
				<div className="ml-auto flex items-center gap-2">
					{signedIn ? (
						<Link
							to="/dashboard"
							className={cn(buttonVariants({ size: "lg" }), "font-semibold")}
						>
							{"Хянах самбар"}
						</Link>
					) : (
						<>
							<Link
								to="/login"
								className={cn(
									buttonVariants({ variant: "ghost", size: "lg" }),
									"text-background hover:bg-background/10 hover:text-background",
								)}
							>
								{"Нэвтрэх"}
							</Link>
							<Link
								to="/signup"
								className={cn(buttonVariants({ size: "lg" }), "font-semibold")}
							>
								{"Хуудсаа нээх"}
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
