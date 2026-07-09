import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { ProblemSection } from "@/app/components/ProblemSection";
import { PlatformTabs } from "@/app/components/PlatformTabs";
import { SolutionsByRole } from "@/app/components/SolutionsByRole";
import { CognitiveRewardsSection } from "@/app/components/CognitiveRewardsSection";
import { TwentyThirdSection } from "@/app/components/TwentyThirdSection";
import { AdvantageSection } from "@/app/components/AdvantageSection";
import { ResearchSection } from "@/app/components/ResearchSection";
import { PricingTeaser } from "@/app/components/PricingTeaser";
import { FinalCTA } from "@/app/components/FinalCTA";
import { SiteFooter } from "@/app/components/SiteFooter";

type PageProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  // Opt into static rendering (sections use useTranslations server-side).
  setRequestLocale(locale as AppLocale);
  return (
    <>
      <div className="page-bg" />
      <Header />
      <Hero />
      <CognitiveRewardsSection />
      <TwentyThirdSection />
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
