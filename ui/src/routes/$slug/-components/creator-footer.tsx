import { Link } from "@tanstack/react-router";
import { FlameMark } from "@/components/flame-mark";

export function CreatorFooter({ signedIn }: { signedIn: boolean }) {
	return (
		<footer className="mt-16 flex justify-center px-5">
			<Link
				to={signedIn ? "/studio/create" : "/signup"}
				className="flex items-center gap-2 rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-sm transition-colors hover:border-flame"
			>
				<FlameMark className="size-5" />
				{"Bonfire дээр өөрийн хуудсаа нээ"}
			</Link>
		</footer>
	);
}
