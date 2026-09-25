"use client";

import {
  CashRegisterIcon,
  GearIcon,
  PackageIcon,
  QuestionIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { BrandLogo } from "../BrandLogo";

interface PosSidebarProps {
  onNavigateWithGuard: (href: string) => void;
  activeView?: "register" | "orders" | "inventory" | "settings";
}

export function PosSidebar({
  onNavigateWithGuard,
  activeView = "register",
}: PosSidebarProps) {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    onNavigateWithGuard(href);
  };

  return (
    <aside
      className="bg-surface border-line z-10 flex hidden h-full w-[72px] shrink-0 flex-col items-center gap-1 border-r py-4 md:flex"
      data-od-id="sidebar"
    >
      <BrandLogo />

      <div className="mt-5 flex w-full flex-1 flex-col gap-1.5 px-2">
        <a
          href="/pos"
          onClick={(e) => handleNavClick(e, "/pos")}
          className={`sidebar-btn flex h-13 w-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-all ${activeView === "register" ? "text-accent bg-accent-soft font-semibold" : "text-muted hover:bg-fg-soft hover:text-fg"}`}
          title="Kasir"
        >
          <CashRegisterIcon size={22} />
          <span>Kasir</span>
        </a>

        <a
          href="/history"
          onClick={(e) => handleNavClick(e, "/history")}
          className={`sidebar-btn flex h-13 w-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-all ${activeView === "orders" ? "text-accent bg-accent-soft font-semibold" : "text-muted hover:bg-fg-soft hover:text-fg"}`}
          title="Pesanan"
        >
          <ReceiptIcon size={22} />
          <span>Pesanan</span>
        </a>

        <a
          href="/products"
          onClick={(e) => handleNavClick(e, "/products")}
          className={`sidebar-btn flex h-13 w-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-all ${activeView === "inventory" ? "text-accent bg-accent-soft font-semibold" : "text-muted hover:bg-fg-soft hover:text-fg"}`}
          title="Inventori"
        >
          <PackageIcon size={22} />
          <span>Inventori</span>
        </a>

        <a
          href="/settings"
          onClick={(e) => handleNavClick(e, "/settings")}
          className={`sidebar-btn flex h-13 w-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-all ${activeView === "settings" ? "text-accent bg-accent-soft font-semibold" : "text-muted hover:bg-fg-soft hover:text-fg"}`}
          title="Pengaturan"
        >
          <GearIcon size={22} />
          <span>Setelan</span>
        </a>
      </div>

      <div className="mt-auto px-2">
        <button
          type="button"
          className="text-muted hover:bg-fg-soft hover:text-fg flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-lg transition-all"
          title="Bantuan"
        >
          <QuestionIcon size={22} />
        </button>
      </div>
    </aside>
  );
}
