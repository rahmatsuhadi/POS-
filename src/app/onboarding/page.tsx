"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  StepConfig,
  type StepConfigFormData,
} from "../../components/onboarding/StepConfig";
import { StepWelcome } from "../../components/onboarding/StepWelcome";
import { getStoreProfile, initializeStoreProfile } from "../../lib/store";
import {
  isSupabaseConfigured,
  signInWithGoogle,
  supabase,
} from "../../lib/supabase";
import { BrandLogo } from "@/components/BrandLogo";

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // const [isCheckingStore, setIsCheckingStore] = useState(true);
  const [hasLocalStore, setHasLocalStore] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      await signInWithGoogle(`${origin}/onboarding`);
    } catch (err) {
      console.error("Gagal login Google:", err);
      setIsLoggingIn(false);
    }
  };

  const handleConfigSubmit = async (formData: StepConfigFormData) => {
    await initializeStoreProfile({
      businessName: formData.businessName,
      mode: formData.mode,
      adminPin: formData.adminPin,
      businessType: formData.businessType,
    });

    router.push("/pos");
  };

  // if (isCheckingStore) return <Loading />

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50/60 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Background Grid Pattern & Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/2 -z-10 h-[350px] w-[850px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[170px]" />

      {/* Floating Pill Nav Header */}
      <header className="fixed inset-x-0 top-5 z-50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-full border border-slate-200/80 bg-white/80 px-5 py-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <Link href="/" className="group flex items-center gap-3">
            <BrandLogo />
            <span className="flex items-center gap-3 text-sm font-bold tracking-tight text-slate-900">
              KalaPOS
            </span>
          </Link>

          {hasLocalStore && (
            <Link
              href="/pos"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200/60 hover:text-slate-900"
            >
              <span>Langsung ke Kasir</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Onboarding Wrapper Card */}
      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-16">
        <section className="relative w-full max-w-[600px] rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur-sm sm:p-10">
          {step === 1 ? (
            <StepWelcome
              onNext={() => setStep(2)}
              onGoogleLogin={handleGoogleLogin}
              isLoggingIn={isLoggingIn}
            />
          ) : (
            <StepConfig
              onBack={() => setStep(1)}
              onSubmit={handleConfigSubmit}
            />
          )}
        </section>
      </main>

      {/* Footer Bottom Note */}
      <footer className="py-4 text-center font-mono text-xs text-slate-500">
        KalaPOS POS · Sistem Offline-First POS
      </footer>
    </div>
  );
}
