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
import { db } from "../../lib/db";
import { getStoreProfile, initializeStoreProfile } from "../../lib/store";
import {
  isSupabaseConfigured,
  signInWithGoogle,
  supabase,
} from "../../lib/supabase";

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingStore, setIsCheckingStore] = useState(true);
  const [hasLocalStore, setHasLocalStore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkStoreAndCloud() {
      try {
        // 1. Cek jika sudah punya toko lokal di IndexedDB
        const local = await getStoreProfile();
        if (local?.isOnboarded && local?.name) {
          setHasLocalStore(true);
          router.replace("/pos");
          return;
        }

        // 2. Cek jika sudah terhubung ke sesi Google Auth
        if (isSupabaseConfigured()) {
          try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            if (token) {
              setIsLoggingIn(true);
              const res = await fetch("/api/sync/hydrate", {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (res.ok) {
                const resJson = await res.json();
                if (resJson.data?.storeProfile) {
                  // Toko ditemukan di cloud, hydrate langsung ke IndexedDB!
                  await db.store_profile.put(resJson.data.storeProfile);
                  if (Array.isArray(resJson.data.transactions)) {
                    for (const tx of resJson.data.transactions) {
                      await db.transactions.put(tx);
                    }
                  }
                  localStorage.setItem("KalaPOS_onboarding", "true");
                  localStorage.setItem(
                    "KalaPOS_business_name",
                    resJson.data.storeProfile.name,
                  );
                  router.replace("/pos");
                  return;
                }

                // Akun Google baru (belum punya toko di cloud) -> otomatis ke Step 2
                setStep(2);
              }
            }
          } catch (err) {
            console.error("Gagal memeriksa toko di cloud:", err);
          } finally {
            setIsLoggingIn(false);
          }
        }
      } finally {
        setIsCheckingStore(false);
      }
    }

    checkStoreAndCloud();
  }, [router]);

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

  if (isCheckingStore) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/60 font-sans text-slate-900">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-bold tracking-wider text-white shadow-xl shadow-slate-900/10">
            K
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <p className="text-sm font-semibold text-slate-800">
                Memeriksa data toko lokal...
              </p>
            </div>
            <p className="font-mono text-xs text-slate-500">
              Menyiapkan database kasir offline-first
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-xs font-bold tracking-wider text-white transition-transform duration-200 group-hover:scale-105">
              K
            </div>
            <span className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900">
              KalaPOS
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700">
                Setup Toko
              </span>
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
