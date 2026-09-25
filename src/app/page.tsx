import { AboutSection } from "../components/landing/AboutSection";
import { AudienceSection } from "../components/landing/AudienceSection";
import { FaqSection } from "../components/landing/FaqSection";
import { FeaturesGrid } from "../components/landing/FeaturesGrid";
import { FooterStrip } from "../components/landing/FooterStrip";
import { HeroSection } from "../components/landing/HeroSection";
import { MarqueeStrip } from "../components/landing/MarqueeStrip";
import { ProblemSection } from "../components/landing/ProblemSection";
import { TopNav } from "../components/landing/TopNav";
import { WorkflowSection } from "../components/landing/WorkflowSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <TopNav />

      <main
        id="content"
        className="w-full max-w-full flex-1 overflow-x-hidden pt-28"
      >
        <HeroSection />
        <MarqueeStrip />
        <ProblemSection />
        <AudienceSection />
        <FeaturesGrid />
        <WorkflowSection />
        <AboutSection />
        <FaqSection />
      </main>

      <FooterStrip />
    </div>
  );
}
