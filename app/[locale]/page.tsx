import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { ProblemSection } from "@/app/components/ProblemSection";
import { PlatformTabs } from "@/app/components/PlatformTabs";
import { SolutionsByRole } from "@/app/components/SolutionsByRole";
import { AdvantageSection } from "@/app/components/AdvantageSection";
import { ResearchSection } from "@/app/components/ResearchSection";
import { PricingTeaser } from "@/app/components/PricingTeaser";
import { FinalCTA } from "@/app/components/FinalCTA";
import { SiteFooter } from "@/app/components/SiteFooter";

export default function Home() {
  return (
    <>
      <div className="page-bg" />
      <Header />
      <Hero />
      <ProblemSection />
      <PlatformTabs />
      <SolutionsByRole />
      <AdvantageSection />
      <ResearchSection />
      <PricingTeaser />
      <FinalCTA />
      <SiteFooter />
    </>
  );
}
