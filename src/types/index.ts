export type OperationalMode = "solo" | "team";
export type BusinessType = "service" | "retail" | "hybrid";

export interface StoreProfile {
  id: string;
  name: string;
  ownerName?: string;
  address?: string;
  phone?: string;
  receiptFooter?: string;
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
  icon?: string;
  isDefaultTrackStock: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface VariantOption {
  label: string;
  delta: number;
}

export interface VariantGroup {
  group: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  trackStock: boolean;
  barcode?: string;
  image?: string;
  icon?: string;
  variants?: VariantGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface SelectedVariant {
  group: string;
  label: string;
  delta: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  selectedVariants: SelectedVariant[];
  notes?: string;
  trackStock: boolean;
  currentStock: number;
}

export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  selectedVariants?: SelectedVariant[];
  notes?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: "cash" | "transfer" | "qris";
  paymentAmount: number;
  changeAmount: number;
  items: TransactionItem[];
  status: "completed" | "cancelled";
  synced: boolean;
  createdAt: string;
}

export interface SyncQueueItem {
  id: string;
  action:
    | "CREATE_TRANSACTION"
    | "UPDATE_STOCK"
    | "UPDATE_PRODUCT"
    | "SYNC_STORE_PROFILE"
    | "CREATE_CATEGORY"
    | "UPDATE_CATEGORY"
    | "DELETE_CATEGORY";
  payload: unknown;
  createdAt: string;
}

export interface SupabaseSyncProfile {
  isConnected: boolean;
  userEmail: string | null;
  userId: string | null;
  lastSyncAt: string | null;
  autoSyncEnabled: boolean;
  pendingItemsCount: number;
}

export interface PrinterSettings {
  deviceId: string | null;
  deviceName: string | null;
  paperWidth: "58mm" | "80mm";
  autoPrint: boolean;
}
