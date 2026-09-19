"use client";

import { useGSAP } from "@gsap/react";
import {
  Clock,
  CloudCheck,
  CreditCard,
  Lightning,
  LockKey,
  Package,
  WhatsappLogo,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function FeaturesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll(".bento-card");
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      id="features"
      className="py-32 md:py-48 bg-[#f8fafc] border-t border-slate-200/80 relative"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Semua yang kamu butuhkan untuk melayani pembeli lebih cepat.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Dirancang khusus untuk operasional harian toko ritel, warung, hingga
            penyedia jasa mandiri tanpa kerumitan sistem kasir konvensional.
          </p>
        </div>

        {/* 5-Card Mathematically Perfect Gapless Bento Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-12 grid-flow-dense gap-6"
        >
          {/* Bento 1: Hero Feature (Col 8, Row 2) */}
          <div className="bento-card md:col-span-8 md:row-span-2 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative shadow-xl shadow-slate-900/5">
            <div
              className="absolute top-0 right-0 w-full h-full bg-cover bg-center opacity-15 mix-blend-multiply grayscale group-hover:scale-105 group-hover:opacity-25 transition-all duration-700 pointer-events-none -z-10"
              style={{
                backgroundImage:
                  "url('https://picsum.photos/seed/pos-terminal-dark/1200/800')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent -z-10" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard size={26} weight="bold" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Hitung transaksi dan kembalian dalam hitungan milidetik
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mb-6">
                Tap menu di layar atau scan barcode dengan kamera. Dilengkapi
                dengan tombol uang pas, pecahan cepat Rp 50.000 dan Rp 100.000,
                serta kalkulator kembalian otomatis. Terima pembayaran{" "}
                <strong className="text-slate-900 font-semibold">Tunai</strong>,{" "}
                <strong className="text-slate-900 font-semibold">
                  Transfer Bank
                </strong>
                , atau{" "}
                <strong className="text-slate-900 font-semibold">
                  QRIS Toko
                </strong>{" "}
                tanpa perangkat tambahan.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs font-mono font-semibold text-emerald-700">
              <span className="flex items-center gap-2">
                <Lightning size={14} weight="fill" />
                Respon Kasir &lt; 150ms
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} weight="bold" />
                Tunai · Transfer · QRIS
              </span>
            </div>
          </div>

          {/* Bento 2: Dual Storage (Col 4, Row 1) */}
          <div className="bento-card md:col-span-4 md:row-span-1 p-7 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative shadow-lg shadow-slate-900/5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CloudCheck size={22} weight="bold" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                100% Kebal offline, otomatis aman di cloud
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saat internet padam, seluruh transaksi tersimpan aman di
                database lokal perangkatmu. Begitu terhubung kembali, antrean
                penjualan disinkronkan ke cloud tanpa risiko data ganda.
              </p>
            </div>
          </div>

          {/* Bento 3: Digital Receipt (Col 4, Row 1) */}
          <div className="bento-card md:col-span-4 md:row-span-1 p-7 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative shadow-lg shadow-slate-900/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <WhatsappLogo size={22} weight="bold" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Bagikan nota langsung ke WhatsApp pelanggan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tidak punya printer struk? Cukup 1 klik untuk mengirimkan
                rincian invoice rapi ke chat WhatsApp pembeli atau unduh file
                PDF resmi dalam 1 detik.
              </p>
            </div>
          </div>

          {/* Bento 4: Flexible Catalog & Stock (Col 6, Row 1) */}
          <div className="bento-card md:col-span-6 md:row-span-1 p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative shadow-lg shadow-slate-900/5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package size={24} weight="bold" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Satu sistem untuk barang berstok maupun jasa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Jual barang fisik? Sisa stok terpotong otomatis. Jual layanan
                jasa? Matikan saklar stok agar transaksi tidak terhalang batas
                minimum inventori.
              </p>
            </div>
          </div>

          {/* Bento 5: Mode Solo & Security PIN (Col 6, Row 1) */}
          <div className="bento-card md:col-span-6 md:row-span-1 p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative shadow-lg shadow-slate-900/5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LockKey size={24} weight="bold" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Mode Solo untuk jualan mandiri, Mode Bisnis untuk tim
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pakai sendiri tanpa kata sandi yang memperlambat. Jika toko
                dijaga karyawan, aktifkan Mode Bisnis dengan PIN khusus agar
                staf tidak bisa membuka rekap profit dan pengaturan toko.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
