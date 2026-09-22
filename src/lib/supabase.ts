import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseSyncProfile } from "../types";
import { db } from "./db";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://placeholder-supabase.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

const SYNC_PROFILE_KEY = "kalapos_supabase_sync_config";

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export async function getSupabaseSyncProfile(): Promise<SupabaseSyncProfile> {
  const pendingItemsCount = await db.sync_queue.count();
  const savedConfigStr =
    typeof window !== "undefined"
      ? localStorage.getItem(SYNC_PROFILE_KEY)
      : null;
  let savedConfig: Partial<SupabaseSyncProfile> = {};

  if (savedConfigStr) {
    try {
      savedConfig = JSON.parse(savedConfigStr);
    } catch {
      savedConfig = {};
    }
  }

  let isConnected = false;
  let userEmail: string | null = null;
  let userId: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        isConnected = true;
        userEmail = data.session.user.email ?? null;
        userId = data.session.user.id ?? null;
        saveSupabaseSyncProfileConfig({
          isConnected: true,
          userEmail,
          userId,
        });
      }
    } catch {
      isConnected = false;
    }
  }

  const finalIsConnected = isSupabaseConfigured()
    ? isConnected
    : (savedConfig.isConnected ?? false);
  const finalUserEmail = isSupabaseConfigured()
    ? userEmail
    : (savedConfig.userEmail ?? null);
  const finalUserId = isSupabaseConfigured()
    ? userId
    : (savedConfig.userId ?? null);

  return {
    isConnected: finalIsConnected,
    userEmail: finalUserEmail,
    userId: finalUserId,
    lastSyncAt: savedConfig.lastSyncAt ?? null,
    autoSyncEnabled: savedConfig.autoSyncEnabled ?? true,
    pendingItemsCount,
  };
}

export function saveSupabaseSyncProfileConfig(
  config: Partial<SupabaseSyncProfile>,
): void {
  if (typeof window === "undefined") return;
  const existingStr = localStorage.getItem(SYNC_PROFILE_KEY);
  let existing: Partial<SupabaseSyncProfile> = {};
  if (existingStr) {
    try {
      existing = JSON.parse(existingStr);
    } catch {
      existing = {};
    }
  }
  const updated = { ...existing, ...config };
  localStorage.setItem(SYNC_PROFILE_KEY, JSON.stringify(updated));
}

export async function signInWithGoogle(customRedirectTo?: string) {
  if (!isSupabaseConfigured()) {
    const demoEmail = "user.google@tokokala.id";
    saveSupabaseSyncProfileConfig({
      isConnected: true,
      userEmail: demoEmail,
      userId: `demo-usr-${Date.now()}`,
    });
    return {
      data: { provider: "google", url: null },
      error: null,
    };
  }

  const redirectTo =
    customRedirectTo ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/settings`
      : undefined);
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });
}

export async function signInWithEmailPassword(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    // Demo fallback mode when env vars not supplied
    saveSupabaseSyncProfileConfig({
      isConnected: true,
      userEmail: email,
      userId: `demo-usr-${Date.now()}`,
    });
    return {
      data: { user: { id: `demo-usr-${Date.now()}`, email } },
      error: null,
    };
  }

  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.data.user) {
    saveSupabaseSyncProfileConfig({
      isConnected: true,
      userEmail: res.data.user.email ?? email,
      userId: res.data.user.id,
    });
  }
  return res;
}

export async function signInWithMagicLink(email: string) {
  if (!isSupabaseConfigured()) {
    saveSupabaseSyncProfileConfig({
      isConnected: true,
      userEmail: email,
      userId: `demo-usr-${Date.now()}`,
    });
    return {
      data: { user: { id: `demo-usr-${Date.now()}`, email } },
      error: null,
    };
  }

  return await supabase.auth.signInWithOtp({ email });
}

export async function signOutSupabase() {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore offline signout error
    }
  }

  saveSupabaseSyncProfileConfig({
    isConnected: false,
    userEmail: null,
    userId: null,
  });
}
