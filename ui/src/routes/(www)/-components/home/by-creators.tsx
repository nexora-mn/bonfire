import { useRef } from "react";
import { Container } from "@/components/container";
import { Doodle } from "@/components/doodle";
import { DESKTOP_QUERY, MOTION_OK } from "@/lib/constants";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export function ByCreators() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: MOTION_OK, desktop: DESKTOP_QUERY },
        (context) => {
          const { motion, desktop } = context.conditions ?? {};
          const root = scope.current;
          const heading = root?.querySelector("h2");
          const story = root?.querySelector("[data-story]");
          if (!motion || !root || !heading || !story) return;
          const headingWords = SplitText.create(heading, {
            type: "words",
          }).words;
          const storyWords = SplitText.create(story, { type: "words" }).words;

          gsap
            .timeline({
              defaults: { ease: "none" },
              // Phones scrub through the section instead of pinning: the
              // stacked layout is taller than the screen.
              scrollTrigger: desktop
                ? {
                  trigger: root,
                  start: "top top",
                  end: "+=180%",
                  pin: true,
                  scrub: 1,
                }
                : {
                  trigger: root,
                  start: "top 80%",
                  end: "bottom bottom",
                  scrub: 1,
                },
            })
            .fromTo(
              "[data-panel]",
              {
                clipPath: desktop
                  ? "inset(18% 14% 18% 14% round 3rem)"
                  : "inset(6% 5% 6% 5% round 2rem)",
              },
              {
                clipPath: "inset(0% 0% 0% 0% round 0rem)",
                ease: "power2.inOut",
                duration: 1,
              },
            )
            .from(
              "[data-doodle]",
              {
                scale: 0.45,
                rotate: -25,
                yPercent: 35,
                ease: "power2.out",
                duration: 1,
              },
              0,
            )
            .from("[data-eyebrow]", { y: 30, autoAlpha: 0, duration: 0.3 }, 0.4)
            .from(
              headingWords,
              {
                yPercent: 80,
                rotate: 6,
                autoAlpha: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: "power3.out",
              },
              0.45,
            )
            .fromTo(
              storyWords,
              { opacity: 0 },
              { opacity: 1, stagger: 0.05, duration: 0.2 },
              1,
            )
            .to(
              "[data-doodle]",
              { rotate: 6, scale: 1.08, yPercent: -6, duration: 1 },
              1,
            );
        },
        scope,
      );
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="by-creators" className="scroll-mt-16">
      <div
        data-panel
        className="light flex items-center lg:min-h-svh overflow-hidden bg-glow py-24 text-foreground"
      >
        <Container className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p data-eyebrow className="font-hand text-2xl text-foreground/60">
              {"Bonfire-ийн тухай"}
            </p>
            <h2 className="display-1 mt-3">{"Бүтээгчдээс, бүтээгчдэд"}</h2>
            <p
              data-story
              className="mt-8 max-w-xl text-2xl leading-relaxed font-medium text-foreground/85"
            >
              <i className="text-muted-foreground">
                {
                  '"Passion will make you crazy, but is there any other way to live?"'
                }
              </i>
              {" Howard Hughes."}
              <br /> <br />
              {
                "Бид өөрсдөө зохион бүтээлчид, урлагт дурлагсад тул таны хэрэгцээ шаардлага хэрхэн үүсч байгааг бид ойлгож байна."
              }
            </p>
          </div>
          <div data-doodle>
            <Doodle
              name="loving"
              className="mx-auto w-full max-w-60 sm:max-w-md"
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
