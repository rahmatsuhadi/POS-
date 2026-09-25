"use client";

import { ArrowRightIcon, LightningIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { BrandLogo } from "../BrandLogo";

export function FooterStrip() {
  return (
    <>
      <section className="relative overflow-hidden border-t border-slate-200/80 bg-slate-50/80 py-32 text-center md:py-48">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-6 text-3xl leading-[1.08] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Mulai layani pembeli pertamamu dalam waktu kurang dari 60 detik.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed font-normal text-slate-600 sm:text-xl">
            Buka lewat browser HP atau laptop, atur nama tokomu, dan kasir
            langsung aktif. 100% gratis tanpa syarat kartu kredit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-emerald-600/40"
            >
              <span>Buka Kasir Sekarang — Gratis</span>
              <ArrowRightIcon
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/pos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
            >
              <LightningIcon
                size={16}
                weight="fill"
                className="text-emerald-600"
              />
              <span>Coba Demo Kasir</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo />
              <span className="font-bold text-xl text-white">KalaPOS</span>
            </Link>

            <div className="flex flex-wrap gap-8 font-medium text-slate-400">
              <Link href="/pos" className="transition-colors hover:text-white">
                Layar Kasir POS
              </Link>

              <Link
                href="/onboarding"
                className="transition-colors hover:text-white"
              >
                Pengaturan Awal
              </Link>
              <a
                href="#features"
                className="transition-colors hover:text-white"
              >
                Fitur Utama
              </a>
              <a
                href="#audience"
                className="transition-colors hover:text-white"
              >
                Untuk Siapa
              </a>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-white"
              >
                Alur Kerja
              </a>
              <a href="#faq" className="transition-colors hover:text-white">
                FAQ
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
            <span>© 2026 KalaPOS</span>
          </div>
        </div>
      </footer>
    </>
  );
}
