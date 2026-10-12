import { cn } from "cn";
import { Container } from "@/components/container";
import { Doodle } from "@/components/doodle";
import { Band } from "../../-components/band";
import { creatorTips } from "./stance";

const tints = ["bg-cream", "bg-spark", "bg-coral", "bg-cream"];

export function ForCreators() {
  return (
    <Band className="overflow-hidden">
      <Container>
        <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p
              data-reveal="up"
              className="font-hand text-2xl text-foreground/60"
            >
              {"Бүтээгчдэд"}
            </p>
            <h2 data-reveal="words" className="display-2 mt-3">
              {"AI-г хэрэгсэл болго, өөрийгөө бүү орлуул"}
            </h2>
            <p
              data-reveal="up"
              className="mt-6 max-w-xl text-xl leading-relaxed text-foreground/75"
            >
              {
                "Дэмжигчид чинь машиныг биш, чамайг дэмжиж байгаа. Бид бүтээгчдийг AI-г ухаалгаар ашиглаж, бүтээлийнхээ зүрхийг өөртөө үлдээхийг уриалж байна."
              }
            </p>
          </div>
          {/* The doodle's black outlines need a light ground on the dark band. */}
          <div
            data-reveal="up"
            className="mx-auto w-full max-w-sm rotate-2 rounded-[2.5rem] bg-cream p-6 shadow-2xl shadow-black/40"
          >
            <Doodle name="sitting-reading" className="w-full" />
          </div>
        </div>

        <ul
          data-reveal="stagger"
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {creatorTips.map((tip, i) => (
            <li
              key={tip.title}
              className={cn(
                "rounded-[2rem] p-7 text-ink shadow-xl shadow-ink/15",
                tints[i],
              )}
            >
              <h3 className="font-heading text-2xl font-extrabold tracking-tight">
                {tip.title}
              </h3>
              <p className="mt-3 text-ink/70">{tip.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Band>
  );
}
