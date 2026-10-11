import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";
import { buttonVariants } from "@/components/ui/button";

export function CreatorNotFound() {
	return (
		<section className="pt-24 pb-28">
			<Container>
				<FlameMark className="w-16" />
				<h1 className="display-1 mt-8 max-w-4xl">{"Энэ хуудас олдсонгүй"}</h1>
				<p className="mt-6 max-w-md text-xl text-foreground/65">
					{"Хаяг буруу эсвэл бүтээгч хаягаа сольсон байж магадгүй."}
				</p>
				<Link to="/" className={cn(buttonVariants({ size: "lg" }), "mt-9")}>
					{"Нүүр хуудас руу"}
				</Link>
			</Container>
		</section>
	);
}
