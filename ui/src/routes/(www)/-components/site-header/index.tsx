import { Link } from "@tanstack/react-router";
import { brandButtonVariants } from "@/components/brand-button";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";
import { ResourcesMenu } from "./resources-menu";

const navLink =
	"rounded-full px-4 py-2 text-[0.95rem] font-medium text-foreground/75 transition-colors hover:text-foreground data-[status=active]:text-foreground";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
	return (
		<header className="fixed inset-x-0 top-0 z-40 bg-background/80 backdrop-blur-xl">
			<Container className="flex h-18 items-center gap-1">
				<div className="mr-auto flex items-center gap-6">
					<Link
						to="/"
						className="flex items-center gap-2 text-[1.45rem] leading-none font-extrabold"
					>
						<FlameMark className="size-8 text-foreground" />
						{"Bonfire"}
					</Link>
					<nav aria-label="Үндсэн цэс" className="flex items-center">
						<Link to="/ai" className={navLink}>
							{"AI hype"}
						</Link>
						<ResourcesMenu className="hidden sm:flex" />
						<Link to="/blog" className={navLink}>
							{"Блог"}
						</Link>
					</nav>
				</div>

				{signedIn ? (
					<Link to="/dashboard" className={brandButtonVariants({ size: "sm" })}>
						{"Хянах самбар"}
					</Link>
				) : (
					<>
						<Link to="/login" className={navLink}>
							{"Нэвтрэх"}
						</Link>
						<Link to="/signup" className={brandButtonVariants({ size: "sm" })}>
							{"Хуудсаа нээх"}
						</Link>
					</>
				)}
			</Container>
		</header>
	);
}
