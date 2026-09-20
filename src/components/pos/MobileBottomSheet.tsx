"use client";

import {
  CreditCardIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import { calculateCartTotals } from "@/lib/pos";
import type { CartItem } from "@/types";
import { formatIDR } from "@/utils/currency";

interface MobileBottomSheetProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export function MobileBottomSheet({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}: MobileBottomSheetProps) {
  const { subtotal, tax, total, itemCount } = calculateCartTotals(cart);

  useEffect(() => {
    if (itemCount === 0) {
      onClose();
    }
  }, [itemCount, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Tutup detail pesanan"
        className="bottom-sheet-overlay fixed inset-0 z-50 cursor-default border-none bg-black/40 p-0 md:hidden"
        onClick={onClose}
      />
      <div className="animate-in slide-in-from-bottom bg-surface fixed right-0 bottom-0 left-0 z-[51] flex max-h-[85vh] flex-col rounded-t-2xl shadow-2xl duration-300 md:hidden">
        <div className="sheet-handle bg-line mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full" />

        <div className="sheet-header border-line flex shrink-0 items-center justify-between border-b p-4 px-5">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-fg text-base font-bold">
              Detail Pesanan
            </h3>
            <span className="bg-accent-soft text-accent rounded-full px-2.5 py-1 font-mono text-xs font-semibold">
              {itemCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-danger hover:bg-danger-soft rounded px-2 py-1 text-xs font-medium"
              >
                Hapus Semua
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="modal-close text-muted hover:bg-fg-soft grid h-8 w-8 place-items-center rounded-lg"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>

        <div className="sheet-items flex-1 overflow-y-auto px-5 py-3">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="border-line-sub flex items-center justify-between border-b py-3 last:border-0"
            >
              <div className="min-w-0 pr-3">
                <div className="text-fg truncate text-xs font-medium">
                  {item.name}
                </div>
                {item.selectedVariants && item.selectedVariants.length > 0 && (
                  <div className="text-accent text-[11px] font-medium">
                    {item.selectedVariants
                      .map((v) => `${v.group}: ${v.label}`)
                      .join(", ")}
                  </div>
                )}
                {item.notes && (
                  <div className="text-muted truncate text-[11px] italic">
                    &quot;{item.notes}&quot;
                  </div>
                )}
                <div className="text-muted mt-0.5 font-mono text-xs">
                  {formatIDR(item.price)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="font-mono text-xs font-semibold">
                  {formatIDR(item.price * item.quantity)}
                </div>
                <div className="border-line inline-flex items-center overflow-hidden rounded-sm border">
                  <button
                    type="button"
                    onClick={() =>
                      item.quantity === 1
                        ? onRemoveItem(item.cartItemId)
                        : onUpdateQuantity(item.cartItemId, -1)
                    }
                    className="text-muted grid h-7 w-7 place-items-center text-xs"
                  >
                    {item.quantity === 1 ? (
                      <TrashIcon size={12} />
                    ) : (
                      <MinusIcon size={12} />
                    )}
                  </button>
                  <span className="w-7 text-center font-mono text-xs font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                    className="text-muted grid h-7 w-7 place-items-center text-xs"
                  >
                    <PlusIcon size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sheet-footer border-line bg-surface shrink-0 border-t p-4 px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
          <div className="mb-3 space-y-1.5 text-xs">
            <div className="text-muted flex justify-between">
              <span>Subtotal</span>
              <span className="text-fg font-mono">{formatIDR(subtotal)}</span>
            </div>
            <div className="text-muted flex justify-between">
              <span>Pajak (11%)</span>
              <span className="text-fg font-mono">{formatIDR(tax)}</span>
            </div>
            <div className="border-line text-fg flex justify-between border-t pt-1 text-sm font-bold">
              <span>Total Tagihan</span>
              <span className="text-accent font-mono">{formatIDR(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCheckout();
            }}
            className="text-surface bg-accent hover:bg-accent-soft flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold"
          >
            <CreditCardIcon size={18} />
            <span>Lanjut Pembayaran</span>
          </button>
        </div>
      </div>
    </>
  );
}
