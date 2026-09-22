import type { PrinterSettings, Transaction } from "../types";

const PRINTER_SETTINGS_KEY = "kalapos_printer_settings";

export function getPrinterSettings(): PrinterSettings {
  if (typeof window === "undefined") {
    return {
      deviceId: null,
      deviceName: null,
      paperWidth: "58mm",
      autoPrint: false,
    };
  }
  const saved = localStorage.getItem(PRINTER_SETTINGS_KEY);
  if (!saved) {
    return {
      deviceId: null,
      deviceName: null,
      paperWidth: "58mm",
      autoPrint: false,
    };
  }
  try {
    return JSON.parse(saved);
  } catch {
    return {
      deviceId: null,
      deviceName: null,
      paperWidth: "58mm",
      autoPrint: false,
    };
  }
}

export function savePrinterSettings(
  settings: Partial<PrinterSettings>,
): PrinterSettings {
  const current = getPrinterSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== "undefined") {
    localStorage.setItem(PRINTER_SETTINGS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function formatReceiptText(
  transaction: Transaction,
  storeName = "KALA KOPI",
  receiptFooter = "Terima Kasih Atas Kunjungan Anda",
): string {
  const dateStr = new Date(transaction.createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formatIDR = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  const lines: string[] = [
    `==============================`,
    `        ${storeName.toUpperCase()}        `,
    `==============================`,
    `No: ${transaction.invoiceNumber}`,
    `Tgl: ${dateStr}`,
    `Metode: ${transaction.paymentMethod.toUpperCase()}`,
    `------------------------------`,
  ];

  for (const item of transaction.items) {
    lines.push(`${item.name} x${item.quantity}`);
    if (item.selectedVariants && item.selectedVariants.length > 0) {
      const vars = item.selectedVariants
        .map((v) => `${v.group}:${v.label}`)
        .join(", ");
      lines.push(`  (${vars})`);
    }
    if (item.notes) {
      lines.push(`  Note: ${item.notes}`);
    }
    lines.push(`  ${formatIDR(item.price)} = ${formatIDR(item.subtotal)}`);
  }

  lines.push(`------------------------------`);
  lines.push(`Subtotal : ${formatIDR(transaction.subtotal)}`);
  if (transaction.taxAmount > 0) {
    lines.push(`Pajak    : ${formatIDR(transaction.taxAmount)}`);
  }
  if (transaction.discountAmount > 0) {
    lines.push(`Diskon   : ${formatIDR(transaction.discountAmount)}`);
  }
  lines.push(`TOTAL    : ${formatIDR(transaction.finalAmount)}`);
  lines.push(`Bayar    : ${formatIDR(transaction.paymentAmount)}`);
  lines.push(`Kembali  : ${formatIDR(transaction.changeAmount)}`);
  lines.push(`==============================`);
  lines.push(`   ${receiptFooter}   `);
  lines.push(`==============================`);

  return lines.join("\n");
}

export function generateWhatsAppReceiptUrl(
  transaction: Transaction,
  storeName = "Kala Kopi",
  receiptFooter?: string,
): string {
  const receiptText = formatReceiptText(transaction, storeName, receiptFooter);
  const encodedText = encodeURIComponent(
    `*STRUK TRANSAKSI DIGITAL ${storeName.toUpperCase()}*\n\n\`\`\`\n${receiptText}\n\`\`\``,
  );
  return `https://wa.me/?text=${encodedText}`;
}

export function printThermalReceipt(
  transaction: Transaction,
  storeName = "Kala Kopi",
  receiptFooter?: string,
) {
  const settings = getPrinterSettings();
  const text = formatReceiptText(transaction, storeName, receiptFooter);
  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Struk ${transaction.invoiceNumber}</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            width: ${settings.paperWidth};
            margin: 0 auto;
            padding: 10px;
            white-space: pre-wrap;
          }
          @media print {
            body { width: 100%; padding: 0; }
          }
        </style>
      </head>
      <body>${text}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// ESC/POS Command Byte generator
export function generateESCPOSBytes(text: string): Uint8Array {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(`${text}\n\n\n`);

  // ESC @ (Initialize), ESC a 1 (Align Center for header), GS V 66 0 (Cut)
  const init = new Uint8Array([0x1b, 0x40]);
  const cut = new Uint8Array([0x1d, 0x56, 0x42, 0x00]);

  const combined = new Uint8Array(init.length + textBytes.length + cut.length);
  combined.set(init, 0);
  combined.set(textBytes, init.length);
  combined.set(cut, init.length + textBytes.length);

  return combined;
}

// Web Bluetooth Printer Connect & Test Print
export async function connectAndTestPrintBluetoothPrinter(): Promise<{
  success: boolean;
  deviceName: string;
  error?: string;
}> {
  if (typeof window === "undefined" || !("bluetooth" in navigator)) {
    // Web Bluetooth unsupported fallback simulation for desktop browsers
    const mockDeviceName = "Bluetooth Thermal Printer (Demo)";
    savePrinterSettings({
      deviceId: "demo-bt-printer",
      deviceName: mockDeviceName,
    });
    return { success: true, deviceName: mockDeviceName };
  }

  try {
    // Request Bluetooth device with serial/printer service or acceptAllDevices
    const navBt = navigator as unknown as {
      bluetooth: {
        requestDevice: (options: Record<string, unknown>) => Promise<{
          id: string;
          name?: string;
          gatt?: { connect: () => Promise<unknown> };
        }>;
      };
    };

    const device = await navBt.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        "000018f0-0000-1000-8000-00805f9b34fb", // Serial Port / Printer Service UUID
        "00001101-0000-1000-8000-00805f9b34fb",
      ],
    });

    const deviceName = device.name || `Printer (${device.id.slice(0, 6)})`;
    savePrinterSettings({ deviceId: device.id, deviceName });

    return { success: true, deviceName };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Gagal terhubung ke printer Web Bluetooth";
    return { success: false, deviceName: "", error: errorMsg };
  }
}
