"use client";

import {
  CloudCheckIcon,
  LockKeyIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";

export function MarqueeStrip() {
  return (
    <section className="overflow-hidden border-b border-slate-200/80 bg-slate-100/90 py-6">
      <div className="animate-marquee flex items-center gap-12 font-mono text-xs font-semibold tracking-widest whitespace-nowrap text-slate-600 uppercase">
        <span className="flex items-center gap-2.5">
          <ShieldCheckIcon size={18} className="text-emerald-600" />
          100% Kebal Offline (IndexedDB)
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <CloudCheckIcon size={18} className="text-emerald-600" />
          Auto-Sync Cloud Tanpa Data Hilang
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <WhatsappLogoIcon size={18} className="text-emerald-600" />
          Kirim Nota WhatsApp &amp; Download PDF
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <ReceiptIcon size={18} className="text-emerald-600" />
          Support Printer Thermal Bluetooth
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <StorefrontIcon size={18} className="text-emerald-600" />
          Cocok untuk Ritel, Warung &amp; Jasa
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <LockKeyIcon size={18} className="text-emerald-600" />
          Proteksi PIN Khusus Owner
        </span>
        <span className="text-slate-300">•</span>

        <span className="flex items-center gap-2.5">
          <ShieldCheckIcon size={18} className="text-emerald-600" />
          100% Kebal Offline (IndexedDB)
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <CloudCheckIcon size={18} className="text-emerald-600" />
          Auto-Sync Cloud Tanpa Data Hilang
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <WhatsappLogoIcon size={18} className="text-emerald-600" />
          Kirim Nota WhatsApp &amp; Download PDF
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <ReceiptIcon size={18} className="text-emerald-600" />
          Support Printer Thermal Bluetooth
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <StorefrontIcon size={18} className="text-emerald-600" />
          Cocok untuk Ritel, Warung &amp; Jasa
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-2.5">
          <LockKeyIcon size={18} className="text-emerald-600" />
          Proteksi PIN Khusus Owner
        </span>
        <span className="text-slate-300">•</span>
      </div>
    </section>
  );
}
