"use client";

import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="py-2 text-center sm:py-4">
      {/* Brand Emblem matching Landing TopNav */}
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-extrabold text-white shadow-xl shadow-slate-900/10">
        K
      </div>

      {/* Brand Title */}
      <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Selamat Datang di KalaPOS
      </h2>

      {/* Brand Tagline */}
      <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
        Aplikasi kasir offline-first &amp; manajemen usaha modern. Catat
        transaksi secepat kilat, cetak struk Bluetooth, dan kirim nota via
        WhatsApp.
      </p>

      {/* Brand Highlights Box */}
      <div className="mx-auto mb-8 flex max-w-lg flex-wrap justify-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-xs sm:gap-5">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 sm:text-sm">
          <CheckCircle
            size={18}
            weight="fill"
            className="shrink-0 text-emerald-600"
          />
          <span>Kasir Kilat &amp; Struk Instan</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 sm:text-sm">
          <CheckCircle
            size={18}
            weight="fill"
            className="shrink-0 text-emerald-600"
          />
          <span>100% Kebal Offline</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 sm:text-sm">
          <CheckCircle
            size={18}
            weight="fill"
            className="shrink-0 text-emerald-600"
          />
          <span>Mode Solo &amp; Tim Ber-PIN</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onNext}
        className="mx-auto flex w-full max-w-md cursor-pointer items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-emerald-600/40 active:scale-[0.99]"
      >
        <span>Mulai Setup Sekarang</span>
        <ArrowRight size={16} weight="bold" />
      </button>

      {/* Footer Note */}
      <div className="mt-4 font-mono text-xs text-slate-400">
        Siapkan profil usaha Anda dalam waktu kurang dari 1 menit.
      </div>
    </div>
  );
}
