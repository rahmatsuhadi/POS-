import type { Category, Product, StoreProfile, Transaction } from "../types";
import { db } from "./db";
import { CURRENT_STORE_ID, getStoreProfile } from "./store";
import {
  isSupabaseConfigured,
  saveSupabaseSyncProfileConfig,
  supabase,
} from "./supabase";

export interface BackupPayload {
  version: number;
  exportedAt: string;
  app: string;
  data: {
    storeProfile: StoreProfile | null;
    categories: Category[];
    products: Product[];
    transactions: Transaction[];
  };
}

// 1. Push Outbox Sync Engine
export async function pushOutboxSync(): Promise<{
  syncedCount: number;
  errors: string[];
}> {
  // Check online status
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      syncedCount: 0,
      errors: ["Koneksi offline, sinkronisasi ditunda"],
    };
  }

  const queueItems = await db.sync_queue.toArray();
  if (queueItems.length === 0) {
    saveSupabaseSyncProfileConfig({
      lastSyncAt: new Date().toISOString(),
      pendingItemsCount: 0,
    });
    return { syncedCount: 0, errors: [] };
  }

  // Get session token if Supabase is configured
  let accessToken: string | null = null;
  if (isSupabaseConfigured() && typeof window !== "undefined") {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      accessToken = sessionData.session?.access_token ?? null;
    } catch {
      accessToken = null;
    }
  }

  // If Supabase is configured but user is NOT logged in to Google, keep items in queue
  if (isSupabaseConfigured() && !accessToken) {
    const remaining = await db.sync_queue.count();
    saveSupabaseSyncProfileConfig({
      pendingItemsCount: remaining,
    });
    return {
      syncedCount: 0,
      errors: ["Akun Google belum terhubung. Data tersimpan aman di lokal."],
    };
  }

  let syncedCount = 0;
  const errors: string[] = [];

  // Group queue items by action
  const profileItems = queueItems.filter(
    (item) => item.action === "SYNC_STORE_PROFILE",
  );
  const transactionItems = queueItems.filter(
    (item) => item.action === "CREATE_TRANSACTION",
  );

  // 1. Sync Store Profile via /api/store
  for (const item of profileItems) {
    try {
      if (isSupabaseConfigured() && accessToken) {
        const profile = item.payload as StoreProfile;
        const res = await fetch("/api/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profile),
        });

        if (!res.ok) {
          const errJson = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(errJson.error || `HTTP ${res.status}`);
        }
      }

      await db.sync_queue.delete(item.id);
      syncedCount++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal sync profil toko";
      errors.push(`StoreProfile (${item.id}): ${msg}`);
    }
  }

  // 2. Bulk Sync Transactions via /api/sync/batch (Single HTTP Request)
  if (transactionItems.length > 0) {
    try {
      if (isSupabaseConfigured() && accessToken) {
        const transactions = transactionItems.map(
          (item) => item.payload as Transaction,
        );

        const res = await fetch("/api/sync/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ transactions }),
        });

        if (!res.ok) {
          const errJson = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(errJson.error || `HTTP ${res.status}`);
        }

        const resJson = (await res.json()) as {
          success?: boolean;
          syncedCount?: number;
          syncedIds?: string[];
        };

        const syncedIds = resJson.syncedIds || [];
        const syncedIdSet = new Set(syncedIds);

        // Delete successful items from sync_queue
        const queueIdsToDelete = transactionItems
          .filter((item) => {
            const tx = item.payload as Transaction;
            return syncedIdSet.has(tx.id);
          })
          .map((item) => item.id);

        if (queueIdsToDelete.length > 0) {
          await db.sync_queue.bulkDelete(queueIdsToDelete);
        }

        // Mark local transactions as synced
        if (syncedIds.length > 0) {
          await db.transactions
            .where("id")
            .anyOf(syncedIds)
            .modify({ synced: true });
        }

        syncedCount += resJson.syncedCount ?? queueIdsToDelete.length;
      } else {
        // Fallback demo mode: bulk remove from queue
        const queueIdsToDelete = transactionItems.map((item) => item.id);
        await db.sync_queue.bulkDelete(queueIdsToDelete);
        const txIds = transactionItems.map(
          (item) => (item.payload as Transaction).id,
        );
        await db.transactions.where("id").anyOf(txIds).modify({ synced: true });
        syncedCount += transactionItems.length;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal bulk sync transaksi";
      errors.push(`Bulk Transactions: ${msg}`);
    }
  }

  const remaining = await db.sync_queue.count();
  saveSupabaseSyncProfileConfig({
    lastSyncAt: new Date().toISOString(),
    pendingItemsCount: remaining,
  });

  return { syncedCount, errors };
}

