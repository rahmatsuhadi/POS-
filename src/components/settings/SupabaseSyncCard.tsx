"use client";

import {
  ArrowsClockwiseIcon,
  CloudArrowUpIcon,
  CloudCheckIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { subscribeSyncState } from "../../lib/auto-sync";
import {
  getSupabaseSyncProfile,
  signInWithGoogle,
  signOutSupabase,
  supabase,
} from "../../lib/supabase";
import { hydrateFromSupabase, pushOutboxSync } from "../../lib/sync";
import type { SupabaseSyncProfile } from "../../types";
import Button from "../ui/Button";

interface SupabaseSyncCardProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function SupabaseSyncCard({ onShowToast }: SupabaseSyncCardProps) {
  const [profile, setProfile] = useState<SupabaseSyncProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [hydrating, setHydrating] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const p = await getSupabaseSyncProfile();
      setProfile(p);
    } catch (err) {
      console.error("Gagal membaca profil sync:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
    const unsubscribeSync = subscribeSyncState(() => {
      refreshProfile();
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      refreshProfile();
    });
    return () => {
      authListener.subscription.unsubscribe();
      unsubscribeSync();
    };
  }, [refreshProfile]);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await pushOutboxSync();
      await refreshProfile();
      if (onShowToast) {
        if (res.errors.length > 0) {
          onShowToast(
            `Sinkronisasi selesai dengan peringatan: ${res.errors.join(", ")}`,
            "error",
          );
        } else {
          onShowToast(
            `Sinkronisasi berhasil! (${res.syncedCount} item diproses)`,
            "success",
          );
        }
      }
    } catch (err) {
      console.error("Gagal sinkronisasi:", err);
      if (onShowToast) onShowToast("Gagal melakukan sinkronisasi", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleHydrate = async () => {
    setHydrating(true);
    try {
      const res = await hydrateFromSupabase();
      await refreshProfile();
      if (onShowToast) {
        onShowToast(res.message, res.success ? "success" : "error");
      }
    } catch (err) {
      console.error("Gagal hydrate dari Supabase:", err);
      if (onShowToast) onShowToast("Gagal memulihkan data dari cloud", "error");
    } finally {
      setHydrating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        if (onShowToast)
          onShowToast(`Gagal login Google: ${res.error.message}`, "error");
      } else {
        await refreshProfile();
        if (onShowToast)
          onShowToast("Berhasil terhubung dengan Google!", "success");
      }
    } catch (err) {
      console.error("Error Google login Supabase:", err);
      if (onShowToast)
        onShowToast("Gagal menghubungkan akun Google Supabase", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutSupabase();
    await refreshProfile();
    if (onShowToast) onShowToast("Akun Supabase terputus.", "success");
  };

  if (loading) {
    return (
      <div className="bg-surface border-border rounded-xl border p-6 animate-pulse">
        <div className="bg-fg-soft h-6 w-48 rounded mb-4" />
        <div className="bg-fg-soft h-12 w-full rounded" />
      </div>
    );
  }

  const isConnected = profile?.isConnected ?? false;

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">
        <div>
          <h2 className="text-fg font-bold text-lg">
            Supabase Cloud Sync &amp; Backup
          </h2>
          <p className="text-muted text-xs">
            Sinkronisasi otomatis antrean transaksi lokal ke database cloud
            PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="bg-emerald-500/10 text-emerald-600 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <CloudCheckIcon size={16} /> Terhubung
            </span>
          ) : (
            <span className="bg-amber-500/10 text-amber-600 text-xs px-3 py-1 rounded-full font-medium">
              Offline / Lokal Saja
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Connection status section */}
        <div className="bg-bg border-border rounded-lg border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-fg-soft text-fg grid h-10 w-10 place-items-center rounded-full font-bold">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="text-fg font-medium text-sm">
                {isConnected
                  ? profile?.userEmail || "Pengguna Terautentikasi"
                  : "Belum Terhubung ke Cloud"}
              </p>
              <p className="text-muted text-xs">
                {isConnected
                  ? `Sync terakhir: ${profile?.lastSyncAt ? new Date(profile.lastSyncAt).toLocaleString("id-ID") : "Belum pernah"}`
                  : "Hubungkan akun Google untuk backup otomatis multi-perangkat."}
              </p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hover:text-danger hover:border-danger"
              >
                <SignOutIcon size={16} />
                <span>Putuskan Akun</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={authLoading}
                onClick={handleGoogleLogin}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Hubungkan Akun Google</span>
              </Button>
            )}
          </div>
        </div>

        {/* Sync Status Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-bg border-border rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-muted text-xs font-medium">
                Antrean Sync Tertunda
              </p>
              <p className="text-fg font-bold text-xl mt-0.5">
                {profile?.pendingItemsCount || 0} Item
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              loading={syncing}
              onClick={handleManualSync}
            >
              <ArrowsClockwiseIcon size={16} />
              <span>Sync Sekarang</span>
            </Button>
          </div>

          <div className="bg-bg border-border rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-muted text-xs font-medium">
                Pulihkan Data Cloud
              </p>
              <p className="text-fg font-semibold text-xs mt-0.5">
                Hydrate katalog &amp; riwayat
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={hydrating}
              onClick={handleHydrate}
            >
              <CloudArrowUpIcon size={16} />
              <span>Restore Data</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
