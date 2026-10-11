import { Link } from "@tanstack/react-router";
import { FlameMark } from "@/components/flame-mark";
import { buttonVariants } from "@/components/ui/button";

export function CreatorTopBar({ signedIn }: { signedIn: boolean }) {
	return (
		<header className="flex h-16 items-center justify-between px-4 sm:px-6">
			<Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
				<FlameMark className="size-6" />
				{"Bonfire"}
			</Link>
			<Link
				to={signedIn ? "/home" : "/signup"}
				className={buttonVariants({ size: "sm" })}
			>
				{signedIn ? "Платформ" : "Бүртгүүлэх"}
			</Link>
		</header>
	);
}
