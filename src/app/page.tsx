"use client";

import { useGSAP } from "@gsap/react";
import { ArrowRight, CloudCheck, Coins, Lightning, LockKey, Package, Receipt, Scissors, ShieldCheck, Storefront, WhatsappLogo, WifiSlash } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AboutSection } from "../components/landing/AboutSection";
import { DeviceShowcase } from "../components/landing/DeviceShowcase";
import { FaqSection } from "../components/landing/FaqSection";
import { FeaturesGrid } from "../components/landing/FeaturesGrid";
import { FooterStrip } from "../components/landing/FooterStrip";
import { TopNav } from "../components/landing/TopNav";
import { WorkflowSection } from "../components/landing/WorkflowSection";
import { getStoreProfile } from "../lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStoreProfile().then((profile) => {
      if (profile?.isOnboarded) {
        setIsOnboarded(true);
      }
    });
  }, []);

  useGSAP(
    () => {
      if (!heroRef.current) return;

      gsap.fromTo(
        ".hero-element",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        },
      );
    },
    { scope: heroRef },
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Floating Pill Nav */}
      <TopNav isOnboarded={isOnboarded} />

      {/* Main Content wrapper with overflow protection */}
      <main id="content" className="w-full max-w-full flex-1 overflow-x-hidden pt-28">
        {/* 1. HERO SECTION (Cinematic Center + Inline Typography Asset + Floating Ornaments) */}
        <section ref={heroRef} className="relative flex flex-col items-center justify-center overflow-hidden border-b border-slate-200/80 bg-white py-20 md:py-32">
          {/* Ambient Background Grid Pattern & Radial Glow Orbs */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[550px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[150px]" />
          <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[350px] w-[950px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[170px]" />

          {/* Background Decorative Rings */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10 opacity-60" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/40 opacity-40" />

          <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
            {/* Headline with 2-line Iron Rule & Real POS Cashier Unsplash Pill */}
            <h1 className="hero-element mx-auto mb-6 max-w-5xl text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Aplikasi kasir pintar
              <span
                className="mx-2 inline-block h-10 w-28 rounded-full border-2 border-emerald-500/40 bg-cover bg-center align-middle shadow-xl ring-4 shadow-emerald-600/15 ring-emerald-500/10 transition-all duration-300 hover:scale-105 sm:mx-3 sm:h-13 sm:w-40 lg:h-15 lg:w-48"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop')",
                }}
              />
              yang tetap ngebut saat internet mati total.
            </h1>

            {/* Subtitle / Lead */}
            <p className="hero-element mx-auto mb-8 max-w-2xl text-base leading-relaxed font-normal text-slate-600 sm:text-xl">
              Catat transaksi secepat kilat di HP, tablet, atau laptop. Kirim nota resmi ke <strong className="font-semibold text-slate-900">WhatsApp</strong>, cetak struk Bluetooth, dan auto-sync ke <strong className="font-semibold text-slate-900">Cloud</strong> begitu online. Tanpa biaya langganan bulanan.
            </p>

            {/* High-Contrast CTAs */}
            <div className="hero-element mb-5 flex flex-wrap items-center justify-center gap-4">
              <Link href="/onboarding" className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-emerald-600/40">
                <span>{isOnboarded ? "Atur Ulang Toko" : "Mulai Jualan Gratis"}</span>
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/pos" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-slate-50">
                <Lightning size={16} weight="fill" className="text-emerald-600" />
                <span>Coba Demo Kasir</span>
              </Link>
            </div>

            {/* Microcopy Trust Badge */}
            <p className="hero-element mb-16 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500 sm:gap-4">
              <span>✓ Buka langsung di browser</span>
              <span className="text-slate-300">•</span>
              <span>Data tersimpan aman di perangkat</span>
              <span className="text-slate-300">•</span>
              <span>Rp 0 selamanya</span>
            </p>

            {/* Interactive Responsive Device Showcase */}
            <div className="hero-element w-full">
              <DeviceShowcase />
            </div>
          </div>
        </section>

        {/* 2. INFINITE MARQUEE STRIP (Trust & Capability Ticker) */}
        <section className="overflow-hidden border-b border-slate-200/80 bg-slate-100/90 py-6">
          <div className="animate-marquee flex items-center gap-12 font-mono text-xs font-semibold tracking-widest whitespace-nowrap text-slate-600 uppercase">
            {/* Set 1 */}
            <span className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-600" />
              100% Kebal Offline (IndexedDB)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <CloudCheck size={18} className="text-emerald-600" />
              Auto-Sync Cloud Tanpa Data Hilang
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <WhatsappLogo size={18} className="text-emerald-600" />
              Kirim Nota WhatsApp &amp; Download PDF
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <Receipt size={18} className="text-emerald-600" />
              Support Printer Thermal Bluetooth
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <Storefront size={18} className="text-emerald-600" />
              Cocok untuk Ritel, Warung &amp; Jasa
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <LockKey size={18} className="text-emerald-600" />
              Proteksi PIN Khusus Owner
            </span>
            <span className="text-slate-300">•</span>

            {/* Set 2 (Identical duplicate for seamless looping) */}
            <span className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-600" />
              100% Kebal Offline (IndexedDB)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <CloudCheck size={18} className="text-emerald-600" />
              Auto-Sync Cloud Tanpa Data Hilang
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <WhatsappLogo size={18} className="text-emerald-600" />
              Kirim Nota WhatsApp &amp; Download PDF
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <Receipt size={18} className="text-emerald-600" />
              Support Printer Thermal Bluetooth
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <Storefront size={18} className="text-emerald-600" />
              Cocok untuk Ritel, Warung &amp; Jasa
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2.5">
              <LockKey size={18} className="text-emerald-600" />
              Proteksi PIN Khusus Owner
            </span>
            <span className="text-slate-300">•</span>
          </div>
        </section>

        {/* 2.5 REAL PROBLEM / PAIN POINT SECTION */}
        <section className="border-b border-slate-200/80 bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">Kasir modern seharusnya bikin jualan tenang, bukan bikin panik saat listrik padam.</h2>
              <p className="text-base leading-relaxed font-normal text-slate-600 sm:text-lg">Banyak aplikasi kasir mendadak macet saat sinyal drop, menagih sewa bulanan mahal, atau memaksa form inventori rumit padahal usahamu hanya menjual layanan jasa.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 font-bold text-amber-600">
                  <WifiSlash size={22} weight="bold" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sinyal lemot bukan alasan kasir berhenti</h3>
                <p className="text-sm leading-relaxed text-slate-600">Jualan di ruko semi-basement atau bazar outdoor sering terkendala sinyal. KalaPOS mencatat transaksi langsung di memori perangkat dengan respon &lt; 150 ms tanpa antrean menumpuk.</p>
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 font-bold text-rose-600">
                  <Coins size={22} weight="bold" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bebas dari beban biaya sewa bulanan</h3>
                <p className="text-sm leading-relaxed text-slate-600">Usaha mikro yang baru merintis tidak seharusnya terbebani sewa ratusan ribu per bulan atau potongan komisi per transaksi. Nikmati seluruh fitur kasir esensial secara gratis.</p>
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 font-bold text-emerald-600">
                  <Storefront size={22} weight="bold" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bebas dari form stok yang kaku</h3>
                <p className="text-sm leading-relaxed text-slate-600">Pangkas rambut, laundry, servis, dan fotografi tidak butuh form stok gudang yang rumit. Cukup matikan saklar stok dengan 1 klik, dan kamu bisa langsung mulai jualan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2.8 AUDIENCE & PERSONA SEGMENTATION SECTION */}
        <section id="audience" className="border-b border-slate-200/80 bg-slate-50/70 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                <span>SOLUSI SEGALA USAHA</span>
              </div>
              <h2 className="mb-4 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">Cocok untuk apapun model usahamu.</h2>
              <p className="text-base leading-relaxed font-normal text-slate-600 sm:text-lg">Dirancang fleksibel untuk freelancer mandiri, toko kelontong, hingga barbershop dan kafe dengan banyak staf.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Persona 1: Ritel */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-600 transition-transform group-hover:scale-110">
                    <Package size={24} weight="bold" />
                  </div>
                  <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 font-mono text-xs font-bold text-teal-700">WARUNG &amp; RITEL</span>
                  <h3 className="mt-4 mb-2 text-xl font-bold text-slate-900">Toko Kelontong &amp; Produk Fisik</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Pelacakan sisa stok berkurang otomatis saat terjual, dukungan scan barcode via kamera HP, dan tombol uang pas untuk melayani pembeli secepat kilat.</p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-teal-800">Fitur: Auto potong stok · Scan barcode · Struk thermal</div>
              </div>

              {/* Persona 2: Jasa */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                    <Scissors size={24} weight="bold" />
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700">JASA &amp; FREELANCE</span>
                  <h3 className="mt-4 mb-2 text-xl font-bold text-slate-900">Barbershop, Laundry &amp; Servis</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Matikan saklar stok dengan 1 klik agar layanan jasa bisa ditransaksikan tanpa batas kuota. Langsung bagikan nota invoice resmi via WhatsApp pelanggan.</p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-emerald-800">Fitur: Toggle stok off · Nota WhatsApp · Invoice PDF</div>
              </div>

              {/* Persona 3: Hybrid & Bisnis */}
              <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 transition-transform group-hover:scale-110">
                    <LockKey size={24} weight="bold" />
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">HYBRID &amp; TIM</span>
                  <h3 className="mt-4 mb-2 text-xl font-bold text-slate-900">Kafe &amp; Toko dengan Karyawan</h3>
                  <p className="text-sm leading-relaxed text-slate-600">Gabungkan produk fisik dan jasa dalam satu layar. Aktifkan Mode Bisnis ber-PIN agar staf kasir tidak bisa mengintip laporan profit dan pengaturan toko.</p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">Fitur: Mode Bisnis · PIN Owner · Rekap omzet offline</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTEREST: GAPLESS BENTO GRID FEATURES */}
        <FeaturesGrid />

        {/* 4. DESIRE: WORKFLOW & PINNED SCROLL */}
        <WorkflowSection />

        {/* 5. ABOUT & STATS */}
        <AboutSection />

        {/* 6. FAQ ACCORDION SECTION */}
        <FaqSection />
      </main>

      {/* Closing CTA & Footer */}
      <FooterStrip isOnboarded={isOnboarded} />
    </div>
  );
}
