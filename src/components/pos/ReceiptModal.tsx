"use client";

import {
  CheckCircleIcon,
  PrinterIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { generateWhatsAppReceiptUrl, printThermalReceipt } from "@/lib/print";
import type { Transaction } from "@/types";
import { formatIDR } from "@/utils/currency";

interface ReceiptModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onNewTransaction: () => void;
}

export function ReceiptModal({
  isOpen,
  transaction,
  onNewTransaction,
}: ReceiptModalProps) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    printThermalReceipt(transaction);
  };

  const handleWhatsApp = () => {
    const url = generateWhatsAppReceiptUrl(transaction);
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-zoom-in bg-surface w-full max-w-[440px] overflow-hidden rounded-lg shadow-xl duration-200">
        <div className="p-6">
          <div className="mb-5 text-center">
            <div className="bg-accent-soft text-accent mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full duration-500">
              <CheckCircleIcon size={38} weight="fill" />
            </div>
            <h3 className="font-display text-fg mb-0.5 text-lg font-bold">
              Pembayaran Berhasil!
            </h3>
            <p className="text-muted text-xs">
              Metode:{" "}
              <span className="text-fg font-semibold capitalize">
                {transaction.paymentMethod}
              </span>
            </p>
          </div>

          <div className="border-line bg-bg mb-5 space-y-1.5 rounded-md border p-4 font-mono text-xs">
            <div className="text-muted flex justify-between">
              <span>No. Nota</span>
              <span className="text-fg font-semibold">
                {transaction.invoiceNumber}
              </span>
            </div>
            <div className="text-muted flex justify-between">
              <span>Waktu</span>
              <span className="text-fg">
                {new Date(transaction.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="border-line my-2 space-y-1 border-t pt-2">
              {transaction.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex justify-between"
                >
                  <span className="text-fg max-w-[200px] truncate">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-fg font-semibold">
                    {formatIDR(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-line space-y-1 border-t pt-2 text-xs">
              <div className="text-muted flex justify-between">
                <span>Subtotal</span>
                <span>{formatIDR(transaction.subtotal)}</span>
              </div>
              <div className="text-muted flex justify-between">
                <span>Pajak (11%)</span>
                <span>{formatIDR(transaction.taxAmount)}</span>
              </div>
              <div className="text-fg flex justify-between pt-1 text-sm font-bold">
                <span>Total</span>
                <span className="text-accent">
                  {formatIDR(transaction.finalAmount)}
                </span>
              </div>
              {transaction.paymentMethod === "cash" && (
                <>
                  <div className="text-muted flex justify-between pt-1">
                    <span>Dibayar</span>
                    <span>{formatIDR(transaction.paymentAmount)}</span>
                  </div>
                  <div className="text-accent flex justify-between font-semibold">
                    <span>Kembalian</span>
                    <span>{formatIDR(transaction.changeAmount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="text-fg hover:border-fg border-line bg-surface flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all"
              >
                <PrinterIcon size={16} />
                <span>Cetak Struk</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100"
              >
                <WhatsappLogoIcon size={16} weight="fill" />
                <span>Share WA</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onNewTransaction}
              className="primary bg-accent text-surface hover:bg-accent-hover mt-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-semibold transition-all"
            >
              <span>Transaksi Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
