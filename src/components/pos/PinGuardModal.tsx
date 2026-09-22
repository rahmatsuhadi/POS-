"use client";

import { BackspaceIcon, LockKeyIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";

interface PinGuardModalProps {
  isOpen: boolean;
  targetUrl: string;
  expectedPin?: string | null;
  onClose: () => void;
  onSuccess: (targetUrl: string) => void;
}

export function PinGuardModal({
  isOpen,
  targetUrl,
  expectedPin,
  onClose,
  onSuccess,
}: PinGuardModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === (expectedPin?.length || 6)) {
        if (expectedPin && nextPin === expectedPin) {
          onSuccess(targetUrl);
          setPin("");
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="modal-overlay fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="modal bg-surface border-border animate-in zoom-in w-full max-w-[360px] overflow-hidden rounded-xl border shadow-2xl duration-200">
        <div className="modal-header border-border flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
            <LockKeyIcon size={20} className="text-accent" />
            <h2 className="text-fg text-base font-bold">
              Verifikasi PIN Mode Bisnis
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-fg hover:bg-surface-sub grid h-8 w-8 place-items-center rounded-md transition-colors cursor-pointer"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-6 text-center">
          <p className="text-muted mb-4 text-xs">
            Masukkan PIN Otorisasi Admin untuk keluar dari Layar Kasir.
          </p>

          <div className="mb-6 flex justify-center gap-2">
            {Array.from(
              { length: expectedPin?.length || 6 },
              (_, dotIndex) => dotIndex,
            ).map((dotIndex) => (
              <div
                key={dotIndex}
                className={`h-3.5 w-3.5 rounded-full border transition-all ${
                  dotIndex < pin.length
                    ? error
                      ? "animate-shake border-danger bg-danger"
                      : "bg-accent border-accent"
                    : "border-line bg-bg"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="mb-3 text-xs font-medium text-danger">
              PIN salah. Silakan coba lagi.
            </p>
          )}

          <div className="numpad mx-auto grid max-w-[240px] grid-cols-3 gap-2">
            {[
              { id: "digit-1", digit: "1" },
              { id: "digit-2", digit: "2" },
              { id: "digit-3", digit: "3" },
              { id: "digit-4", digit: "4" },
              { id: "digit-5", digit: "5" },
              { id: "digit-6", digit: "6" },
              { id: "digit-7", digit: "7" },
              { id: "digit-8", digit: "8" },
              { id: "digit-9", digit: "9" },
              { id: "digit-empty", digit: "" },
              { id: "digit-0", digit: "0" },
            ].map((btn) => {
              if (btn.digit === "") return <div key={btn.id} />;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleDigit(btn.digit)}
                  className="bg-surface border-line hover:bg-surface-sub text-fg rounded-md border p-3 text-lg font-bold transition-all active:scale-95 cursor-pointer tabular-nums select-none"
                >
                  {btn.digit}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleBackspace}
              className="bg-surface border-line hover:bg-danger-soft hover:text-danger text-muted grid place-items-center rounded-md border p-3 transition-colors cursor-pointer active:scale-95"
              title="Hapus Digit"
            >
              <BackspaceIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
