"use client";

import { BluetoothIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  connectAndTestPrintBluetoothPrinter,
  getPrinterSettings,
  printThermalReceipt,
  savePrinterSettings,
} from "../../lib/print";
import type { PrinterSettings, Transaction } from "../../types";
import Button from "../ui/Button";

interface PrinterSettingsCardProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function PrinterSettingsCard({ onShowToast }: PrinterSettingsCardProps) {
  const [settings, setSettings] = useState<PrinterSettings>({
    deviceId: null,
    deviceName: null,
    paperWidth: "58mm",
    autoPrint: false,
  });
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setSettings(getPrinterSettings());
  }, []);

  const handleConnectBluetooth = async () => {
    setConnecting(true);
    try {
      const res = await connectAndTestPrintBluetoothPrinter();
      if (res.success) {
        const updated = getPrinterSettings();
        setSettings(updated);
        if (onShowToast)
          onShowToast(`Terhubung ke printer: ${res.deviceName}`, "success");
      } else {
        if (onShowToast)
          onShowToast(`Gagal koneksi Bluetooth: ${res.error}`, "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error koneksi printer";
      if (onShowToast) onShowToast(msg, "error");
    } finally {
      setConnecting(false);
    }
  };

  const handleUpdatePaperWidth = (paperWidth: "58mm" | "80mm") => {
    const updated = savePrinterSettings({ paperWidth });
    setSettings(updated);
    if (onShowToast)
      onShowToast(`Lebar kertas diubah ke ${paperWidth}`, "success");
  };

  const handleUpdateAutoPrint = (autoPrint: boolean) => {
    const updated = savePrinterSettings({ autoPrint });
    setSettings(updated);
    if (onShowToast)
      onShowToast(
        `Cetak otomatis ${autoPrint ? "diaktifkan" : "dinonaktifkan"}`,
        "success",
      );
  };

  const handleTestPrint = () => {
    const dummyTransaction: Transaction = {
      id: "tx-test-print-001",
      invoiceNumber: "INV-TEST-001",
      subtotal: 35000,
      taxAmount: 0,
      discountAmount: 0,
      finalAmount: 35000,
      paymentMethod: "cash",
      paymentAmount: 50000,
      changeAmount: 15000,
      items: [
        {
          productId: "prod-1",
          name: "Tes Cetak Kopi Signature",
          price: 25000,
          quantity: 1,
          subtotal: 25000,
        },
        {
          productId: "prod-4",
          name: "Croissant Butter",
          price: 10000,
          quantity: 1,
          subtotal: 10000,
        },
      ],
      status: "completed",
      synced: true,
      createdAt: new Date().toISOString(),
    };

    printThermalReceipt(
      dummyTransaction,
      "Kala POS - Struk Pengujian",
      "Struk Pengujian Berhasil!",
    );
    if (onShowToast)
      onShowToast("Perintah tes cetak struk terkirim!", "success");
  };

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">
        <div>
          <h2 className="text-fg font-bold text-lg">
            Hardware &amp; Printer Thermal Bluetooth
          </h2>
          <p className="text-muted text-xs">
            Hubungkan kasir ke printer thermal Bluetooth mini ESC/POS untuk
            cetak struk.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Device Status & Scan Button */}
        <div className="bg-bg border-border rounded-lg border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-600 grid h-10 w-10 place-items-center rounded-full">
              <BluetoothIcon size={20} />
            </div>
            <div>
              <p className="text-fg font-medium text-sm">
                {settings.deviceName || "Belum Ada Printer Bluetooth Terhubung"}
              </p>
              <p className="text-muted text-xs">
                {settings.deviceName
                  ? "Siap mencetak nota transaksi"
                  : "Pindai perangkat Web Bluetooth kasir"}
              </p>
            </div>
          </div>

          <div>
            <Button
              type="button"
              size="sm"
              loading={connecting}
              onClick={handleConnectBluetooth}
            >
              <BluetoothIcon size={16} />
              <span>Pindai Printer Bluetooth</span>
            </Button>
          </div>
        </div>

        {/* Printer Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Paper Width Selection */}
          <div className="bg-bg border-border rounded-lg border p-4">
            <span className="text-fg mb-2 block text-xs font-semibold">
              Lebar Kertas Thermal
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleUpdatePaperWidth("58mm")}
                className={`p-3 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                  settings.paperWidth === "58mm"
                    ? "border-accent bg-accent-soft/30 text-fg"
                    : "border-border bg-surface text-muted hover:border-line"
                }`}
              >
                58 mm (Mini Thermal)
              </button>
              <button
                type="button"
                onClick={() => handleUpdatePaperWidth("80mm")}
                className={`p-3 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                  settings.paperWidth === "80mm"
                    ? "border-accent bg-accent-soft/30 text-fg"
                    : "border-border bg-surface text-muted hover:border-line"
                }`}
              >
                80 mm (Standar POS)
              </button>
            </div>
          </div>

          {/* Auto Print Toggle */}
          <div className="bg-bg border-border rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="text-fg font-semibold text-xs mb-0.5">
                Cetak Struk Otomatis
              </p>
              <p className="text-muted text-xs">
                Otomatis mencetak nota saat transaksi kasir selesai.
              </p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded-sm border-line text-accent focus:ring-accent cursor-pointer"
              checked={settings.autoPrint}
              onChange={(e) => handleUpdateAutoPrint(e.target.checked)}
            />
          </div>
        </div>

        {/* Test Print Section */}
        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestPrint}
          >
            <PlayIcon size={16} />
            <span>Tes Cetak Struk</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
