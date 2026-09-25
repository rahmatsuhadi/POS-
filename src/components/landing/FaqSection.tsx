"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question:
      "Kalau browser ditutup atau HP mati, apakah data jualan saya hilang?",
    answer:
      "Sama sekali tidak. Seluruh katalog produk dan riwayat transaksi tersimpan permanen di memori lokal perangkatmu (IndexedDB). Saat kamu menghubungkan akun, data juga dicadangkan otomatis ke cloud dan siap digunakan di perangkat lain.",
  },
  {
    question: "Apakah saya wajib membeli printer thermal kasir?",
    answer:
      "Tidak wajib. Kamu bisa membagikan nota resmi secara gratis via tautan WhatsApp atau mengunduh invoice dalam bentuk file PDF. Namun jika kamu sudah memiliki printer thermal Bluetooth (ukuran 58mm atau 80mm), KalaPOS siap mencetak struk kertas dalam sekali klik.",
  },
  {
    question: "Bagaimana cara memasang KalaPOS di HP Android atau iPhone?",
    answer:
      "Karena berbasis Progressive Web App (PWA), kamu tidak perlu mencari di Google Play Store atau App Store. Cukup buka web ini di browser, lalu pilih menu 'Tambahkan ke Layar Utama' (Add to Home Screen). Aplikasi langsung terpasang ringan tanpa menguras memori HP.",
  },
  {
    question:
      "Bisakah aplikasi ini dipakai untuk barbershop, salon, atau jasa tanpa stok?",
    answer:
      "Sangat bisa! Setiap produk memiliki tombol saklar Lacak Stok. Saat dinonaktifkan, item tersebut diperlakukan sebagai jasa murni yang bisa ditransaksikan kapan saja tanpa batasan kuota inventori.",
  },
  {
    question: "Apa perbedaan Mode Solo dan Mode Bisnis?",
    answer:
      "Mode Solo dirancang untuk freelancer atau pemilik usaha mandiri yang mengoperasikan kasir sendiri tanpa perlu kata sandi atau proteksi shift. Mode Bisnis dirancang untuk toko dengan karyawan, di mana layar Dashboard profit dan Pengaturan Toko dikunci menggunakan PIN 4-6 digit agar kasir tidak bisa mengintip laporan keuangan.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative border-t border-slate-200/80 bg-slate-50/80 py-32 md:py-48"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <h2 className="mb-4 text-3xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Pertanyaan yang sering diajukan.
          </h2>
          <p className="text-base leading-relaxed font-normal text-slate-600 sm:text-lg">
            Temukan jawaban langsung seputar pengoperasian dan kompatibilitas
            perangkat.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left sm:p-7"
                >
                  <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    {item.question}
                  </h3>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 border-emerald-200 bg-emerald-50 text-emerald-600" : ""}`}
                  >
                    <CaretDownIcon size={16} weight="bold" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 pt-4 pb-6 text-sm leading-relaxed text-slate-600 sm:px-7 sm:pb-7">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
