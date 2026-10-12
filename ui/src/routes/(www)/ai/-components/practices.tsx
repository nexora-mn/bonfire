import { Container } from "@/components/container";
import { Band } from "../../-components/band";
import { practices } from "./stance";

export function Practices() {
  return (
    <Band tone="flame">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p data-reveal="up" className="font-hand text-2xl text-foreground/60">
            {"Бид хэрхэн бүтээдэг"}
          </p>
          <h2 data-reveal="words" className="display-2 mt-3">
            {"Bonfire-г хүмүүс бүтээдэг"}
          </h2>
        </div>
        <ol data-reveal="stagger" className="grid gap-10">
          {practices.map((practice, i) => (
            <li key={practice.title} className="flex gap-6">
              <span className="font-heading text-lg font-bold tracking-widest text-flame tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display-3">{practice.title}</h3>
                <p className="mt-2 text-lg text-foreground/65">
                  {practice.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Band>
  );
}
