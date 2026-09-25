"use client";

import {
  CoinsIcon,
  StorefrontIcon,
  WifiSlashIcon,
} from "@phosphor-icons/react";

export function ProblemSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Kasir modern seharusnya bikin jualan tenang, bukan bikin panik saat
            listrik padam.
          </h2>
          <p className="text-base leading-relaxed font-normal text-slate-600 sm:text-lg">
            Banyak aplikasi kasir mendadak macet saat sinyal drop, menagih sewa
            bulanan mahal, atau memaksa form inventori rumit padahal usahamu
            hanya menjual layanan jasa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 font-bold text-amber-600">
              <WifiSlashIcon size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Sinyal lemot bukan alasan kasir berhenti
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Jualan di ruko semi-basement atau bazar outdoor sering terkendala
              sinyal. KalaPOS mencatat transaksi langsung di memori perangkat
              dengan respon &lt; 150 ms tanpa antrean menumpuk.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 font-bold text-rose-600">
              <CoinsIcon size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Bebas dari beban biaya sewa bulanan
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Usaha mikro yang baru merintis tidak seharusnya terbebani sewa
              ratusan ribu per bulan atau potongan komisi per transaksi. Nikmati
              seluruh fitur kasir esensial secara gratis.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 font-bold text-emerald-600">
              <StorefrontIcon size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Bebas dari form stok yang kaku
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Pangkas rambut, laundry, servis, dan fotografi tidak butuh form
              stok gudang yang rumit. Cukup matikan saklar stok dengan 1 klik,
              dan kamu bisa langsung mulai jualan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