// 2. Downstream Hydrate / Restore from Supabase
export async function hydrateFromSupabase(): Promise<{
  success: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: "Restored from local storage profile (Demo Mode)",
    };
  }

  try {
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
      const { data: sessionData } = await supabase.auth.getSession();
      accessToken = sessionData.session?.access_token ?? null;
    }

    if (accessToken) {
      const res = await fetch("/api/sync/hydrate", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      const resJson = (await res.json()) as {
        success?: boolean;
        data?: {
          storeProfile?: StoreProfile | null;
          transactions?: Transaction[];
        };
      };

      const { storeProfile, transactions } = resJson.data || {};

      if (storeProfile) {
        await db.store_profile.put(storeProfile);
      }

      if (Array.isArray(transactions) && transactions.length > 0) {
        for (const tx of transactions) {
          await db.transactions.put(tx);
        }
      }

      saveSupabaseSyncProfileConfig({
        lastSyncAt: new Date().toISOString(),
        pendingItemsCount: await db.sync_queue.count(),
      });

      return {
        success: true,
        message: `Data berhasil dipulihkan dari cloud (${transactions?.length || 0} transaksi)!`,
      };
    }

    return {
      success: false,
      message: "Akun Google belum terhubung.",
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Gagal memuat data dari Supabase";
    return { success: false, message: msg };
  }
}

// 3. Export Backup JSON
export async function exportBackupJSON(): Promise<void> {
  const storeProfile = await getStoreProfile();
  const categories = await db.categories.toArray();
  const products = await db.products.toArray();
  const transactions = await db.transactions.toArray();

  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: "KalaPOS",
    data: {
      storeProfile,
      categories,
      products,
      transactions,
    },
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split("T")[0];
  const a = document.createElement("a");
  a.href = url;
  a.download = `kalapos-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 4. Import Backup JSON
export async function importBackupJSON(
  jsonContent: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = JSON.parse(jsonContent) as Partial<BackupPayload>;
    if (!parsed || parsed.app !== "KalaPOS" || !parsed.data) {
      return {
        success: false,
        message: "Format file JSON cadangan tidak valid (Bukan file KalaPOS)",
      };
    }

    const { storeProfile, categories, products, transactions } = parsed.data;

    await db.transaction(
      "rw",
      [db.store_profile, db.categories, db.products, db.transactions],
      async () => {
        if (storeProfile) {
          await db.store_profile.put({ ...storeProfile, id: CURRENT_STORE_ID });
        }
        if (Array.isArray(categories) && categories.length > 0) {
          await db.categories.clear();
          await db.categories.bulkPut(categories);
        }
        if (Array.isArray(products) && products.length > 0) {
          await db.products.clear();
          await db.products.bulkPut(products);
        }
        if (Array.isArray(transactions) && transactions.length > 0) {
          await db.transactions.clear();
          await db.transactions.bulkPut(transactions);
        }
      },
    );

    return {
      success: true,
      message: "Cadangan data berhasil diimpor dan diperbarui!",
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Gagal memproses file JSON cadangan";
    return { success: false, message: msg };
  }
}
