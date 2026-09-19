"use client";

import { useGSAP } from "@gsap/react";
import {
  CheckCircle,
  Gear,
  ShoppingCart,
  Storefront,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function WorkflowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !leftPinRef.current) return;

      const steps = containerRef.current.querySelectorAll(".workflow-step");

      gsap.fromTo(
        steps,
        { opacity: 0.2, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-32 md:py-48 bg-slate-50/80 border-t border-slate-200/80 relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Pinned Left Header */}
          <div ref={leftPinRef} className="lg:col-span-5 lg:sticky lg:top-32">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Mulai berjualan dalam 3 langkah ringkas.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-normal mb-8">
              Tanpa verifikasi dokumen berbelit, tanpa proses instalasi lama.
              Buka di browser, masukkan produkmu, dan kasir langsung siap
              menerima pembeli.
            </p>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 font-mono text-xs text-emerald-700 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} weight="fill" />
                <span>Tanpa instalasi APK / App Store</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} weight="fill" />
                <span>Siap untuk Tablet, Laptop &amp; HP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} weight="fill" />
                <span>100% Offline &amp; Auto-Backup Cloud</span>
              </div>
            </div>
          </div>

          {/* Right Scrolling Workflow Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1 */}
            <div className="workflow-step p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  <Storefront size={24} weight="bold" />
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                  01 / SETUP 60 DETIK
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Tentukan Nama &amp; Mode Toko
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Buka lewat browser HP atau laptop, ketik nama usahamu, lalu
                pilih Mode Solo (untuk usaha mandiri) atau Mode Bisnis (dengan
                proteksi PIN jika punya karyawan).
              </p>
            </div>

            {/* Step 2 */}
            <div className="workflow-step p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center font-bold text-lg">
                  <Gear size={24} weight="bold" />
                </div>
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full">
                  02 / KATALOG FLEKSIBEL
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Atur Menu, Produk, atau Layanan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manfaatkan preset kategori bawaan untuk makanan, ritel, atau
                jasa. Tentukan harga jual dan aktifkan saklar stok hanya untuk
                barang fisik.
              </p>
            </div>

            {/* Step 3 */}
            <div className="workflow-step p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  <ShoppingCart size={24} weight="bold" />
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                  03 / SIAP JUALAN
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Buka Layar Kasir &amp; Layani Pembeli
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kasir siap melayani pembeli di HP, tablet, maupun laptop. Hitung
                kembalian instan, terima uang tunai/transfer/QRIS, lalu bagikan
                nota via WhatsApp atau cetak thermal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
