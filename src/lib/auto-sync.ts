import { db } from "./db";
import { isSupabaseConfigured, supabase } from "./supabase";
import { hydrateFromSupabase, pushOutboxSync } from "./sync";

export type SyncStatus = "idle" | "syncing" | "offline" | "error";

export interface SyncEngineState {
  status: SyncStatus;
  pendingCount: number;
  lastSyncAt: string | null;
  lastError: string | null;
}

type SyncStateListener = (state: SyncEngineState) => void;

let isSyncRunning = false;
let hasPendingTrigger = false;
let isInitialized = false;

const state: SyncEngineState = {
  status:
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "idle",
  pendingCount: 0,
  lastSyncAt: null,
  lastError: null,
};

const listeners = new Set<SyncStateListener>();

function notifyListeners() {
  for (const listener of listeners) {
    try {
      listener({ ...state });
    } catch (err) {
      console.error("Error in sync state listener:", err);
    }
  }
}

export function subscribeSyncState(listener: SyncStateListener): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => {
    listeners.delete(listener);
  };
}

export function getSyncState(): SyncEngineState {
  return { ...state };
}

/**
 * Memverifikasi koneksi internet nyata lewat ping ringan ke /api/health
 * Menghindari false-positive saat terhubung Wi-Fi tapi tanpa kuota / captive portal
 */
export async function checkActiveInternet(): Promise<boolean> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return false;
  try {
    const res = await fetch("/api/health", {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function triggerAutoSync(): Promise<void> {
  if (typeof window === "undefined") return;

  if (!navigator.onLine) {
    state.status = "offline";
    state.pendingCount = await db.sync_queue.count();
    notifyListeners();
    return;
  }

  if (isSyncRunning) {
    hasPendingTrigger = true;
    return;
  }

  isSyncRunning = true;
  state.status = "syncing";
  state.lastError = null;
  notifyListeners();

  try {
    const res = await pushOutboxSync();
    state.lastSyncAt = new Date().toISOString();
    state.pendingCount = await db.sync_queue.count();

    if (res.errors.length > 0) {
      state.status = "error";
      state.lastError = res.errors[0];
    } else {
      state.status = "idle";
    }

    // Broadcast event jika ada transaksi/profil yang berhasil disinkronkan
    if (res.syncedCount > 0 && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kalapos:sync-completed", {
          detail: { syncedCount: res.syncedCount },
        }),
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal auto-sync";
    state.status = "error";
    state.lastError = message;
    state.pendingCount = await db.sync_queue.count();
  } finally {
    isSyncRunning = false;
    notifyListeners();

    if (hasPendingTrigger) {
      hasPendingTrigger = false;
      setTimeout(() => {
        triggerAutoSync();
      }, 500);
    }
  }
}

export function initAutoSyncEngine(): () => void {
  if (typeof window === "undefined") return () => {};
  if (isInitialized) return () => {};

  isInitialized = true;

  // 1. Initial pending count update
  db.sync_queue.count().then((count) => {
    state.pendingCount = count;
    notifyListeners();
  });

  // 2. Online / Offline event listeners dengan active ping check
  const handleOnline = async () => {
    const isActuallyOnline = await checkActiveInternet();
    if (!isActuallyOnline) {
      state.status = "offline";
      notifyListeners();
      return;
    }
    state.status = "idle";
    notifyListeners();
    await triggerAutoSync();
  };

  const handleOffline = () => {
    state.status = "offline";
    notifyListeners();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // 3. Tab visibility listener (ketika kasir kembali membuka tab POS)
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && navigator.onLine) {
      triggerAutoSync();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // 4. Supabase Auth state change listener
  let authUnsubscribe = () => {};
  if (isSupabaseConfigured()) {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const count = await db.sync_queue.count();
          if (count === 0) {
            await hydrateFromSupabase().catch(() => {});
          }
          await triggerAutoSync();
        }
      },
    );
    authUnsubscribe = () => {
      authListener.subscription.unsubscribe();
    };
  }

  // Initial sync attempt if online
  if (navigator.onLine) {
    checkActiveInternet().then((isOnline) => {
      if (isOnline) {
        triggerAutoSync();
      } else {
        state.status = "offline";
        notifyListeners();
      }
    });
  }

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    authUnsubscribe();
    isInitialized = false;
  };
}
