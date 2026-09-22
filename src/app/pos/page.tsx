"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BarcodeScannerModal } from "@/components/pos/BarcodeScannerModal";
import { CartSidebar } from "@/components/pos/CartSidebar";
import { CategoryPills } from "@/components/pos/CategoryPills";
import { MobileBottomBar } from "@/components/pos/MobileBottomBar";
import { MobileBottomSheet } from "@/components/pos/MobileBottomSheet";
import { PaymentModal } from "@/components/pos/PaymentModal";
import { PinGuardModal } from "@/components/pos/PinGuardModal";
import { PosHeader } from "@/components/pos/PosHeader";
import { PosSidebar } from "@/components/pos/PosSidebar";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { VariantModal } from "@/components/pos/VariantModal";
import {
  initAutoSyncEngine,
  type SyncStatus,
  subscribeSyncState,
} from "@/lib/auto-sync";
import { db, seedInitialDataIfNeeded } from "@/lib/db";
import {
  addToCart,
  processCheckout,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/pos";
import { getStoreProfile } from "@/lib/store";
import type {
  CartItem,
  Category,
  Product,
  SelectedVariant,
  StoreProfile,
  Transaction,
} from "@/types";

export default function PosPage() {
  const router = useRouter();

  // Data states from Dexie
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // UI & Modal States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Modals
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<Product | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [latestTransaction, setLatestTransaction] =
    useState<Transaction | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // PIN Guard
  const [isPinGuardOpen, setIsPinGuardOpen] = useState(false);
  const [pendingTargetUrl, setPendingTargetUrl] = useState("");

  const [checkingStore, setCheckingStore] = useState(true);

  // Initialize DB and load products & categories
  const loadData = useCallback(async () => {
    await seedInitialDataIfNeeded();
    const profile = await getStoreProfile();

    if (!profile || !profile.isOnboarded || !profile.name) {
      router.replace("/onboarding");
      return;
    }

    const loadedProducts = await db.products.toArray();
    const loadedCategories = await db.categories.toArray();
    const syncCount = await db.sync_queue.count();

    setProducts(loadedProducts);
    setCategories(loadedCategories);
    setStoreProfile(profile);
    setPendingSyncCount(syncCount);
    setCheckingStore(false);
  }, [router]);

  useEffect(() => {
    loadData();

    // Initialize Auto-Sync Engine & subscribe to real-time sync state
    const cleanupAutoSync = initAutoSyncEngine();
    const unsubscribe = subscribeSyncState((state) => {
      setSyncStatus(state.status);
      setPendingSyncCount(state.pendingCount);
      setIsOnline(state.status !== "offline");
    });

    return () => {
      unsubscribe();
      cleanupAutoSync();
    };
  }, [loadData]);

  // Listener event notifikasi sinkronisasi selesai
  useEffect(() => {
    const handleSyncCompleted = (e: Event) => {
      const customEvent = e as CustomEvent<{ syncedCount?: number }>;
      const count = customEvent.detail?.syncedCount ?? 0;
      if (count > 0) {
        showToast(
          `${count} item transaksi/profil berhasil disinkronkan ke cloud! 🚀`,
        );
      }
    };

    window.addEventListener("kalapos:sync-completed", handleSyncCompleted);
    return () => {
      window.removeEventListener("kalapos:sync-completed", handleSyncCompleted);
    };
  }, [showToast]);

  // Keyboard shortcut listener (F2 for barcode scan)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setIsBarcodeScannerOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter products by active category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        activeCategory === "Semua" ||
        p.category.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.barcode?.includes(query);

      return matchCategory && matchQuery;
    });
  }, [products, activeCategory, searchQuery]);

  // Handle product click
  const handleSelectProduct = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProductForVariant(product);
      setIsVariantModalOpen(true);
    } else {
      setCart((prev) => addToCart(prev, product));
    }
  };

  // Handle variant modal confirm
  const handleConfirmVariant = (
    product: Product,
    selectedVariants: SelectedVariant[],
    notes: string,
  ) => {
    setCart((prev) => addToCart(prev, product, selectedVariants, notes));
  };

  // Handle barcode scanned from modal
  const handleBarcodeScanned = (barcodeText: string) => {
    const matched = products.find(
      (p) => p.barcode && p.barcode.trim() === barcodeText.trim(),
    );
    if (matched) {
      handleSelectProduct(matched);
    } else {
      setSearchQuery(barcodeText);
    }
  };

  // Cart operations
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => updateCartQuantity(prev, cartItemId, delta));
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => removeFromCart(prev, cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Payment process
  const handleCompletePayment = async (
    paymentMethod: "cash" | "transfer" | "qris",
    paymentAmount: number,
  ) => {
    if (cart.length === 0) return;

    const trx = await processCheckout({
      cart,
      paymentMethod,
      paymentAmount,
    });

    // Refresh products stock state from IndexedDB
    const updatedProducts = await db.products.toArray();
    const syncCount = await db.sync_queue.count();
    setProducts(updatedProducts);
    setPendingSyncCount(syncCount);

    setLatestTransaction(trx);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  // Handle Reset for New Transaction
  const handleNewTransaction = () => {
    setCart([]);
    setIsReceiptModalOpen(false);
    setLatestTransaction(null);
  };

  // Navigation Guard for Mode Bisnis
  const handleNavigateWithGuard = (href: string) => {
    if (href === "/pos") return;
    if (storeProfile?.mode === "team" && storeProfile.adminPin) {
      setPendingTargetUrl(href);
      setIsPinGuardOpen(true);
    } else {
      router.push(href);
    }
  };

  const handlePinSuccess = (targetUrl: string) => {
    setIsPinGuardOpen(false);
    router.push(targetUrl);
  };

  if (checkingStore) {
    return (
      <div className="bg-bg text-fg flex h-dvh w-full items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-bold tracking-wider text-white shadow-xl shadow-slate-900/10">
            K
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <p className="text-sm font-semibold text-slate-800">
                Memeriksa data toko lokal...
              </p>
            </div>
            <p className="font-mono text-xs text-slate-500">
              Menyiapkan produk & keranjang kasir
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg text-fg flex h-dvh w-full overflow-hidden">
      {/* Sidebar Desktop */}
      <PosSidebar onNavigateWithGuard={handleNavigateWithGuard} />

      {/* Main Workspace */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <PosHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
          isOnline={isOnline}
          syncStatus={syncStatus}
          pendingSyncCount={pendingSyncCount}
          cashierName={
            storeProfile?.name ? `Kasir ${storeProfile.name}` : "Kasir Ari"
          }
        />

        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <ProductGrid
          products={filteredProducts}
          onSelectProduct={handleSelectProduct}
        />
      </div>

      {/* Cart Sidebar Desktop */}
      <div className="hidden h-full md:block">
        <CartSidebar
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onOpenCheckout={() => setIsPaymentModalOpen(true)}
        />
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar
        cart={cart}
        onOpenSheet={() => setIsMobileSheetOpen(true)}
      />

      {/* Mobile Bottom Sheet Cart */}
      <MobileBottomSheet
        cart={cart}
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setIsPaymentModalOpen(true)}
      />

      {/* Modals */}
      <VariantModal
        product={selectedProductForVariant}
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        onConfirm={handleConfirmVariant}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        cart={cart}
        onClose={() => setIsPaymentModalOpen(false)}
        onCompletePayment={handleCompletePayment}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        transaction={latestTransaction}
        onNewTransaction={handleNewTransaction}
      />

      <PinGuardModal
        isOpen={isPinGuardOpen}
        targetUrl={pendingTargetUrl}
        expectedPin={storeProfile?.adminPin}
        onClose={() => setIsPinGuardOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Sync Toast Notification Container */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[150] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-surface/95 border-emerald-500/30 text-fg pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-medium shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
          >
            <CheckCircleIcon size={18} className="text-emerald-500 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
