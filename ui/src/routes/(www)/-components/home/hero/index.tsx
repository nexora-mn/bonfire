import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useRef } from "react";
import { Container } from "@/components/container";
import { Doodle, type DoodleName } from "@/components/doodle";
import { buttonVariants } from "@/components/ui/button";
import { MOTION_OK } from "@/lib/constants";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Campfire } from "./campfire";

// Phones keep the two campers nearest the fire.
const campers: { doodle: DoodleName; className: string }[] = [
  {
    doodle: "sitting-reading",
    className: "hidden sm:block left-[3%] bottom-[2%] w-[22%]",
  },
  {
    doodle: "doggie",
    className: "left-[-6%] bottom-0 w-[46%] sm:left-[22%] sm:w-[19%]",
  },
  {
    doodle: "meditating",
    className: "hidden sm:block right-[22%] bottom-[3%] w-[18%]",
  },
  {
    doodle: "chilling",
    className: "right-[-8%] bottom-0 w-[50%] sm:right-[2%] sm:w-[23%]",
  },
];

const sparks = ["+5,000₮", "+10,000₮", "+2,000₮", "+20,000₮", "+3,000₮"];

export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = scope.current?.querySelector("h1");
      const scene = scope.current?.querySelector<HTMLElement>("[data-scene]");
      if (!heading || !scene) return;
      const mm = gsap.matchMedia(scope);

      mm.add(MOTION_OK, () => {
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
              stagger: 0.08,
              delay: 0.2,
            });
          },
        });

        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(
            "[data-intro='fire']",
            { scale: 0, transformOrigin: "50% 100%" },
            { scale: 1, autoAlpha: 1, duration: 1, ease: "back.out(1.7)" },
            0,
          )
          .fromTo(
            "[data-intro='glow']",
            { scaleX: 0.3, scaleY: 0, transformOrigin: "50% 100%" },
            { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: 1.6 },
            0.1,
          )
          .fromTo(
            "[data-intro='copy']",
            { y: 24 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
            0.5,
          )
          .fromTo(
            "[data-intro='camper']",
            { y: 40 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1.2,
              stagger: { each: 0.12, from: "center" },
            },
            0.6,
          )
          .to(
            "[data-intro='glow']",
            {
              opacity: 0.82,
              duration: 2.2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            },
            1.7,
          );

        for (const flame of gsap.utils.toArray<SVGPathElement>(
          "[data-flame]",
        )) {
          gsap.to(flame, {
            scaleY: () => gsap.utils.random(0.9, 1.08),
            scaleX: () => gsap.utils.random(0.94, 1.04),
            skewX: () => gsap.utils.random(-4, 4),
            svgOrigin: "16 23",
            duration: () => gsap.utils.random(0.14, 0.3),
            ease: "sine.inOut",
            repeat: -1,
            repeatRefresh: true,
          });
        }

        // Supports rise off the fire like sparks; distances are re-read
        // every cycle so they follow the scene's responsive size.
        gsap.utils.toArray<HTMLElement>("[data-spark]").forEach((spark, i) => {
          gsap
            .timeline({
              repeat: -1,
              repeatRefresh: true,
              repeatDelay: 2.4,
              delay: 1.6 + i * 1.1,
            })
            .fromTo(
              spark,
              { x: 0, y: 0, scale: 0.5 },
              {
                x: () => gsap.utils.random(-0.22, 0.22) * scene.offsetWidth,
                y: () => -0.4 * scene.offsetHeight,
                scale: 1,
                duration: 3.2,
                ease: "power1.out",
              },
            )
            .fromTo(spark, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0)
            .to(spark, { autoAlpha: 0, duration: 0.8 }, 2.4);
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative isolate overflow-hidden pt-32 pb-14 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 xl:pb-24"
    >
      <Container className="relative z-10 flex flex-col items-center text-center">
        <h1 data-intro="heading" className="display-1 max-w-4xl">
          {"Let it burn and earn"}
        </h1>
        <p
          data-intro="copy"
          className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl"
        >
          <i>
            {
              '"One person with passion is better than forty people merely interested."'
            }
          </i>
          {" - E. M. Forster"}
        </p>
        <Link
          to="/signup"
          data-intro="copy"
          className={cn(buttonVariants({ size: "lg" }), "mt-8")}
        >
          {"Үнэгүй эхлэх"}
        </Link>
      </Container>

      <div
        data-scene
        aria-hidden="true"
        className="relative mx-auto mt-6 aspect-4/3 w-full max-w-6xl sm:-mt-6 sm:aspect-2/1 lg:-mt-28 lg:aspect-5/2"
      >
        <div
          data-intro="glow"
          className="absolute inset-x-[-40%] -bottom-14 h-full sm:inset-x-[-12%] sm:-bottom-16 lg:-bottom-20 xl:-bottom-24"
          style={{
            background:
              "radial-gradient(ellipse 50% 100% at 50% 100%, var(--color-cream) 0%, var(--color-spark) 24%, var(--color-flame) 48%, color-mix(in oklch, var(--color-flame) 35%, transparent) 72%, transparent 100%)",
          }}
        />
        {campers.map((camper) => (
          <div
            key={camper.doodle}
            data-intro="camper"
            className={cn("absolute", camper.className)}
          >
            <Doodle name={camper.doodle} priority className="w-full" />
          </div>
        ))}
        <div
          data-intro="fire"
          className="absolute bottom-[6%] left-[39%] w-[22%] sm:left-[43.5%] sm:w-[13%]"
        >
          <Campfire className="w-full" />
        </div>
        {sparks.map((spark) => (
          <span
            key={spark}
            data-spark
            className="invisible absolute bottom-[34%] left-1/2 -ml-10 w-20 rounded-full bg-ink py-1 text-center text-sm font-bold text-cream opacity-0 shadow-lg"
          >
            {spark}
          </span>
        ))}
      </div>
    </section>
  );
}
