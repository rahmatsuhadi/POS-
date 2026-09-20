"use client";

import {
  BarcodeIcon,
  MagnifyingGlassIcon,
  WifiHighIcon,
  WifiSlashIcon,
} from "@phosphor-icons/react";

interface PosHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenBarcodeScanner: () => void;
  isOnline: boolean;
  pendingSyncCount?: number;
  cashierName?: string;
  cashierInitials?: string;
}

export function PosHeader({
  searchQuery,
  onSearchChange,
  onOpenBarcodeScanner,
  isOnline,
  pendingSyncCount = 0,
  cashierName = "Kasir Ari",
  cashierInitials = "AR",
}: PosHeaderProps) {
  return (
    <header className="bg-surface border-border flex shrink-0 items-center gap-4 border-b px-6 py-4">
      <div className="relative max-w-[480px] flex-1">
        <MagnifyingGlassIcon
          size={18}
          className="text-muted pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <input
          type="text"
          className="border-line bg-bg focus:border-accent text-fg w-full rounded-md border py-2.5 pr-24 pl-10 text-sm transition-colors focus:outline-none"
          placeholder="Cari produk atau scan barcode..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBarcodeScanner}
            title="Scan Barcode Kamera"
            className="text-muted hover:text-fg hover:bg-fg-soft rounded p-1 transition-colors"
          >
            <BarcodeIcon size={20} />
          </button>
          <span className="bg-fg-soft text-muted hidden rounded px-2 py-0.5 font-mono text-xs sm:inline-block">
            F2
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold select-none ${isOnline ? "bg-accent-soft text-accent border-accent" : "bg-danger-soft text-danger"}`}
          title={
            isOnline
              ? "Terkoneksi ke server (Online)"
              : `Mode Offline (${pendingSyncCount} transaksi tertunda)`
          }
        >
          {isOnline ? <WifiHighIcon size={14} /> : <WifiSlashIcon size={14} />}
          <span className="dot h-1.5 w-1.5 rounded-full bg-current" />
          <span>
            {isOnline
              ? "Online"
              : `Offline ${pendingSyncCount > 0 ? `(${pendingSyncCount})` : ""}`}
          </span>
        </div>

        <div className="bg-fg-soft flex items-center gap-2 rounded-full p-1.5 pr-3 text-xs font-medium">
          <div className="bg-accent border-accent text-surface grid h-7 w-7 place-items-center rounded-full font-semibold">
            {cashierInitials}
          </div>
          <span className="hidden md:inline">{cashierName}</span>
        </div>
      </div>
    </header>
  );
}
