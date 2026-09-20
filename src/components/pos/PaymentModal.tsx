"use client";

import {
  BackspaceIcon,
  CheckCircleIcon,
  MoneyIcon,
  QrCodeIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { calculateCartTotals } from "@/lib/pos";
import type { CartItem } from "@/types";
import { formatIDR } from "@/utils/currency";

interface PaymentModalProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onCompletePayment: (
    paymentMethod: "cash" | "transfer" | "qris",
    paymentAmount: number,
  ) => Promise<unknown>;
}

export function PaymentModal({
  isOpen,
  cart,
  onClose,
  onCompletePayment,
}: PaymentModalProps) {
  const { total } = calculateCartTotals(cart);
  const [payTab, setPayTab] = useState<"cash" | "qris" | "transfer">("cash");
  const [cashGivenText, setCashGivenText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrisTimer, setQrisTimer] = useState(299); // 04:59

  useEffect(() => {
    if (isOpen) {
      setPayTab("cash");
      setCashGivenText(total.toString());
      setQrisTimer(299);
      setIsProcessing(false);
    }
  }, [isOpen, total]);

  // QRIS Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && payTab === "qris" && qrisTimer > 0) {
      timer = setInterval(() => {
        setQrisTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, payTab, qrisTimer]);

  if (!isOpen) return null;

  const cashGivenNumber = Number.parseInt(cashGivenText || "0", 10);
  const changeAmount = Math.max(0, cashGivenNumber - total);
  const isCashSufficient = cashGivenNumber >= total;

  const handleNumpadClick = (numStr: string) => {
    if (numStr === "back") {
      setCashGivenText((prev) => prev.slice(0, -1));
    } else if (numStr === "00") {
      setCashGivenText((prev) => (prev === "0" || !prev ? "0" : `${prev}00`));
    } else {
      setCashGivenText((prev) =>
        prev === "0" || !prev ? numStr : prev + numStr,
      );
    }
  };

  const handleQuickCash = (amountType: "exact" | number) => {
    if (amountType === "exact") {
      setCashGivenText(total.toString());
    } else {
      setCashGivenText(amountType.toString());
    }
  };

  const handleConfirmPay = async (
    method: "cash" | "qris" | "transfer",
    amount: number,
  ) => {
    setIsProcessing(true);
    try {
      await onCompletePayment(method, amount);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatQrisTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="modal-overlay fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="modal animate-zoom-in bg-surface no-scrollbar max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-lg shadow-xl duration-200">
        {/* Header */}
        <div className="modal-header border-line flex items-center justify-between border-b p-5">
          <h2 className="font-display text-fg text-lg font-bold">Pembayaran</h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-close text-muted hover:bg-fg-soft grid h-8 w-8 place-items-center rounded-lg transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Total Tagihan */}
        <div className="modal-total-display border-line bg-bg border-b px-6 py-4 text-center">
          <div className="text-muted mb-1 text-xs">Total Tagihan</div>
          <div className="modal-total-amount text-fg font-mono text-3xl font-extrabold tracking-tight">
            {formatIDR(total)}
          </div>
        </div>

        {/* Tabs */}
        <div className="pay-tabs border-line bg-bg m-5 flex gap-1 overflow-hidden rounded-xl border p-1">
          <button
            type="button"
            onClick={() => setPayTab("cash")}
            className={`pay-tab flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${payTab === "cash" ? "bg-surface text-fg font-semibold shadow-sm" : "hover:text-fg text-muted"}`}
          >
            <MoneyIcon size={18} />
            <span>Tunai</span>
          </button>

          <button
            type="button"
            onClick={() => setPayTab("qris")}
            className={`pay-tab flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${payTab === "qris" ? "bg-surface text-fg font-semibold shadow-sm" : "hover:text-fg text-muted"}`}
          >
            <QrCodeIcon size={18} />
            <span>QRIS</span>
          </button>

          {/* <button type="button" onClick={() => setPayTab("transfer")} className={`pay-tab flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${payTab === "transfer" ? "bg-surface text-fg font-semibold shadow-sm" : "hover:text-fg text-muted"}`}>
            <BankIcon size={18} />
            <span>Transfer</span>
          </button> */}
        </div>

        {/* Cash Panel */}
        {payTab === "cash" && (
          <div className="px-6 pb-6">
            <div className="border-line bg-bg mb-4 rounded-xl border p-3.5 text-right">
              <div className="text-muted mb-0.5 text-[11px]">
                Jumlah Uang Diterima
              </div>
              <div className="text-fg font-mono text-2xl font-bold">
                {formatIDR(cashGivenNumber)}
              </div>
            </div>

            {/* Quick Cash Buttons */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickCash("exact")}
                className="hover:text-surface border-accent bg-accent-soft text-accent hover:bg-accent rounded-lg border p-2.5 font-mono text-xs font-semibold transition-all"
              >
                Uang Pas ({formatIDR(total)})
              </button>
              <button
                type="button"
                onClick={() => handleQuickCash(20000)}
                className="bg-surface border-line text-fg hover:border-accent rounded-lg border p-2.5 font-mono text-xs font-medium transition-all"
              >
                Rp 20.000
              </button>
              <button
                type="button"
                onClick={() => handleQuickCash(50000)}
                className="bg-surface border-line text-fg hover:border-accent rounded-lg border p-2.5 font-mono text-xs font-medium transition-all"
              >
                Rp 50.000
              </button>
              <button
                type="button"
                onClick={() => handleQuickCash(100000)}
                className="bg-surface border-line text-fg hover:border-accent rounded-lg border p-2.5 font-mono text-xs font-medium transition-all"
              >
                Rp 100.000
              </button>
            </div>

            {/* Numpad */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"].map(
                (num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumpadClick(num)}
                    className="numpad-btn bg-surface border-line hover:bg-fg-soft grid place-items-center rounded-lg border p-3 font-mono text-lg font-bold transition-colors"
                  >
                    {num}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => handleNumpadClick("back")}
                className="numpad-btn bg-surface border-line hover:bg-danger-soft hover:text-danger grid place-items-center rounded-lg border p-3 font-mono text-sm font-bold transition-colors"
              >
                <BackspaceIcon size={20} />
              </button>
            </div>

            {/* Change Display */}
            {isCashSufficient && (
              <div className="bg-accent-soft mb-4 flex items-center justify-between rounded-xl p-3.5">
                <span className="text-accent text-xs font-semibold">
                  Kembalian
                </span>
                <span className="text-accent font-mono text-xl font-bold">
                  {formatIDR(changeAmount)}
                </span>
              </div>
            )}

            <button
              type="button"
              disabled={!isCashSufficient || isProcessing}
              onClick={() => handleConfirmPay("cash", cashGivenNumber)}
              className="text-surface bg-accent disabled:hover:bg-accent hover:bg-accent-hover flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-all disabled:opacity-40"
            >
              {isProcessing ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <CheckCircleIcon size={18} weight="bold" />
                  <span>Selesaikan Pembayaran Tunai</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* QRIS Panel */}
        {payTab === "qris" && (
          <div className="px-6 pb-6 text-center">
            <div className="py-2">
              <div className="border-line bg-bg mx-auto mb-4 grid h-48 w-48 place-items-center rounded-2xl border-2 border-dashed p-3">
                <div className="grid h-36 w-36 grid-cols-7 grid-rows-7 gap-1">
                  {Array.from({ length: 49 }, (_, cellId) => cellId).map(
                    (cellId) => {
                      const isWhite = (cellId * 7 + 3) % 5 === 0;
                      return (
                        <div
                          key={cellId}
                          className={`rounded-[1px] ${isWhite ? "bg-transparent" : "bg-fg"}`}
                        />
                      );
                    },
                  )}
                </div>
              </div>

              <div className="text-fg mb-1 font-mono text-2xl font-bold">
                {formatQrisTimer(qrisTimer)}
              </div>
              <p className="text-muted mb-4 text-xs">
                Scan QRIS di atas menggunakan GoPay, OVO, ShopeePay, DANA, atau
                M-Banking.
              </p>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleConfirmPay("qris", total)}
                className="qris-simulate hover:text-surface border-accent bg-accent-soft text-accent hover:bg-accent w-full rounded-xl border py-3 text-xs font-semibold transition-all"
              >
                {isProcessing ? "Memproses..." : "Simulasi Pembayaran Berhasil"}
              </button>
            </div>
          </div>
        )}

        {/* Transfer Panel */}
        {payTab === "transfer" && (
          <div className="px-6 pb-6">
            <div className="border-line bg-bg mb-4 space-y-3 rounded-xl border p-4">
              <div className="border-line flex items-center justify-between border-b pb-2 text-xs">
                <span className="text-muted font-medium">Bank BCA</span>
                <span className="text-fg font-mono font-bold">
                  8830-1928-4411
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted font-medium">Atas Nama</span>
                <span className="text-fg font-semibold">
                  PT KALA KOPI NUSANTARA
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleConfirmPay("transfer", total)}
              className="btn-complete text-surface bg-accent hover:bg-accent-hover flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all"
            >
              {isProcessing ? (
                "Memproses..."
              ) : (
                <>
                  <CheckCircleIcon size={18} weight="bold" />
                  <span>Konfirmasi Transfer Berhasil</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
