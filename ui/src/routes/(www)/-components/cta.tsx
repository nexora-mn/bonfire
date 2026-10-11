import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { brandButtonVariants } from "@/components/brand-button";
import { Container } from "@/components/container";
import { Doodle } from "@/components/doodle";
import { Band } from "./band";

export function CallToAction() {
	return (
		<Band tone="flame" className="overflow-hidden">
			<Container className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
				<div>
					<h2 className="display-1">{"Дуртай зүйлээрээ орлого ол"}</h2>
					<p className="mt-6 max-w-md text-xl text-foreground/75">
						{"Хуудсаа өнөө орой нээгээрэй. Хэн нэгэн дэмжих хүртэл үнэгүй."}
					</p>
					<Link
						to="/signup"
						className={cn(
							brandButtonVariants({ variant: "ink", size: "lg" }),
							"mt-9",
						)}
					>
						{"Хуудсаа нээх"}
					</Link>
				</div>
				<Doodle name="jumping" className="mx-auto w-full max-w-md" />
			</Container>
		</Band>
	);
}
