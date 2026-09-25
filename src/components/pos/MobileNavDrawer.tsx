"use client";

import {
  CashRegisterIcon,
  GearIcon,
  PackageIcon,
  QuestionIcon,
  ReceiptIcon,
  StorefrontIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import { BrandLogo } from "../BrandLogo";

export interface MobileNavDrawerProps {
  /** Controls drawer open/close visibility */
  isOpen: boolean;
  /** Callback fired when drawer should be closed (backdrop click, escape key, nav click) */
  onClose: () => void;
  /** Navigation handler supporting PIN guard check */
  onNavigateWithGuard: (href: string) => void;
  /** Current active navigation key */
  activeView?: "register" | "orders" | "inventory" | "settings";
  /** Name of the store to display in header */
  storeName: string;
  /** Name of the store owner to display if present */
  ownerName?: string;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  onNavigateWithGuard,
  activeView = "register",
  storeName,
  ownerName,
}: MobileNavDrawerProps) {
  // Listen for Escape key press to auto-close drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    onClose();
    onNavigateWithGuard(href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex md:hidden"
      data-od-id="mobile-nav-drawer"
    >
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Container */}
      <aside className="bg-surface border-line relative z-10 flex h-full w-[280px] max-w-[80vw] shrink-0 flex-col border-r shadow-2xl transition-transform">
        {/* Drawer Header */}
        <div className="border-line flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <BrandLogo />
            <span>Kala POS</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-fg hover:bg-surface-sub rounded-lg p-1.5 transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Store & Owner Profile Card */}
        <div className="mx-4 mt-4 p-3.5 ">
          <div className="flex items-center gap-3">
            <div className="text-accent grid h-10 w-10 shrink-0 place-items-center ">
              <StorefrontIcon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-fg truncate text-sm font-bold tracking-tight">
                {storeName || "Toko POS"}
              </h2>
              {ownerName ? (
                <div className="text-muted flex items-center gap-1.5 text-xs">
                  <UserIcon size={14} className="shrink-0" />
                  <span className="truncate">{ownerName ?? "-"}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 overflow-y-auto pl-3 py-4">
          <div className="flex flex-col gap-1">
            <a
              href="/pos"
              onClick={(e) => handleNavClick(e, "/pos")}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-lg transition-colors ${activeView === "register"
                ? "bg-accent-soft text-accent font-semibold"
                : "text-muted hover:bg-surface-sub hover:text-fg"
                }`}
            >
              <CashRegisterIcon size={25} />
              <span>Kasir</span>
            </a>

            <a
              href="/history"
              onClick={(e) => handleNavClick(e, "/history")}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-lg transition-colors ${activeView === "orders"
                ? "bg-accent-soft text-accent font-semibold"
                : "text-muted hover:bg-surface-sub hover:text-fg"
                }`}
            >
              <ReceiptIcon size={25} />
              <span>Pesanan</span>
            </a>

            <a
              href="/products"
              onClick={(e) => handleNavClick(e, "/products")}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-lg transition-colors ${activeView === "inventory"
                ? "bg-accent-soft text-accent font-semibold"
                : "text-muted hover:bg-surface-sub hover:text-fg"
                }`}
            >
              <PackageIcon size={25} />
              <span>Inventori</span>
            </a>

            <a
              href="/settings"
              onClick={(e) => handleNavClick(e, "/settings")}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-lg transition-colors ${activeView === "settings"
                ? "bg-accent-soft text-accent font-semibold"
                : "text-muted hover:bg-surface-sub hover:text-fg"
                }`}
            >
              <GearIcon size={25} />
              <span>Setelan</span>
            </a>
          </div>
        </nav>

        {/* Footer Help Button */}
        <div className="border-line border-t p-3">
          <button
            type="button"
            className="text-muted hover:bg-surface-sub hover:text-fg flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <QuestionIcon size={25} />
            <span>Bantuan</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
