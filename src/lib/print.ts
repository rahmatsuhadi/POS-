import type { Transaction } from "../types";

export function formatReceiptText(
  transaction: Transaction,
  storeName = "KALA KOPI",
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
  lines.push(`Pajak 11%: ${formatIDR(transaction.taxAmount)}`);
  lines.push(`TOTAL    : ${formatIDR(transaction.finalAmount)}`);
  lines.push(`Bayar    : ${formatIDR(transaction.paymentAmount)}`);
  lines.push(`Kembali  : ${formatIDR(transaction.changeAmount)}`);
  lines.push(`==============================`);
  lines.push(`   Terima Kasih Atas Kunjungan Anda   `);
  lines.push(`==============================`);

  return lines.join("\n");
}

export function generateWhatsAppReceiptUrl(
  transaction: Transaction,
  storeName = "Kala Kopi",
): string {
  const receiptText = formatReceiptText(transaction, storeName);
  const encodedText = encodeURIComponent(
    `*STRUK TRANSAKSI DIGITAL ${storeName.toUpperCase()}*\n\n\`\`\`\n${receiptText}\n\`\`\``,
  );
  return `https://wa.me/?text=${encodedText}`;
}

export function printThermalReceipt(
  transaction: Transaction,
  storeName = "Kala Kopi",
) {
  const text = formatReceiptText(transaction, storeName);
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
            width: 58mm;
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
