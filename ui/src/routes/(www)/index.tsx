import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CallToAction } from "./-components/cta";
import { Faq } from "./-components/faq";
import { ByCreators } from "./-components/home/by-creators";
import { Earnings } from "./-components/home/earnings";
import { Hero } from "./-components/home/hero";
import { homeFaqs } from "./-components/home/home-faqs";
import { HowItWorks } from "./-components/home/how-it-works";
import { homeMarqueeRows } from "./-components/home/marquee-rows";
import { PassionWall } from "./-components/home/passion-wall";
import { Marquee } from "./-components/marquee";

export const Route = createFileRoute("/(www)/")({
  head: () => seo({ path: "/" }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Marquee
        rows={homeMarqueeRows}
        className="relative z-10 -mt-(--seam) bg-[linear-gradient(transparent_var(--seam),var(--color-flame)_var(--seam))] [--seam:2.25rem] sm:[--seam:2.75rem] lg:[--seam:3.5rem] xl:[--seam:4rem]"
      />
      <HowItWorks />
      <PassionWall />
      <Earnings />
      <ByCreators />
      <Faq items={homeFaqs} />
      <CallToAction />
    </>
  );
}
