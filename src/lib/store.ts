import type {
  BusinessType,
  Category,
  OperationalMode,
  StoreProfile,
} from "../types";
import { db } from "./db";

export interface OnboardingInput {
  businessName: string;
  mode: OperationalMode;
  adminPin?: string;
  businessType: BusinessType;
}

export const CURRENT_STORE_ID = "current_store";

export async function getStoreProfile(): Promise<StoreProfile | null> {
  if (typeof window === "undefined") return null;
  try {
    const profile = await db.store_profile.get(CURRENT_STORE_ID);
    if (profile) return profile;
  } catch (err) {
    console.error("Error fetching store profile from IndexedDB:", err);
  }

  // Fallback to localStorage check
  const isOnboarded = localStorage.getItem("KalaPOS_onboarding") === "true";
  if (isOnboarded) {
    return {
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
