"use client";

import { Eye, EyeSlash, LockKey } from "@phosphor-icons/react";
import { useState } from "react";

interface PinInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function PinInput({ value, onChange, error }: PinInputProps) {
  const [showPin, setShowPin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (/^\d{0,6}$/.test(raw)) {
      onChange(raw);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3 transition-all">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="adminPin"
          className="text-sm font-semibold text-slate-900"
        >
          3. Buat PIN Admin / Owner
        </label>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
          <LockKey size={13} weight="bold" />
          Wajib di Mode Tim
        </span>
      </div>

      <div className="relative">
        <input
          id="adminPin"
          type={showPin ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={value}
          onChange={handleChange}
          placeholder="Masukkan 4 - 6 digit PIN angka (contoh: 1234)"
          className={`w-full pl-4 pr-12 h-12 bg-white border rounded-xl font-mono text-base tracking-widest text-slate-900 outline-none transition-all ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          title={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
          aria-label="Tampilkan atau sembunyikan PIN"
        >
          {showPin ? (
            <EyeSlash size={18} weight="bold" />
          ) : (
            <Eye size={18} weight="bold" />
          )}
        </button>
      </div>

      {error ? (
        <p className="text-xs text-red-500 font-semibold">{error}</p>
      ) : (
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          PIN ini digunakan pemilik usaha untuk membuka menu Setelan, Laporan
          Omzet, dan Manajemen Stok di meja kasir.
        </p>
      )}
    </div>
  );
}
