"use client";

import { ArrowRightIcon, LightningIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { DeviceShowcase } from "./DeviceShowcase";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden border-b border-slate-200/80 bg-white py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[550px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[350px] w-[950px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[170px]" />

      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10 opacity-60" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/40 opacity-40" />

      <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <h1 className="mx-auto mb-6 max-w-5xl text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Aplikasi kasir pintar
          <span
            className="mx-2 inline-block h-10 w-28 rounded-full border-2 border-emerald-500/40 bg-cover bg-center align-middle shadow-xl ring-4 shadow-emerald-600/15 ring-emerald-500/10 transition-all duration-300 hover:scale-105 sm:mx-3 sm:h-13 sm:w-40 lg:h-15 lg:w-48"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop')",
            }}
          />
          yang tetap ngebut saat internet mati total.
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed font-normal text-slate-600 sm:text-xl">
          Catat transaksi secepat kilat di HP, tablet, atau laptop. Kirim nota
          resmi ke{" "}
          <strong className="font-semibold text-slate-900">WhatsApp</strong>,
          cetak struk Bluetooth, dan auto-sync ke{" "}
          <strong className="font-semibold text-slate-900">Cloud</strong> begitu
          online. Tanpa biaya langganan bulanan.
        </p>

        <div className="mb-5 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/onboarding"
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-emerald-600/40"
          >
            <span>Mulai Jualan Gratis</span>
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

        <p className="mb-16 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:gap-4">
          <span>✓ Buka langsung di browser</span>
          <span className="text-slate-300">•</span>
          <span>Data tersimpan aman di perangkat</span>
          <span className="text-slate-300">•</span>
          <span>Rp 0 selamanya</span>
        </p>

        <div className="w-full">
          <DeviceShowcase />
        </div>
      </div>
    </section>
  );
}
