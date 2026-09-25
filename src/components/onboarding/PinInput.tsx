"use client";

import { EyeIcon, EyeSlashIcon, LockKeyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import InputLabel from "../ui/InputLabel";
import Input from "../ui/Input";

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
    <div className="p-5 rounded-md bg-emerald-50/50 border border-emerald-200/80 space-y-3 transition-all">
      <div className="flex items-center justify-between gap-2">
        <InputLabel
          htmlFor="adminPin"
        >
          3. Buat PIN Admin / Owner
        </InputLabel>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
          <LockKeyIcon size={13} weight="bold" />
          Wajib
        </span>
      </div>

      <div className="relative">
        <Input
          id="adminPin"
          type={showPin ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={value}
          onChange={handleChange}
          placeholder="Masukkan 4 - 6 digit PIN angka (contoh: 1234)"
          error={!!error}
        />
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          title={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
          aria-label="Tampilkan atau sembunyikan PIN"
        >
          {showPin ? (
            <EyeSlashIcon size={18} weight="bold" />
          ) : (
            <EyeIcon size={18} weight="bold" />
          )}
        </button>
      </div>

      {error ? (
        <p className="text-xs text-red-300 font-semibold">{error}</p>
      ) : (
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          PIN ini digunakan pemilik usaha untuk membuka menu Setelan, Laporan
          Omzet, dan Manajemen Stok di meja kasir.
        </p>
      )}
    </div>
  );
}
