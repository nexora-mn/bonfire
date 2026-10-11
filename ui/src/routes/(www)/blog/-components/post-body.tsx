import {
	PortableText,
	type PortableTextBlock,
	type PortableTextComponents,
} from "@portabletext/react";
import { PostImage } from "./post-image";
import type { PostBodyValue, SanityImage } from "./posts";

const components: PortableTextComponents = {
	block: {
		normal: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
		h2: ({ children }) => (
			<h2 className="display-3 mt-14 mb-4 text-[2rem] text-foreground first:mt-0">
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className="display-3 mt-10 mb-3 text-foreground first:mt-0">
				{children}
			</h3>
		),
		blockquote: ({ children }) => (
			<blockquote className="my-12 border-l-4 border-flame pl-6 text-3xl leading-snug font-bold tracking-[-0.02em] text-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="mt-5 list-disc space-y-2 pl-6 marker:text-flame">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="mt-5 list-decimal space-y-2 pl-6 marker:text-flame">
				{children}
			</ol>
		),
	},
	marks: {
		strong: ({ children }) => (
			<strong className="font-semibold text-foreground">{children}</strong>
		),
		link: ({ children, value }) => {
			const href: string = value?.href ?? "#";
			const external = /^https?:/.test(href);
			return (
				<a
					href={href}
					target={external ? "_blank" : undefined}
					rel={external ? "noopener noreferrer" : undefined}
					className="text-foreground underline decoration-flame decoration-2 underline-offset-4 hover:decoration-[3px]"
				>
					{children}
				</a>
			);
		},
	},
	types: {
		image: ({
			value,
		}: {
			value: SanityImage & { caption?: string; aspect?: number };
		}) => (
			<figure className="my-10">
				<PostImage
					image={value}
					aspect={value.aspect ?? 3 / 2}
					sizes="(min-width: 42rem) 42rem, 100vw"
					className="w-full rounded-2xl"
				/>
				{value.caption && (
					<figcaption className="mt-3 text-center text-sm text-foreground/55">
						{value.caption}
					</figcaption>
				)}
			</figure>
		),
	},
};

export function PostBody({ value }: { value: PostBodyValue }) {
	return (
		// Drop cap on the opening paragraph.
		<div className="mx-auto mt-16 max-w-2xl text-lg leading-relaxed text-foreground/80 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mt-1 [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:font-extrabold [&>p:first-child]:first-letter:text-7xl [&>p:first-child]:first-letter:leading-[0.8] [&>p:first-child]:first-letter:text-flame">
			<PortableText
				value={value as unknown as PortableTextBlock[]}
				components={components}
			/>
		</div>
	);
}
