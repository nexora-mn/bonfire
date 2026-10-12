import { Link } from "@tanstack/react-router";
import { APP_VERSION } from "@/lib/constants";

export function RailFooter() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="rounded-full bg-flame/15 px-2 py-0.5 font-semibold text-flame">
        {"Early access"}
      </span>
      <Link
        to="/home/changelog"
        className="tabular-nums transition-colors hover:text-foreground"
      >
        {`v${APP_VERSION}`}
      </Link>
      <span className="ml-auto">{"© Bonfire"}</span>
    </div>
  );
}
