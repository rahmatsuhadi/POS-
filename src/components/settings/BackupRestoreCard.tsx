"use client";

import { DownloadSimpleIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { exportBackupJSON, importBackupJSON } from "../../lib/sync";
import Button from "../ui/Button";

interface BackupRestoreCardProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function BackupRestoreCard({ onShowToast }: BackupRestoreCardProps) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportBackupJSON();
      if (onShowToast)
        onShowToast("File cadangan JSON berhasil diunduh!", "success");
    } catch (err) {
      console.error("Gagal ekspor JSON:", err);
      if (onShowToast) onShowToast("Gagal mengunduh cadangan JSON", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !confirm(
        "Peringatan: Mengimpor file cadangan akan memperbarui/menggantikan data lokal Anda. Lanjutkan?",
      )
    ) {
      e.target.value = "";
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const res = await importBackupJSON(text);
      if (onShowToast) {
        onShowToast(res.message, res.success ? "success" : "error");
      }
    } catch (err) {
      console.error("Gagal impor JSON:", err);
      if (onShowToast) onShowToast("Gagal membaca file JSON cadangan", "error");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">
        <div>
          <h2 className="text-fg font-bold text-lg">
            Cadangan &amp; Pemulihan Manual (File JSON)
          </h2>
          <p className="text-muted text-xs">
            Ekspor atau impor seluruh data profil, katalog, dan transaksi dalam
            file JSON offline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export JSON Card */}
        <div className="bg-bg border-border rounded-lg border p-5 flex flex-col justify-between">
          <div>
            <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-md w-fit mb-3">
              <DownloadSimpleIcon size={22} />
            </div>
            <h3 className="text-fg font-semibold text-base mb-1">
              Ekspor Cadangan JSON
            </h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Unduh file `kalapos-backup-YYYY-MM-DD.json` berisi seluruh basis
              data toko Anda untuk disimpan di HP/Laptop.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            loading={exporting}
            onClick={handleExport}
            className="w-full"
          >
            <DownloadSimpleIcon size={16} />
            <span>Ekspor Backup JSON</span>
          </Button>
        </div>

        {/* Import JSON Card */}
        <div className="bg-bg border-border rounded-lg border p-5 flex flex-col justify-between">
          <div>
            <div className="bg-blue-500/10 text-blue-600 p-2.5 rounded-md w-fit mb-3">
              <UploadSimpleIcon size={22} />
            </div>
            <h3 className="text-fg font-semibold text-base mb-1">
              Impor Cadangan JSON
            </h3>
            <p className="text-muted text-xs leading-relaxed mb-4">
              Unggah file cadangan `.json` untuk memulihkan seluruh data profil,
              kategori, produk, dan riwayat transaksi.
            </p>
          </div>

          <label className="border-2 border-line hover:bg-surface-sub text-fg font-medium h-8 px-3 rounded-sm text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center select-none">
            {importing ? (
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="animate-spin h-3.5 w-3.5 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Memproses Impor...</span>
              </span>
            ) : (
              <>
                <UploadSimpleIcon size={16} />
                <span>Pilih File Backup JSON</span>
              </>
            )}
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              disabled={importing}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
