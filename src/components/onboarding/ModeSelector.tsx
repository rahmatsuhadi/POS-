"use client";

import type { OperationalMode } from "../../types";
import InputLabel from "../ui/InputLabel";

interface ModeSelectorProps {
  value: OperationalMode;
  onChange: (mode: OperationalMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <InputLabel>2. Pilih Mode Operasional</InputLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mode Solo */}
        <button
          type="button"
          onClick={() => onChange("solo")}
          className={`p-5 rounded-md border transition-all duration-300 flex items-start gap-3.5 cursor-pointer select-none text-left ${
            value === "solo"
              ? "border-emerald-500 bg-emerald-50/50 shadow-md"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs"
          }`}
        >
          {/* Radio button */}
          <div
            className={`w-5 h-5 min-w-[20px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              value === "solo"
                ? "border-emerald-600 bg-emerald-600"
                : "border-slate-300 bg-white"
            }`}
          >
            {value === "solo" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">
              Mode Solo / Mandiri
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Tanpa kunci PIN. Langsung jualan, cocok untuk pemilik toko yang
              melayani pembeli secara langsung.
            </p>
          </div>
        </button>

        {/* Mode Tim */}
        <button
          type="button"
          onClick={() => onChange("team")}
          className={`p-5 rounded-md border transition-all duration-300 flex items-start gap-3.5 cursor-pointer select-none text-left ${
            value === "team"
              ? "border-emerald-500 bg-emerald-50/50 shadow-md"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs"
          }`}
        >
          {/* Radio button */}
          <div
            className={`w-5 h-5 min-w-[20px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              value === "team"
                ? "border-emerald-600 bg-emerald-600"
                : "border-slate-300 bg-white"
            }`}
          >
            {value === "team" && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">
              Mode Tim &amp; Karyawan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Layar kasir terbuka untuk staf. Menu setelan modal &amp; laporan
              dikunci dengan PIN Owner.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
