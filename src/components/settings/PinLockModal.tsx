"use client";

import { LockKeyIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getStoreProfile } from "../../lib/store";

interface PinLockModalProps {
  isOpen: boolean;
  onUnlocked: () => void;
  onClose?: () => void;
}

export function PinLockModal({
  isOpen,
  onUnlocked,
  onClose,
}: PinLockModalProps) {
  const [expectedPin, setExpectedPin] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function loadPin() {
      try {
        const profile = await getStoreProfile();
        if (profile) {
          setExpectedPin(profile.adminPin || null);
        }
      } catch (err) {
        console.error("Gagal membaca PIN untuk modal:", err);
      }
    }
    loadPin();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      const reqLen = expectedPin?.length || 6;
      if (nextPin.length === reqLen) {
        if (expectedPin && nextPin === expectedPin) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("pos_admin_unlocked", "true");
          }
          onUnlocked();
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
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border-border w-full max-w-[360px] overflow-hidden rounded-2xl border shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <LockKeyIcon size={20} className="text-accent" />
            <h2 className="text-fg font-semibold text-sm">
              Verifikasi PIN Admin
            </h2>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-muted hover:bg-fg-soft rounded-lg p-1 transition-colors"
            >
              <XIcon size={18} />
            </button>
          )}
        </div>

        <div className="p-6 text-center">
          <p className="text-muted mb-4 text-xs">
            Akses ke halaman ini dilindungi PIN Admin (Mode Bisnis aktif).
          </p>

          <div className="mb-6 flex justify-center gap-2">
            {Array.from(
              { length: expectedPin?.length || 6 },
              (_, idx) => idx,
            ).map((idx) => (
              <div
                key={idx}
                className={`h-3.5 w-3.5 rounded-full border transition-all ${
                  idx < pin.length
                    ? error
                      ? "border-red-500 bg-red-500 animate-shake"
                      : "border-accent bg-accent"
                    : "border-line bg-bg"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="mb-3 text-xs font-semibold text-red-500">
              PIN Admin salah. Silakan coba lagi.
            </p>
          )}

          <div className="mx-auto grid max-w-[240px] grid-cols-3 gap-2">
            {[
              { id: "k1", key: "1" },
              { id: "k2", key: "2" },
              { id: "k3", key: "3" },
              { id: "k4", key: "4" },
              { id: "k5", key: "5" },
              { id: "k6", key: "6" },
              { id: "k7", key: "7" },
              { id: "k8", key: "8" },
              { id: "k9", key: "9" },
              { id: "k-empty", key: "" },
              { id: "k0", key: "0" },
              { id: "k-del", key: "del" },
            ].map((item) => {
              if (item.key === "") return <div key={item.id} />;
              if (item.key === "del") {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={handleBackspace}
                    className="bg-bg hover:bg-fg-soft border-line text-fg rounded-xl border p-3 text-xs font-bold transition-colors"
                  >
                    Hapus
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleDigit(item.key)}
                  className="bg-bg hover:bg-fg-soft border-line text-fg rounded-xl border p-3 font-mono text-lg font-bold transition-colors active:scale-95"
                >
                  {item.key}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
