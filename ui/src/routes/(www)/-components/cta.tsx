import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { Container } from "@/components/container";
import { Doodle } from "@/components/doodle";
import { buttonVariants } from "@/components/ui/button";
import { Band } from "./band";

export function CallToAction() {
  return (
    <Band tone="flame" className="overflow-hidden">
      <Container className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 data-reveal="words" className="display-1">
            {"Дуртай зүйлээрээ орлого ол"}
          </h2>
          <p
            data-reveal="up"
            className="mt-6 max-w-md text-xl text-foreground/75"
          >
            {"Хуудсаа өнөө орой нээгээрэй. Хэн нэгэн дэмжих хүртэл үнэгүй."}
          </p>
          <Link
            data-reveal="up"
            to="/signup"
            className={cn(
              buttonVariants({ variant: "ink", size: "lg" }),
              "mt-9",
            )}
          >
            {"Хуудсаа нээх"}
          </Link>
        </div>
        <div data-jumper className="origin-bottom">
          <Doodle name="jumping" className="mx-auto w-full max-w-md" />
        </div>
      </Container>
    </Band>
  );
}
