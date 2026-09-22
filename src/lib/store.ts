import type {
  BusinessType,
  Category,
  OperationalMode,
  StoreProfile,
} from "../types";
import { triggerAutoSync } from "./auto-sync";
import { db } from "./db";

export interface OnboardingInput {
  businessName: string;
  mode: OperationalMode;
  adminPin?: string;
  businessType: BusinessType;
}

export const CURRENT_STORE_ID = "default";

export async function getStoreProfile(): Promise<StoreProfile | null> {
  if (typeof window === "undefined") return null;
  try {
    // 1. Cek migrasi dari key lama "current_store" jika ada
    const oldOnboarded = await db.store_profile.get("current_store");
    if (oldOnboarded) {
      const migrated: StoreProfile = { ...oldOnboarded, id: CURRENT_STORE_ID };
      await db.store_profile.put(migrated);
      await db.store_profile.delete("current_store");
      return migrated;
    }

    const profile = await db.store_profile.get(CURRENT_STORE_ID);

    // 2. Sinkronkan jika di IndexedDB masih nama seeder dummy tapi di localStorage ada nama asli onboarding
    const localName = localStorage.getItem("KalaPOS_business_name");
    const localOnboarded =
      localStorage.getItem("KalaPOS_onboarding") === "true";
    if (
      localOnboarded &&
      localName &&
      profile &&
      profile.name === "Barbershop Bro" &&
      localName !== "Barbershop Bro"
    ) {
      profile.name = localName;
      const localMode = localStorage.getItem("KalaPOS_mode") as OperationalMode;
      if (localMode) profile.mode = localMode;
      const localPin = localStorage.getItem("KalaPOS_admin_pin");
      if (localPin) profile.adminPin = localPin;
      const localType = localStorage.getItem(
        "KalaPOS_business_type",
      ) as BusinessType;
      if (localType) profile.businessType = localType;
      profile.updatedAt = new Date().toISOString();
      await db.store_profile.put(profile);
    }

    if (profile) return profile;
  } catch (err) {
    console.error("Error fetching store profile from IndexedDB:", err);
  }

  // Fallback to localStorage check
  const isOnboarded = localStorage.getItem("KalaPOS_onboarding") === "true";
  if (isOnboarded) {
    const fallbackProfile: StoreProfile = {
      id: CURRENT_STORE_ID,
      name: localStorage.getItem("KalaPOS_business_name") || "Toko Saya",
      mode: (localStorage.getItem("KalaPOS_mode") as OperationalMode) || "solo",
      adminPin: localStorage.getItem("KalaPOS_admin_pin") || null,
      businessType:
        (localStorage.getItem("KalaPOS_business_type") as BusinessType) ||
        "retail",
      currency: "IDR",
      isOnboarded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await db.store_profile.put(fallbackProfile);
    } catch {
      // ignore
    }
    return fallbackProfile;
  }

  return null;
}

export async function seedCategoryPresets(
  businessType: BusinessType,
): Promise<void> {
  const now = new Date().toISOString();
  let presets: Omit<Category, "id" | "createdAt">[] = [];

  if (businessType === "service") {
    presets = [
      { name: "Layanan Utama", isDefaultTrackStock: false, sortOrder: 1 },
      { name: "Add-on", isDefaultTrackStock: false, sortOrder: 2 },
    ];
  } else if (businessType === "retail") {
    presets = [
      { name: "Makanan", isDefaultTrackStock: true, sortOrder: 1 },
      { name: "Minuman", isDefaultTrackStock: true, sortOrder: 2 },
      { name: "Lain-lain", isDefaultTrackStock: true, sortOrder: 3 },
    ];
  } else {
    // hybrid
    presets = [
      { name: "Layanan Utama", isDefaultTrackStock: false, sortOrder: 1 },
      { name: "Produk", isDefaultTrackStock: true, sortOrder: 2 },
    ];
  }

  const categoriesToInsert: Category[] = presets.map((p, index) => ({
    id: `cat_${Date.now()}_${index + 1}`,
    ...p,
    createdAt: now,
  }));

  try {
    await db.categories.clear();
    await db.categories.bulkAdd(categoriesToInsert);
  } catch (err) {
    console.error("Failed to seed category presets:", err);
  }
}

export async function initializeStoreProfile(
  input: OnboardingInput,
): Promise<StoreProfile> {
  if (!input.businessName || input.businessName.trim() === "") {
    throw new Error("Business name is required");
  }

  if (input.mode === "team") {
    if (!input.adminPin || !/^\d{4,6}$/.test(input.adminPin)) {
      throw new Error("PIN must be 4-6 numeric digits for Team mode");
    }
  }

  const now = new Date().toISOString();
  const profile: StoreProfile = {
    id: CURRENT_STORE_ID,
    name: input.businessName.trim(),
    mode: input.mode,
    adminPin: input.mode === "team" ? input.adminPin || null : null,
    businessType: input.businessType,
    currency: "IDR",
    isOnboarded: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.store_profile.put(profile);
    await db.sync_queue.add({
      id: `sq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      action: "SYNC_STORE_PROFILE",
      payload: profile,
      createdAt: now,
    });
    triggerAutoSync().catch(() => {});
  } catch (err) {
    console.error("Error saving store profile to IndexedDB:", err);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("KalaPOS_onboarding", "true");
    localStorage.setItem("KalaPOS_business_name", profile.name);
    localStorage.setItem("KalaPOS_mode", profile.mode);
    localStorage.setItem("KalaPOS_business_type", profile.businessType);
    if (profile.adminPin) {
      localStorage.setItem("KalaPOS_admin_pin", profile.adminPin);
    } else {
      localStorage.removeItem("KalaPOS_admin_pin");
    }
  }

  await seedCategoryPresets(input.businessType);

  return profile;
}
