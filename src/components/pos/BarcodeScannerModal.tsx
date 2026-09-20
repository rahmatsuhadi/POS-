"use client";

import { BarcodeIcon, CameraIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcodeText: string) => void;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onScan,
}: BarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [manualBarcode, setManualBarcode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError("Kamera tidak didukung pada perangkat / browser ini.");
      }
    } catch (_err) {
      setCameraError(
        "Gagal mengakses kamera. Pastikan izin akses kamera diberikan.",
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="modal animate-in fade-in zoom-in bg-surface w-full max-w-[440px] overflow-hidden rounded-lg shadow-xl duration-200">
        <div className="modal-header border-line flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
            <BarcodeIcon size={22} className="text-accent" />
            <h2 className="font-display text-fg text-base font-bold">
              Scan Barcode Produk
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close text-muted hover:bg-fg-soft grid h-8 w-8 place-items-center rounded-lg transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center p-5">
          <div className="border-line relative mb-4 grid aspect-video w-full place-items-center overflow-hidden rounded-sm border bg-black">
            {cameraError ? (
              <div className="p-4 text-center text-xs text-red-400">
                <CameraIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p>{cameraError}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                <div className="border-accent pointer-events-none absolute inset-0 m-8 flex animate-pulse items-center justify-center rounded-md border-2 border-dashed opacity-80">
                  <div className="bg-accent h-0.5 w-full shadow-[0_0_8px_var(--accent)]" />
                </div>
              </>
            )}
          </div>

          <p className="text-muted mb-4 text-center text-xs">
            Arahkan kamera ke kode barcode produk atau masukkan nomor secara
            manual di bawah.
          </p>

          <form onSubmit={handleManualSubmit} className="flex w-full gap-2">
            <input
              type="text"
              placeholder="Masukkan kode barcode..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              className="focus:border-accent text-fg border-line bg-bg flex-1 rounded-md border px-3.5 py-2.5 font-mono text-xs focus:outline-none"
            />
            <button
              type="submit"
              disabled={!manualBarcode.trim()}
              className="text-surface bg-accent hover:bg-accent-hover rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors disabled:opacity-40"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
