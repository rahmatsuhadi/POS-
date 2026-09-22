"use client";

import {
  UserIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { db } from "../../lib/db";
import { CURRENT_STORE_ID, getStoreProfile } from "../../lib/store";
import type { OperationalMode } from "../../types";

interface OperationalModeCardProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
  onRequirePinSetup?: () => void;
}

export function OperationalModeCard({
  onShowToast,
  onRequirePinSetup,
}: OperationalModeCardProps) {
  const [mode, setMode] = useState<OperationalMode>("solo");
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await getStoreProfile();
        if (profile) {
          setMode(profile.mode || "solo");
          setAdminPin(profile.adminPin || null);
        }
      } catch (err) {
        console.error("Gagal membaca mode operasional:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveMode = async (selectedMode: OperationalMode) => {
    if (selectedMode === "team" && !adminPin) {
      if (onShowToast)
        onShowToast(
          "Mode Bisnis memerlukan PIN Admin! Silakan atur PIN terlebih dahulu.",
          "error",
        );
      if (onRequirePinSetup) onRequirePinSetup();
      return;
    }

    try {
      setMode(selectedMode);
      const now = new Date().toISOString();
      await db.store_profile.update(CURRENT_STORE_ID, {
        mode: selectedMode,
        updatedAt: now,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("KalaPOS_mode", selectedMode);
      }

      // Clear session unlock if switching to team mode
      if (selectedMode === "team" && typeof window !== "undefined") {
        sessionStorage.removeItem("pos_admin_unlocked");
      }

      if (onShowToast) {
        onShowToast(
          selectedMode === "team"
            ? "Mode Bisnis diaktifkan! Akses Halaman Settings & Dashboard dilindungi PIN."
            : "Mode Solo diaktifkan! Penggunaan bebas tanpa kunci PIN.",
          "success",
        );
      }
    } catch (err) {
      console.error("Gagal menyimpan mode operasional:", err);
      if (onShowToast) onShowToast("Gagal menyimpan mode operasional", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border-border rounded-xl border p-6 animate-pulse">
        <div className="bg-fg-soft h-6 w-48 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-fg-soft h-28 rounded-lg" />
          <div className="bg-fg-soft h-28 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">
        <div>
          <h2 className="text-fg font-bold text-lg">
            Mode Operasional POS
          </h2>
          <p className="text-muted text-xs">
            Pilih pola otorisasi kasir &amp; akses halaman manajemen toko.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Mode Solo */}
        <button
          type="button"
          onClick={() => handleSaveMode("solo")}
          className={`p-5 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
            mode === "solo"
              ? "border-accent bg-accent-soft/20 shadow-xs"
              : "border-border bg-bg hover:border-line"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-md">
                <UserIcon size={22} />
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  mode === "solo"
                    ? "bg-accent text-white"
                    : "bg-fg-soft text-muted"
                }`}
              >
                {mode === "solo" ? "Aktif" : "Pilih"}
              </span>
            </div>
            <h3 className="text-fg font-semibold text-base mb-1">
              Mode Solo / Mandiri
            </h3>
            <p className="text-muted text-xs leading-relaxed">
              Tanpa kunci PIN. Bebas membuka semua fitur, cocok untuk pemilik
              toko yang mengoperasikan kasir sendiri.
            </p>
          </div>
        </button>

        {/* Card Mode Bisnis */}
        <button
          type="button"
          onClick={() => handleSaveMode("team")}
          className={`p-5 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
            mode === "team"
              ? "border-accent bg-accent-soft/20 shadow-xs"
              : "border-border bg-bg hover:border-line"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-500/10 text-blue-600 p-2 rounded-md">
                <UsersThreeIcon size={22} />
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  mode === "team"
                    ? "bg-accent text-white"
                    : "bg-fg-soft text-muted"
                }`}
              >
                {mode === "team" ? "Aktif" : "Pilih"}
              </span>
            </div>
            <h3 className="text-fg font-semibold text-base mb-1">
              Mode Bisnis / Tim
            </h3>
            <p className="text-muted text-xs leading-relaxed">
              Layar transaksi terbuka untuk staf/karyawan. Halaman Settings
              &amp; Laporan dikunci dengan 6-digit PIN Admin.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
