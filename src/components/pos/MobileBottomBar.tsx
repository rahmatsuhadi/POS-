"use client";

import { ShoppingCartIcon } from "@phosphor-icons/react";
import { calculateCartTotals } from "@/lib/pos";
import type { CartItem } from "@/types";

interface MobileBottomBarProps {
  cart: CartItem[];
  onOpenSheet: () => void;
}

export function MobileBottomBar({ cart, onOpenSheet }: MobileBottomBarProps) {
  const { total, itemCount } = calculateCartTotals(cart);
  const formatIDR = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  if (cart.length === 0) return null;

  return (
    <div className="bg-surface border-line fixed right-0 bottom-0 left-0 z-40 border-t p-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-lg md:hidden">
      <button
        type="button"
        onClick={onOpenSheet}
        className="bg-accent hover:bg-accent-hover text-surface flex min-h-[50px] w-full items-center justify-between rounded-lg px-4 py-3.5 text-sm font-semibold transition-all"
      >
        <div className="flex items-center gap-2">
          <ShoppingCartIcon size={20} weight="bold" />
          <span className="rounded-full bg-white/25 px-2.5 py-0.5 font-mono text-xs">
            {itemCount} Item
          </span>
          <span className="text-xs">· Lihat Pesanan</span>
        </div>
        <span className="font-mono text-sm font-bold">{formatIDR(total)}</span>
      </button>
    </div>
  );
}
