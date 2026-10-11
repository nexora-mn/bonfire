import { cn } from "cn";
import { Container } from "@/components/container";
import { Doodle, type DoodleName } from "@/components/doodle";
import { AiTag, type AiTagKind } from "./ai-tag";

const posts: {
	doodle: DoodleName;
	tint: string;
	tag?: AiTagKind;
	offset: string;
}[] = [
	{ doodle: "selfie", tint: "bg-spark", tag: "assisted", offset: "md:mt-12" },
	{ doodle: "reading-side", tint: "bg-flame", offset: "" },
	{ doodle: "float", tint: "bg-coral", tag: "generated", offset: "md:mt-12" },
];

export function AiHero() {
	return (
		<section className="grain relative isolate overflow-hidden pt-36 pb-24 text-center lg:pt-44">
			<Container>
				<h1 className="display-1 mx-auto max-w-5xl">
					{"World is crazy over AI hype"}
				</h1>
				<p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-foreground/70">
					{
						"AI хэдхэн секундэд зураг, дуу, текст үнэхээр чадварлагаар гаргадаг болсон. Гэвч энэ нь бидний бутээлч байдалыг хэзээ ч орлож чадахгүй. Бид бүх зүйлээ хийлгэх биш зөвөөр ашиглахыг дэмждэг"
					}
				</p>

				<ul className="mx-auto mt-16 grid max-w-4xl grid-cols-3 items-start gap-3 sm:gap-5">
					{posts.map((post) => (
						<li
							key={post.doodle}
							className={cn(
								"relative flex aspect-4/5 items-end rounded-[1.5rem] p-3 sm:rounded-[2.5rem] sm:p-6",
								post.tint,
								post.offset,
							)}
						>
							<Doodle name={post.doodle} priority className="w-full" />
							{post.tag && (
								<AiTag
									kind={post.tag}
									className="absolute top-3 left-3 bg-ink text-cream max-sm:px-2 max-sm:text-[0.65rem] sm:top-5 sm:left-5"
								/>
							)}
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
