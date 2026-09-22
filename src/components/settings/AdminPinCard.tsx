"use client";

import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { db } from "../../lib/db";
import { CURRENT_STORE_ID, getStoreProfile } from "../../lib/store";
import Button from "../ui/Button";
import Input from "../ui/Input";
import LabelInput from "../ui/InputLabel";

interface AdminPinCardProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function AdminPinCard({ onShowToast }: AdminPinCardProps) {
  const [currentPin, setCurrentPin] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPin() {
      try {
        const profile = await getStoreProfile();
        if (profile?.adminPin) {
          setCurrentPin(profile.adminPin);
        }
      } catch (err) {
        console.error("Gagal membaca PIN Admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPin();
  }, []);

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.exec(pinInput)) {
      if (onShowToast)
        onShowToast("PIN Admin harus berupa 4 hingga 6 digit angka!", "error");
      return;
    }

    if (pinInput !== confirmPinInput) {
      if (onShowToast)
        onShowToast("Konfirmasi PIN tidak cocok dengan PIN baru!", "error");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      await db.store_profile.update(CURRENT_STORE_ID, {
        adminPin: pinInput,
        updatedAt: now,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("KalaPOS_admin_pin", pinInput);
      }

      setCurrentPin(pinInput);
      setPinInput("");
      setConfirmPinInput("");
      if (onShowToast) onShowToast("PIN Admin berhasil disimpan!", "success");
    } catch (err) {
      console.error("Gagal menyimpan PIN Admin:", err);
      if (onShowToast) onShowToast("Gagal menyimpan PIN Admin", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border-border rounded-xl border p-6 animate-pulse">
        <div className="bg-fg-soft h-6 w-48 rounded mb-4" />
        <div className="bg-fg-soft h-10 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">
        <div>
          <h2 className="text-fg font-bold text-lg">
            Keamanan &amp; PIN Admin
          </h2>
          <p className="text-muted text-xs">
            Atur 4-6 digit PIN proteksi untuk mengunci fitur manajerial Mode
            Bisnis.
          </p>
        </div>
        {currentPin ? (
          <span className="bg-emerald-500/10 text-emerald-600 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <CheckIcon size={14} /> PIN Aktif
          </span>
        ) : (
          <span className="bg-amber-500/10 text-amber-600 text-xs px-2.5 py-1 rounded-full font-medium">
            Belum Diatur
          </span>
        )}
      </div>

      <form onSubmit={handleSavePin} className="space-y-4 max-w-md">
        <div>
          <LabelInput required htmlFor="admin-pin-input">
            PIN Baru (4 - 6 Digit Angka)
          </LabelInput>
          <div className="relative">
            <Input
              id="admin-pin-input"
              type={showPin ? "text" : "password"}
              maxLength={6}
              pattern="\d*"
              required
              className="tracking-widest pr-10"
              placeholder="••••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-muted hover:text-fg absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
            >
              {showPin ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        <div>
          <LabelInput required htmlFor="confirm-pin-input">
            Konfirmasi PIN Baru
          </LabelInput>
          <Input
            id="confirm-pin-input"
            type={showPin ? "text" : "password"}
            maxLength={6}
            pattern="\d*"
            required
            className="tracking-widest"
            placeholder="••••••"
            value={confirmPinInput}
            onChange={(e) =>
              setConfirmPinInput(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <div className="pt-2 flex justify-start">
          <Button type="submit" loading={saving}>
            <LockKeyIcon size={18} />
            <span>
              {currentPin ? "Perbarui PIN Admin" : "Simpan PIN Admin"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
