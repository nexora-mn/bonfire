import { createServerFn } from "@tanstack/react-start";
import { marked } from "marked";
import { sanity } from "@/lib/sanity";

export type Changelog = {
	id: string;
	title: string;
	version: string | null;
	/** YYYY-MM-DD */
	date: string;
	/** Rendered from the markdown `content` field. */
	html: string;
};

const listQuery = `*[_type == "changelog" && defined(releasedAt)] | order(releasedAt desc, _createdAt desc) {
	"id": _id,
	title,
	version,
	"date": releasedAt,
	content
}`;

export const fetchChangelogs = createServerFn({ method: "GET" }).handler(
	async (): Promise<Changelog[]> => {
		const entries =
			await sanity.fetch<
				(Omit<Changelog, "html"> & { content: string | null })[]
			>(listQuery);
		return entries.map(({ content, ...entry }) => ({
			...entry,
			html: marked.parse(content ?? "", { async: false }),
		}));
	},
);
