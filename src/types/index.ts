export type OperationalMode = "solo" | "team";
export type BusinessType = "service" | "retail" | "hybrid";

export interface StoreProfile {
  id: string;
  name: string;
  mode: OperationalMode;
  adminPin?: string | null;
  businessType: BusinessType;
  currency: string;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  isDefaultTrackStock: boolean;
  sortOrder: number;
  createdAt: string;
}
