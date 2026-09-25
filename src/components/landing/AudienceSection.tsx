"use client";

import { LockKeyIcon, PackageIcon, ScissorsIcon } from "@phosphor-icons/react";

export function AudienceSection() {
  return (
    <section
      id="audience"
      className="border-b border-slate-200/80 bg-slate-50/70 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <span>SOLUSI SEGALA USAHA</span>
          </div>
          <h2 className="mb-4 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Cocok untuk apapun model usahamu.
          </h2>
          <p className="text-base leading-relaxed font-normal text-slate-600 sm:text-lg">
            Dirancang fleksibel untuk freelancer mandiri, toko kelontong, hingga
            barbershop dan kafe dengan banyak staf.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-600 transition-transform group-hover:scale-110">
                <PackageIcon size={24} weight="bold" />
              </div>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 font-mono text-xs font-bold text-teal-700">
                WARUNG &amp; RITEL
              </span>
              <h3 className="mt-4 mb-2 text-xl font-bold text-slate-900">
                Toko Kelontong &amp; Produk Fisik
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Pelacakan sisa stok berkurang otomatis saat terjual, dukungan
                scan barcode via kamera HP, dan tombol uang pas untuk melayani
                pembeli secepat kilat.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-teal-800">
              Fitur: Auto potong stok · Scan barcode · Struk thermal
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                <ScissorsIcon size={24} weight="bold" />
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700">
                JASA &amp; FREELANCE
              </span>
              <h3 className="mt-4 mb-2 text-xl font-bold text-slate-900">
                Barbershop, Laundry &amp; Servis
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Matikan saklar stok dengan 1 klik agar layanan jasa bisa
                ditransaksikan tanpa batas kuota. Langsung bagikan nota invoice
                resmi via WhatsApp pelanggan.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-emerald-800">
              Fitur: Toggle stok off · Nota WhatsApp · Invoice PDF
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 transition-transform group-hover:scale-110">
                <LockKeyIcon size={24} weight="bold" />
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">
                HYBRID &amp; TIM
              </span>
              <h3 className="mt-4 mb-2 text-xl font-bold text-slate-900">
                Kafe &amp; Toko dengan Karyawan
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Gabungkan produk fisik dan jasa dalam satu layar. Aktifkan Mode
                Bisnis ber-PIN agar staf kasir tidak bisa mengintip laporan
                profit dan pengaturan toko.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
              Fitur: Mode Bisnis · PIN Owner · Rekap omzet offline
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
