"use client";

import { FloppyDiskIcon, StorefrontIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { triggerAutoSync } from "../../lib/auto-sync";
import { db } from "../../lib/db";
import { CURRENT_STORE_ID, getStoreProfile } from "../../lib/store";
import type { StoreProfile } from "../../types";
import Input from "../ui/Input";
import LabelInput from "../ui/InputLabel";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

interface StoreProfileFormProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function StoreProfileForm({ onShowToast }: StoreProfileFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<StoreProfile>>({
    name: "",
    ownerName: "",
    phone: "",
    address: "",
    currency: "IDR",
    receiptFooter: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getStoreProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Gagal memuat profil toko:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name?.trim()) {
      if (onShowToast) onShowToast("Nama Toko wajib diisi!", "error");
      return;
    }

    setSaving(true);
    const startTime = performance.now();
    try {
      const now = new Date().toISOString();
      const updated: StoreProfile = {
        id: CURRENT_STORE_ID,
        name: profile.name.trim(),
        ownerName: profile.ownerName?.trim() || "",
        phone: profile.phone?.trim() || "",
        address: profile.address?.trim() || "",
        currency: profile.currency || "IDR",
        receiptFooter:
          profile.receiptFooter?.trim() || "Terima kasih atas kunjungan Anda!",
        mode: profile.mode || "solo",
        adminPin: profile.adminPin || null,
        businessType: profile.businessType || "hybrid",
        isOnboarded: profile.isOnboarded ?? true,
        createdAt: profile.createdAt || now,
        updatedAt: now,
      };

      await db.store_profile.put(updated);

      if (typeof window !== "undefined") {
        localStorage.setItem("KalaPOS_business_name", updated.name);
        localStorage.setItem("KalaPOS_mode", updated.mode);
        localStorage.setItem("KalaPOS_business_type", updated.businessType);
      }

      // Also queue sync update
      await db.sync_queue.add({
        id: `sq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        action: "SYNC_STORE_PROFILE",
        payload: updated,
        createdAt: now,
      });

      triggerAutoSync().catch(() => { });

      const elapsed = Math.round(performance.now() - startTime);
      if (onShowToast) {
        onShowToast(`Profil toko berhasil disimpan (${elapsed}ms)!`, "success");
      }
    } catch (err) {
      console.error("Gagal menyimpan profil toko:", err);
      if (onShowToast) onShowToast("Gagal menyimpan profil toko", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border-border rounded-xl border p-6 animate-pulse">
        <div className="bg-fg-soft h-6 w-48 rounded mb-4" />
        <div className="space-y-3">
          <div className="bg-fg-soft h-10 w-full rounded" />
          <div className="bg-fg-soft h-10 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">

        <div>
          <h2 className="text-fg font-bold text-lg">
            Profil Toko & Informasi Nota
          </h2>
          <p className="text-muted text-xs">
            Kelola detail identitas toko yang akan tampil pada nota & laporan.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <LabelInput required htmlFor="pf-name">
              Nama Toko
            </LabelInput>
            <Input
              placeholder="Kala kopi"
              id="pf-name"
              type="text"
              required
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <LabelInput
              htmlFor="pf-phone"
            >
              No. HP
            </LabelInput>
            <Input
              id="pf-phone"
              type="text"
              placeholder="081234567890"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

        </div>


        <div>
          <LabelInput required htmlFor="pf-owner">
            Nama Pemilik
          </LabelInput>
          <Input
            id="pf-owner"
            type="text"
            placeholder="Nadia"
            value={profile.ownerName || ""}
            onChange={(e) =>
              setProfile({ ...profile, ownerName: e.target.value })
            }
          />
        </div>

        <div>
          <LabelInput
            htmlFor="pf-address"
          >
            Alamat Toko
          </LabelInput>
          <TextArea
            id="pf-address"
            rows={2}
            placeholder="Jl. Bantul No. 42, Bantul Yogyakarta"
            value={profile.address || ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
          />
        </div>

        <div>
          <LabelInput
            htmlFor="pf-footer"
          >
            Catatan Kaki Struk (Receipt Footer)
          </LabelInput>
          <Input
            id="pf-footer"
            type="text"
            placeholder="Contoh: Terima kasih atas kunjungan Anda! Semoga hari Anda menyenangkan."
            value={profile.receiptFooter || ""}
            onChange={(e) =>
              setProfile({ ...profile, receiptFooter: e.target.value })
            }
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" loading={saving}>
            <FloppyDiskIcon size={18} />
            <span>Simpan Profil</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
