"use client";

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
import { db, seedInitialDataIfNeeded } from "@/lib/db";
import {
  addToCart,
  processCheckout,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/pos";
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

  // Initialize DB and load products & categories
  const loadData = useCallback(async () => {
    await seedInitialDataIfNeeded();
    const loadedProducts = await db.products.toArray();
    const loadedCategories = await db.categories.toArray();
    const profile = await db.store_profile.toCollection().first();
    const syncCount = await db.sync_queue.count();

    setProducts(loadedProducts);
    setCategories(loadedCategories);
    setStoreProfile(profile || null);
    setPendingSyncCount(syncCount);
  }, []);

  useEffect(() => {
    loadData();

    // Network status detection
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadData]);

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

  return (
    <div className="bg-bg text-gf flex h-dvh w-full overflow-hidden">
      {/* Sidebar Desktop */}
      <PosSidebar onNavigateWithGuard={handleNavigateWithGuard} />

      {/* Main Workspace */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <PosHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
          isOnline={isOnline}
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
    </div>
  );
}
