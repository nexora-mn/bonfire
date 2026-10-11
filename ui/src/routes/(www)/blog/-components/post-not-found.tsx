import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";
import { buttonVariants } from "@/components/ui/button";

export function PostNotFound() {
	return (
		<section className="pt-40 pb-28">
			<Container>
				<FlameMark className="w-16" />
				<h1 className="display-1 mt-8 max-w-4xl">{"Энэ нийтлэл олдсонгүй"}</h1>
				<p className="mt-6 max-w-md text-xl text-foreground/65">
					{"Холбоос буруу эсвэл нийтлэл устсан байж магадгүй."}
				</p>
				<Link to="/blog" className={cn(buttonVariants({ size: "lg" }), "mt-9")}>
					{"Блог руу буцах"}
				</Link>
			</Container>
		</section>
	);
}
