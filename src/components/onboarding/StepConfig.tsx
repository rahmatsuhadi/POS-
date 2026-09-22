"use client";

import { ArrowLeft, ArrowRight, Gear, Spinner } from "@phosphor-icons/react";
import { useState } from "react";
import type { BusinessType, OperationalMode } from "../../types";
import { ModeSelector } from "./ModeSelector";
import { PinInput } from "./PinInput";

export interface StepConfigFormData {
  businessName: string;
  mode: OperationalMode;
  adminPin: string;
  businessType: BusinessType;
}

interface StepConfigProps {
  onBack: () => void;
  onSubmit: (data: StepConfigFormData) => Promise<void>;
}

export function StepConfig({ onBack, onSubmit }: StepConfigProps) {
  const [businessName, setBusinessName] = useState("");
  const [mode, setMode] = useState<OperationalMode>("solo");
  const [adminPin, setAdminPin] = useState("");
  const [businessType] = useState<BusinessType>("retail");

  const [errors, setErrors] = useState<{
    businessName?: string;
    adminPin?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { businessName?: string; adminPin?: string } = {};

    if (!businessName.trim()) {
      newErrors.businessName = "Mohon masukkan nama bisnis terlebih dahulu.";
    }

    if (mode === "team") {
      if (!adminPin || !/^\d{4,6}$/.test(adminPin)) {
        newErrors.adminPin =
          "Mohon buat minimal 4 digit PIN untuk akses admin di Mode Tim.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit({
        businessName: businessName.trim(),
        mode,
        adminPin,
        businessType,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menyimpan profil toko";
      setErrors({ businessName: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Nav Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Kembali ke Info</span>
        </button>
        <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Langkah 2 dari 2
        </span>
      </div>

      {/* Header Block */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Gear size={13} weight="bold" />
          <span>Setup Usaha Baru</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Konfigurasi Awal Bisnis
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Sesuaikan profil usaha Anda agar fitur kasir dan hak akses aktif
          sesuai kebutuhan.
        </p>
      </div>

      {/* 1. Nama Bisnis Input */}
      <div className="space-y-2">
        <label
          htmlFor="businessName"
          className="block text-sm font-semibold text-slate-900"
        >
          1. Nama Bisnis / Toko
        </label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder='Contoh: "Barbershop Bro" / "Kopi Senja"'
          className={`w-full h-12 px-4 bg-white border rounded-xl text-base text-slate-900 outline-none transition-all ${errors.businessName
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            }`}
        />
        {errors.businessName ? (
          <p className="text-xs text-red-500 font-semibold">
            {errors.businessName}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Nama ini akan tercetak di struk pelanggan dan judul dashboard kasir.
          </p>
        )}
      </div>

      {/* 2. Mode Operasional Selector */}
      <ModeSelector value={mode} onChange={setMode} />

      {/* 3. PIN Admin (if Team mode) */}
      {mode === "team" && (
        <PinInput
          value={adminPin}
          onChange={setAdminPin}
          error={errors.adminPin}
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[52px] bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-base rounded-full shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Spinner size={18} className="animate-spin" weight="bold" />
            <span>Menyimpan Konfigurasi...</span>
          </>
        ) : (
          <>
            <span>Simpan &amp; Masuk ke Kasir</span>
            <ArrowRight size={16} weight="bold" />
          </>
        )}
      </button>

      <div className="text-center text-xs font-mono text-slate-400">
        Pengaturan ini dapat disesuaikan kembali sewaktu-waktu di menu Setelan.
      </div>
    </form>
  );
}
