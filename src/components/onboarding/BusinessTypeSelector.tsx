"use client";

import {
  CheckCircle,
  Scissors,
  ShoppingBag,
  Storefront,
} from "@phosphor-icons/react";
import type { BusinessType } from "../../types";

interface BusinessTypeSelectorProps {
  value: BusinessType;
  onChange: (type: BusinessType) => void;
}

export function BusinessTypeSelector({
  value,
  onChange,
}: BusinessTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
        Karakter Usaha / Preset Kategori <span className="text-red-500">*</span>
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Service / Jasa */}
        <button
          type="button"
          onClick={() => onChange("service")}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
            value === "service"
              ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {value === "service" && (
            <div className="absolute top-3 right-3 text-emerald-600">
              <CheckCircle size={18} weight="fill" />
            </div>
          )}
          <div>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                value === "service"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Scissors size={18} weight="bold" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Jasa / Layanan</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Barbershop, laundry, bengkel. (Stok Off)
            </p>
          </div>
        </button>

        {/* Retail / Produk */}
        <button
          type="button"
          onClick={() => onChange("retail")}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
            value === "retail"
              ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {value === "retail" && (
            <div className="absolute top-3 right-3 text-emerald-600">
              <CheckCircle size={18} weight="fill" />
            </div>
          )}
          <div>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                value === "retail"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <ShoppingBag size={18} weight="bold" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Ritel / Barang</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Toko kelontong, distro, makanan/minuman. (Stok On)
            </p>
          </div>
        </button>

        {/* Hybrid / Campuran */}
        <button
          type="button"
          onClick={() => onChange("hybrid")}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
            value === "hybrid"
              ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {value === "hybrid" && (
            <div className="absolute top-3 right-3 text-emerald-600">
              <CheckCircle size={18} weight="fill" />
            </div>
          )}
          <div>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                value === "hybrid"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Storefront size={18} weight="bold" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Campuran</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Jual jasa sekaligus produk fisik.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
