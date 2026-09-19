"use client";

import { useGSAP } from "@gsap/react";
import { Check } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.fromTo(
        containerRef.current.querySelectorAll(".about-animate"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
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
      id="about"
      ref={containerRef}
      className="relative overflow-hidden border-t border-slate-200/80 bg-white py-32 md:py-48"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Text & Interactive Inline Images */}
          <div className="space-y-6 lg:col-span-6">
            <h2 className="about-animate text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Dibuat untuk
              <span
                className="mx-2 inline-block h-9 w-20 rounded-full border border-slate-200 bg-cover bg-center align-middle shadow-md"
                style={{
                  backgroundImage:
                    "url('https://picsum.photos/seed/speed-pos/400/200')",
                }}
              />
              kecepatan &amp; kemandirian usahamu.
            </h2>
            <p className="about-animate text-base leading-relaxed font-normal text-slate-600">
              KalaPOS lahir dari keresahan nyata para pelaku usaha: aplikasi
              kasir yang sering macet saat internet buruk, biaya sewa bulanan
              yang membebani kas toko, dan sistem kaku yang sulit disesuaikan.
            </p>
            <p className="about-animate text-base leading-relaxed font-normal text-slate-600">
              Berjalan mulus pada tablet kasir, komputer kasir meja, hingga
              smartphone staf tanpa kerumitan instalasi aplikasi eksternal.
            </p>

            {/* 4 High-Impact Metric Cards */}
            <div className="about-animate grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-xs transition-colors hover:border-emerald-500/50">
                <div className="mb-1 font-mono text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                  &lt; 150 ms
                </div>
                <p className="text-xs leading-snug font-medium text-slate-600">
                  Waktu proses nota &amp; kembalian di kasir
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-xs transition-colors hover:border-emerald-500/50">
                <div className="mb-1 font-mono text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                  100% Offline
                </div>
                <p className="text-xs leading-snug font-medium text-slate-600">
                  Database IndexedDB lokal di perangkat
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-xs transition-colors hover:border-emerald-500/50">
                <div className="mb-1 font-mono text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                  0 Data Hilang
                </div>
                <p className="text-xs leading-snug font-medium text-slate-600">
                  Antrean outbox sync otomatis ke cloud
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-xs transition-colors hover:border-emerald-500/50">
                <div className="mb-1 font-mono text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                  Rp 0
                </div>
                <p className="text-xs leading-snug font-medium text-slate-600">
                  Tanpa sewa bulanan atau komisi transaksi
                </p>
              </div>
            </div>
          </div>

          {/* Right Feature Card Stack (Crisp Dark Card contrast) */}
          <div className="about-animate lg:col-span-6">
            <div className="relative space-y-8 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl sm:p-10">
              <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                  <Check size={18} weight="bold" />
                </div>
                <div>
                  <h4 className="mb-1.5 text-lg font-bold text-white">
                    Navigasi Cepat Tanpa Pelatihan Lama
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Staf atau kasir baru langsung bisa melayani pelanggan dalam
                    hitungan menit tanpa perlu membaca buku panduan tebal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                  <Check size={18} weight="bold" />
                </div>
                <div>
                  <h4 className="mb-1.5 text-lg font-bold text-white">
                    Struk Digital WhatsApp &amp; Cetak Thermal
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Fleksibel kirim invoice PDF/WhatsApp langsung ke ponsel
                    pembeli atau hubungkan ke printer thermal Bluetooth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                  <Check size={18} weight="bold" />
                </div>
                <div>
                  <h4 className="mb-1.5 text-lg font-bold text-white">
                    Kendali Penuh dengan Proteksi PIN Owner
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Owner memegang kendali atas pengaturan modal, rekap omzet,
                    dan pembatalan transaksi agar operasional toko tetap aman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
