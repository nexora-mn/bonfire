import { Container } from "@/components/container";
import { Band } from "../../-components/band";

export function AiConcern() {
	return (
		<Band tone="flame">
			<Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
				<h2 className="display-2">{"AI бүтээлч байдлыг орлож байна уу?"}</h2>
				<div className="space-y-5 text-xl leading-relaxed text-foreground/75">
					<p>
						{
							"Сүүлийн хэдэн жилд AI-аар хийсэн зураг, дуу, нийтлэл интернэтийг үерлэж байна. Олон уран бүтээлчид өөрийн хөдөлмөрөө хуулбарлуулж, анзаарагдахгүй болох вий гэж санаа зовдог. Энэ айдас бодит."
						}
					</p>
					<p>
						{
							"Гэвч бүтээлч байдал зөвхөн эцсийн үр дүн биш. Юуг бүтээхээ сонгох, өөрийн түүх, амтаа шингээх, алдаж байгаад дахин оролдох, тэр бүхэн хүнийх. AI таны оройнуудыг, таны нүдээр харсан ертөнцийг орлож чадахгүй."
						}
					</p>
					<p className="border-l-4 border-foreground pl-5 text-2xl font-bold tracking-[-0.02em] text-foreground">
						{
							"Тиймээс бид AI-г хориглодоггүй. Харин хэрэгсэл болгон ашиглахыг дэмжиж, хэрхэн ашигласнаа ил тод хэлэхийг хүсдэг."
						}
					</p>
				</div>
			</Container>
		</Band>
	);
}
