"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { initializeStoreProfile } from "../../lib/store";
import { signInWithGoogle } from "../../lib/supabase";
import { StepConfig, type StepConfigFormData } from "./StepConfig";
import { StepWelcome } from "./StepWelcome";

export function OnboardingCard() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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

  return (
    <section className="relative w-full max-w-[600px] rounded-lg border border-slate-200/90 bg-white/95 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur-sm sm:p-10">
      {step === 1 ? (
        <StepWelcome
          onNext={() => setStep(2)}
          onGoogleLogin={handleGoogleLogin}
          isLoggingIn={isLoggingIn}
        />
      ) : (
        <StepConfig onBack={() => setStep(1)} onSubmit={handleConfigSubmit} />
      )}
    </section>
  );
}
