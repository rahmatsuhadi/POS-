"use client";

import {
  ArrowsClockwiseIcon,
  BarcodeIcon,
  ListIcon,
  MagnifyingGlassIcon,
  WifiHighIcon,
  WifiSlashIcon,
} from "@phosphor-icons/react";
import type { SyncStatus } from "@/lib/auto-sync";

interface PosHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenBarcodeScanner: () => void;
  isOnline: boolean;
  syncStatus?: SyncStatus;
  pendingSyncCount?: number;
  cashierName?: string;
  cashierInitials?: string;
  onToggleMobileSidebar?: () => void;
}

export function PosHeader({
  searchQuery,
  onSearchChange,
  onOpenBarcodeScanner,
  isOnline,
  syncStatus = "idle",
  pendingSyncCount = 0,
  cashierName = "Kasir Ari",
  cashierInitials = "AR",
  onToggleMobileSidebar,
}: PosHeaderProps) {
  return (
    <header className="bg-surface border-border flex shrink-0 items-center gap-4 border-b px-6 py-3.5">
      {onToggleMobileSidebar && (
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          title="Buka Menu Sidebar"
          aria-label="Buka Menu Sidebar"
          className="text-muted hover:text-fg hover:bg-surface-sub  flex h-9 w-9 shrink-0 items-center justify-center rounded-md  transition-colors md:hidden cursor-pointer"
        >
          <ListIcon size={20} />
        </button>
      )}

      <div className="relative max-w-[480px] flex-1">
        <MagnifyingGlassIcon
          size={18}
          className="text-muted pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <input
          type="text"
          className="border-line bg-surface focus:border-accent text-fg w-full rounded-sm border-2 py-2 pr-24 pl-10 text-sm transition-colors focus:outline-none placeholder:text-muted/60"
          placeholder="Cari produk atau scan barcode..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBarcodeScanner}
            title="Scan Barcode Kamera"
            className="text-muted hover:text-fg hover:bg-surface-sub rounded-sm p-1.5 transition-colors cursor-pointer"
          >
            <BarcodeIcon size={18} />
          </button>
          <span className="bg-surface-sub border border-line text-muted hidden rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide sm:inline-block">
            F2
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {syncStatus === "syncing" ? (
          <div
            className="bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold select-none"
            title="Sedang menyinkronkan data ke cloud..."
          >
            <ArrowsClockwiseIcon size={14} className="animate-spin" />
            <span>Menyinkronkan...</span>
          </div>
        ) : (
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold select-none ${isOnline
              ? pendingSyncCount > 0
                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                : "bg-accent-soft text-accent border border-accent/20"
              : "bg-danger-soft text-danger"
              }`}
            title={
              isOnline
                ? pendingSyncCount > 0
                  ? `Online (${pendingSyncCount} antrean menunggu sync)`
                  : "Terkoneksi ke cloud (Semua data tersinkron)"
                : `Mode Offline (${pendingSyncCount} transaksi tertunda)`
            }
          >
            {isOnline ? (
              <WifiHighIcon size={14} />
            ) : (
              <WifiSlashIcon size={14} />
            )}
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span>
              {isOnline
                ? pendingSyncCount > 0
                  ? `Online (${pendingSyncCount})`
                  : "Online (Synced)"
                : `Offline ${pendingSyncCount > 0 ? `(${pendingSyncCount})` : ""}`}
            </span>
          </div>
        )}

        <div className="bg-surface-sub border border-line flex items-center gap-2 rounded-full p-1 pr-3 text-xs font-medium">
          <div className="bg-accent text-white grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold">
            {cashierInitials}
          </div>
          <span className="hidden md:inline text-fg">{cashierName}</span>
        </div>
      </div>
    </header>
  );
}
