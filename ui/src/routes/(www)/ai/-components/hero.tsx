import { useRef } from "react";
import { Container } from "@/components/container";
import { MOTION_OK } from "@/lib/constants";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export function AiHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        MOTION_OK,
        () => {
          const heading = scope.current?.querySelector("h1");
          if (!heading) return;
          SplitText.create(heading, {
            type: "words",
            autoSplit: true,
            onSplit: (self) => {
              gsap.set(heading, { autoAlpha: 1 });
              return gsap.from(self.words, {
                yPercent: 80,
                rotate: 6,
                autoAlpha: 0,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.1,
              });
            },
          });
          gsap.fromTo(
            "[data-intro='copy']",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", delay: 0.4 },
          );
        },
        scope,
      );
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="pt-32 pb-20 lg:pt-44 lg:pb-32">
      <Container>
        <h1 data-intro="heading" className="display-1">
          {"Хүний бүтээл,"}
          <br />
          <span className="text-flame">{"AI-н хурд."}</span>
        </h1>
        <p
          data-intro="copy"
          className="mt-8 max-w-xl text-xl leading-relaxed text-foreground/70"
        >
          {
            "AI is our sandbox. Use it to fail faster, and create something beautiful"
          }
        </p>
      </Container>
    </section>
  );
}
