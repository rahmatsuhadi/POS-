"use client";

import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { BrandLogo } from "../BrandLogo";

interface StepWelcomeProps {
  onNext: () => void;
  onGoogleLogin?: () => void;
  isLoggingIn?: boolean;
}

export function StepWelcome({
  onNext,
  onGoogleLogin,
  isLoggingIn = false,
}: StepWelcomeProps) {
  return (
    <div className="py-2 text-center sm:py-4">
      <div className="mx-auto mb-5 flex items-center justify-center">
        <BrandLogo />
      </div>

      <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Selamat Datang di KalaPOS
      </h2>

      <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
        Aplikasi kasir offline-first &amp; manajemen usaha modern. Catat
        transaksi secepat kilat, cetak struk Bluetooth, dan kirim nota via
        WhatsApp.
      </p>

      <div className="mx-auto mb-8 flex max-w-lg flex-wrap justify-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-xs sm:gap-5">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 sm:text-sm">
          <CheckCircleIcon
            size={18}
            weight="fill"
            className="shrink-0 text-emerald-600"
          />
          <span>Kasir Kilat &amp; Struk Instan</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 sm:text-sm">
          <CheckCircleIcon
            size={18}
            weight="fill"
            className="shrink-0 text-emerald-600"
          />
          <span>100% Kebal Offline</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 sm:text-sm">
          <CheckCircleIcon
            size={18}
            weight="fill"
            className="shrink-0 text-emerald-600"
          />
          <span>Mode Solo &amp; Tim Ber-PIN</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mx-auto flex w-full max-w-md cursor-pointer items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-emerald-600/40 active:scale-[0.99]"
      >
        <span>Mulai Setup Toko Baru</span>
        <ArrowRightIcon size={16} weight="bold" />
      </button>

      <div className="relative mx-auto my-5 flex w-full max-w-md items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Atau
        </span>
      </div>

      {onGoogleLogin && (
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={isLoggingIn}
          className="mx-auto flex w-full max-w-md cursor-pointer items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingIn ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <title>Google</title>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>
            {isLoggingIn
              ? "Menghubungkan ke Cloud..."
              : "Sudah Punya Toko? Masuk dengan Google"}
          </span>
        </button>
      )}

      <div className="mt-4 font-mono text-xs text-slate-400">
        Siapkan profil usaha Anda dalam waktu kurang dari 1 menit.
      </div>
    </div>
  );
}
