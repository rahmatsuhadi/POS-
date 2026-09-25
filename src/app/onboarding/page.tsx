import { TopNav } from "@/components/landing/TopNav";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";

export default function OnboardingPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50/60 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/2 -z-10 h-[350px] w-[850px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[170px]" />

      <TopNav menu={false} maxWidth="max-w-4xl" />

      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-16">
        <OnboardingCard />
      </main>

      <footer className="py-4 text-center font-mono text-xs text-slate-500">
        KalaPOS POS · Sistem Offline-First POS
      </footer>
    </div>
  );
}
