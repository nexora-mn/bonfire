import { Container } from "@/components/container";
import { Band } from "../../-components/band";
import { AiTag, type AiTagKind } from "./ai-tag";

const kinds: { kind: AiTagKind; when: string; examples: string }[] = [
	{
		kind: "assisted",
		when: "Бүтээлээ та өөрөө хийсэн ч явцдаа AI-аас тусламж авсан бол.",
		examples:
			"Жишээ нь: AI-аар санаа гаргуулсан, ноорог хийлгэсэн, текстээ засуулсан, дуугаа миксжүүлсэн.",
	},
	{
		kind: "generated",
		when: "Бүтээлийн гол хэсгийг AI үүсгэсэн бол.",
		examples:
			"Жишээ нь: зураг, дуу, текстийг prompt-оор гаргаж аваад бага зэрэг засварласан.",
	},
];

const rules = [
	"Нийтлэл оруулахдаа тохирох тэмдгээ өөрөө сонгоно. Тэмдэггүй бүтээл нь хүний гараар хийгдсэн гэсэн үг.",
	"Тэмдэг нь нийтлэл болон таны хуудсан дээр харагдах тул дэмжигчид юуг дэмжиж байгаагаа мэдэж байна.",
	"Буруу тэмдэглэсэн бүтээлийг хэн ч мэдэгдэж болно. Давтагдвал тэмдгийг бид засаж, нийтлэлийг нууж болно.",
];

export function AiTags() {
	return (
		<Band className="border-t border-foreground/10">
			<Container>
				<h2 className="display-2 max-w-4xl">
					{"AI can replicate but can't recreate"}
				</h2>
				<p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">
					{
						"AI ашигласан бүтээл бүр хоёр тэмдгийн аль нэгийг авна. Ингэснээр хүний хөдөлмөр үнэлэгдэж, дэмжигчид мэдээлэлтэй шийдвэр гаргана."
					}
				</p>

				<div className="mt-12 grid gap-5 md:grid-cols-2">
					{kinds.map((item) => (
						<div
							key={item.kind}
							className="rounded-[2.5rem] border border-foreground/10 bg-foreground/4 p-8"
						>
							<AiTag kind={item.kind} />
							<p className="display-3 mt-6">{item.when}</p>
							<p className="mt-2 text-foreground/60">{item.examples}</p>
						</div>
					))}
				</div>

				<ol className="mt-12 divide-y divide-foreground/15 border-y border-foreground/15">
					{rules.map((rule, i) => (
						<li key={rule} className="flex gap-6 py-6">
							<span className="font-hand text-3xl leading-none text-flame tabular-nums">
								{String(i + 1).padStart(2, "0")}
							</span>
							<p className="text-lg text-foreground/75">{rule}</p>
						</li>
					))}
				</ol>
			</Container>
		</Band>
	);
}
