import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { PlatformTabs } from "./components/PlatformTabs";
import { SolutionsByRole } from "./components/SolutionsByRole";
import { AdvantageSection } from "./components/AdvantageSection";
import { ResearchSection } from "./components/ResearchSection";
import { PricingTeaser } from "./components/PricingTeaser";
import { FinalCTA } from "./components/FinalCTA";
import { SiteFooter } from "./components/SiteFooter";

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
