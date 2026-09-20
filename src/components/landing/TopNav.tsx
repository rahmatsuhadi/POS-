"use client";

import { ArrowRight, Lightning } from "@phosphor-icons/react";
import Link from "next/link";

interface TopNavProps {
  isOnboarded?: boolean;
}

export function TopNav({ isOnboarded = false }: TopNavProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-5 z-50 px-4 sm:px-6">
      <div className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between rounded-full border border-slate-200/80 bg-white/80 px-5 py-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:border-slate-300">
        {/* Brand logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-xs font-bold tracking-wider text-white transition-transform duration-200 group-hover:scale-105">
            K
          </div>
          <span className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-slate-900">
            KalaPOS
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden items-center gap-8 text-xs font-semibold text-slate-600 md:flex">
          <a
            href="#features"
            className="transition-colors duration-200 hover:text-emerald-700"
          >
            Fitur
          </a>
          <a
            href="#audience"
            className="transition-colors duration-200 hover:text-emerald-700"
          >
            Untuk Siapa
          </a>
          <a
            href="#how-it-works"
            className="transition-colors duration-200 hover:text-emerald-700"
          >
            Alur Kerja
          </a>
          <a
            href="#about"
            className="transition-colors duration-200 hover:text-emerald-700"
          >
            Keunggulan
          </a>
          <a
            href="#faq"
            className="transition-colors duration-200 hover:text-emerald-700"
          >
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/pos"
            className="hidden items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200/60 hover:text-slate-900 sm:inline-flex"
          >
            <Lightning size={13} weight="fill" className="text-emerald-600" />
            <span>Coba Demo</span>
          </Link>

          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-600/30"
          >
            <span>{isOnboarded ? "Atur Toko" : "Mulai Gratis"}</span>
            <ArrowRight size={12} weight="bold" />
          </Link>
        </div>
      </div>
    </header>
  );
}
