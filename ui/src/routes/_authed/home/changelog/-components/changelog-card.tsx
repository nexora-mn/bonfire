import { formatIsoDate } from "@/lib/utils/date";
import type { Changelog } from "./changelogs";

export function ChangelogCard({ entry }: { entry: Changelog }) {
	return (
		<article className="rounded-3xl bg-card p-5 shadow-sm">
			<p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
				<time dateTime={entry.date}>{formatIsoDate(entry.date)}</time>
				{entry.version && (
					<>
						<span aria-hidden="true">{"·"}</span>
						<span className="font-semibold text-flame">{`v${entry.version.replace(/^v/i, "")}`}</span>
					</>
				)}
			</p>
			<h2 className="mt-1 text-xl font-bold">{entry.title}</h2>
			<div
				className="mt-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-flame [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ul]:mt-2 [&>:first-child]:mt-0 marker:text-flame"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: markdown rendered server-side from our own Sanity content
				dangerouslySetInnerHTML={{ __html: entry.html }}
			/>
		</article>
	);
}
