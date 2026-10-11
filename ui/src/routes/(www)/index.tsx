import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CallToAction } from "./-components/cta";
import { Faq } from "./-components/faq";
import { ByCreators } from "./-components/home/by-creators";
import { Earnings } from "./-components/home/earnings";
import { Hero } from "./-components/home/hero";
import { homeFaqs } from "./-components/home/home-faqs";
import { HowItWorks } from "./-components/home/how-it-works";
import { PassionWall } from "./-components/home/passion-wall";
import { Marquee } from "./-components/marquee";
import { homeMarqueeRows } from "./-components/home/marquee-rows";

export const Route = createFileRoute("/(www)/")({
  head: () => seo({ path: "/" }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PassionWall />
      <Earnings />
      <ByCreators />
      <Faq items={homeFaqs} />
      <Marquee rows={homeMarqueeRows} />
      <CallToAction />
    </>
  );
}
