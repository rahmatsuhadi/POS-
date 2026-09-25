"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GearIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { BusinessType, OperationalMode } from "../../types";
import { ModeSelector } from "./ModeSelector";
import { PinInput } from "./PinInput";
import Input from "../ui/Input";
import InputLabel from "../ui/InputLabel";
import Button from "../ui/Button";

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
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer rounded-md"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          <span>Kembali ke Info</span>
        </button>
        <span className="font-mono text-xs font-semibold text-emerald-700 px-3 py-1 rounded-full">
          Langkah 2 dari 2
        </span>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Konfigurasi Awal Bisnis
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Sesuaikan profil usaha Anda agar fitur kasir dan hak akses aktif
          sesuai kebutuhan.
        </p>
      </div>

      <div className="space-y-2">
        <InputLabel htmlFor="businessName">1. Nama Bisnis / Toko</InputLabel>
        <Input
          id="businessName"
          type="text"
          value={businessName}
          error={!!errors.businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder='"Kopi Senja"'
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

      <ModeSelector value={mode} onChange={setMode} />

      {mode === "team" && (
        <PinInput
          value={adminPin}
          onChange={setAdminPin}
          error={errors.adminPin}
        />
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[52px] bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-base rounded-full shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <SpinnerIcon size={18} className="animate-spin" weight="bold" />
            <span>Menyimpan Konfigurasi...</span>
          </>
        ) : (
          <>
            <span>Simpan &amp; Masuk ke Kasir</span>
            <ArrowRightIcon size={16} weight="bold" />
          </>
        )}
      </button>

      <div className="text-center text-xs font-mono text-slate-400">
        Pengaturan ini dapat disesuaikan kembali sewaktu-waktu di menu Setelan.
      </div>
    </form>
  );
}
