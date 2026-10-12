import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";
import { buttonVariants } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { ResourcesMenu } from "./resources-menu";

const navLink =
  "rounded-full px-4 py-2 text-[0.95rem] font-medium text-foreground/75 transition-colors hover:text-foreground data-[status=active]:text-foreground";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center gap-2">
        <div className="mr-auto flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-[1.45rem] leading-none font-extrabold"
          >
            <FlameMark className="size-8 text-foreground" />
            {"Bonfire"}
          </Link>
          <nav aria-label="Үндсэн цэс" className="hidden items-center md:flex">
            <ResourcesMenu className="flex" />
            <Link to="/roadmap" className={navLink}>
              {"Замын зураг"}
            </Link>
            <Link to="/blog" className={navLink}>
              {"Блог"}
            </Link>
          </nav>
        </div>

        {signedIn ? (
          <Link
            to="/home"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden min-[360px]:inline-flex",
            )}
          >
            {"Хянах самбар"}
          </Link>
        ) : (
          <>
            <Link to="/login" className={cn(navLink, "hidden md:inline-flex")}>
              {"Нэвтрэх"}
            </Link>
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden min-[360px]:inline-flex",
              )}
            >
              {"Хуудсаа нээх"}
            </Link>
          </>
        )}
        <MobileMenu signedIn={signedIn} />
      </Container>
    </header>
  );
}
