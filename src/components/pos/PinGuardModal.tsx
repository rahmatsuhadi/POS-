"use client";

import { LockKey, X } from "@phosphor-icons/react";
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
    <div className="modal-overlay fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="modal bg-surface animate-in fade-in zoom-in w-full max-w-[360px] overflow-hidden rounded-lg shadow-xl duration-200">
        <div className="modal-header border-line flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
            <LockKey size={20} className="text-accent" />
            <h2 className="font-display text-fg text-sm font-bold">
              Verifikasi PIN Mode Bisnis
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close text-muted hover:bg-fg-soft grid h-8 w-8 place-items-center rounded-lg"
          >
            <X size={18} />
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
                className={`border-line h-3.5 w-3.5 rounded-full border transition-all ${dotIndex < pin.length ? (error ? "animate-shake border-red-500 bg-red-500" : "bg-accent border-accent") : "bg-bg"}`}
              />
            ))}
          </div>

          {error && (
            <p className="mb-3 text-xs font-medium text-red-500">
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
                  className="bg-surface border-line hover:bg-fg-soft rounded-xl border p-3 font-mono text-lg font-bold transition-colors active:scale-95"
                >
                  {btn.digit}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleBackspace}
              className="bg-surface border-line hover:bg-danger-soft hover:text-danger rounded-xl border p-3 text-xs font-bold transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
