"use client";

import {
  CreditCardIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { calculateCartTotals } from "@/lib/pos";
import type { CartItem } from "@/types";
import Button from "../ui/Button";

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export function CartSidebar({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}: CartSidebarProps) {
  const { subtotal, tax, total, itemCount } = calculateCartTotals(cart);
  const formatIDR = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  return (
    <aside
      className="cart bg-surface border-line flex h-full w-[380px] shrink-0 flex-col overflow-hidden border-l"
      data-od-id="cart-sidebar"
    >
      {/* Header */}
      <div className="cart-header border-line flex shrink-0 items-center justify-between border-b p-4 px-5">
        <div className="flex items-center gap-2.5">
          <h2 className="cart-title text-fg text-base font-bold">Pesanan</h2>
          <span className="cart-count bg-accent-soft text-accent border border-accent/20 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {itemCount}
          </span>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="cart-clear text-danger hover:bg-danger-soft inline-flex items-center gap-1 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          >
            <TrashIcon size={14} />
            <span>Hapus</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="cart-items flex-1 overflow-y-auto py-2">
        {cart.length === 0 ? (
          <div className="cart-empty text-muted flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
            <ShoppingBagIcon size={48} className="opacity-25" />
            <p className="text-sm font-medium">Belum ada produk dipilih</p>
            <p className="text-muted text-xs opacity-80">
              Pilih produk dari katalog untuk memulai transaksi
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const hasVariants =
              item.selectedVariants && item.selectedVariants.length > 0;
            const isAtMaxStock =
              item.trackStock && item.quantity >= item.currentStock;

            return (
              <div
                key={item.cartItemId}
                className="border-line-sub hover:bg-surface-sub grid grid-cols-[1fr_auto] items-center gap-2 border-b px-5 py-3 transition-colors last:border-0"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-fg truncate text-xs font-semibold">
                    {item.name}
                  </div>

                  {hasVariants && (
                    <div className="text-accent mt-0.5 text-[11px] leading-tight font-medium">
                      {item.selectedVariants
                        .map((v) => `${v.group}: ${v.label}`)
                        .join(", ")}
                    </div>
                  )}

                  {item.notes && (
                    <div className="text-muted mt-0.5 max-w-[180px] truncate text-[11px] italic">
                      &quot;{item.notes}&quot;
                    </div>
                  )}

                  <div className="text-muted mt-1 text-[11px] tabular-nums">
                    {formatIDR(item.price)}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-fg font-bold text-xs tabular-nums">
                    {formatIDR(item.price * item.quantity)}
                  </div>

                  <div className="qty-stepper border-line bg-surface inline-flex items-center overflow-hidden rounded-sm border">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity === 1
                          ? onRemoveItem(item.cartItemId)
                          : onUpdateQuantity(item.cartItemId, -1)
                      }
                      className="qty-btn text-muted hover:bg-danger-soft hover:text-danger grid h-7 w-7 place-items-center text-xs transition-colors cursor-pointer"
                      title={item.quantity === 1 ? "Hapus Item" : "Kurangi"}
                    >
                      {item.quantity === 1 ? (
                        <TrashIcon size={12} />
                      ) : (
                        <MinusIcon size={12} />
                      )}
                    </button>

                    <span className="qty-val border-line w-8 border-x text-center text-xs leading-7 font-semibold select-none tabular-nums">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={isAtMaxStock}
                      onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                      className="qty-btn text-muted hover:text-fg grid h-7 w-7 place-items-center text-xs transition-colors hover:bg-surface-sub disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title={isAtMaxStock ? "Stok Maksimal" : "Tambah"}
                    >
                      <PlusIcon size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Pay Button */}
      {cart.length > 0 && (
        <div className="border-line bg-surface shrink-0 border-t p-5">
          <div className="mb-4 flex flex-col gap-2">
            <div className="text-muted flex justify-between text-xs">
              <span>Subtotal</span>
              <span className="text-fg font-medium tabular-nums">
                {formatIDR(subtotal)}
              </span>
            </div>
            <div className="text-muted flex justify-between text-xs">
              <span>Pajak (11%)</span>
              <span className="text-fg font-medium tabular-nums">
                {formatIDR(tax)}
              </span>
            </div>
            <div className="text-fg border-line mt-1 flex justify-between border-t pt-2 text-base font-bold">
              <span>Total Tagihan</span>
              <span className="text-accent font-extrabold tabular-nums">
                {formatIDR(total)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={onOpenCheckout}
            className="w-full h-12 text-sm font-bold shadow-xs flex items-center justify-center gap-2"
          >
            <CreditCardIcon size={18} weight="bold" />
            <span>Bayar</span>
            <span className="ml-1 rounded-sm bg-white/20 px-2 py-0.5 text-xs font-semibold tabular-nums">
              {formatIDR(total)}
            </span>
          </Button>
        </div>
      )}
    </aside>
  );
}
