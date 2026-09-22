"use client";

import {
  CoffeeIcon,
  CookieIcon,
  FireIcon,
  HouseIcon,
  ShoppingBagIcon,
  SparkleIcon,
  TagIcon,
  WrenchIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Category } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import LabelInput from "../ui/InputLabel";

interface CategoryModalProps {
  isOpen: boolean;
  category?: Category | null;
  onClose: () => void;
  onSave: (cat: Partial<Category>) => Promise<void>;
}

const AVAILABLE_ICONS = [
  { name: "Coffee", label: "Kopi", icon: CoffeeIcon },
  { name: "Cookie", label: "Makanan", icon: CookieIcon },
  { name: "Wrench", label: "Jasa", icon: WrenchIcon },
  { name: "House", label: "Sewa", icon: HouseIcon },
  { name: "ShoppingBag", label: "Belanja", icon: ShoppingBagIcon },
  { name: "Sparkle", label: "Spesial", icon: SparkleIcon },
  { name: "Fire", label: "Populer", icon: FireIcon },
  { name: "Tag", label: "Umum", icon: TagIcon },
];

export function CategoryModal({
  isOpen,
  category,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [isDefaultTrackStock, setIsDefaultTrackStock] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon || "Tag");
      setIsDefaultTrackStock(category.isDefaultTrackStock);
      setSortOrder(category.sortOrder);
    } else {
      setName("");
      setIcon("Tag");
      setIsDefaultTrackStock(true);
      setSortOrder(1);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: category?.id,
        name: name.trim(),
        icon,
        isDefaultTrackStock,
        sortOrder,
      });
      onClose();
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border-border w-full max-w-md rounded-xl border p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4 border-border mb-4">
          <div>
            <h2 className="text-fg font-bold text-base">
              {category ? "Edit Kategori Produk" : "Tambah Kategori Baru"}
            </h2>
            <p className="text-muted text-xs">
              Atur detail dan opsi bawaan kategori produk.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-fg hover:bg-fg-soft rounded-md p-1.5 transition-colors cursor-pointer"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <LabelInput required htmlFor="cat-name-input">
              Nama Kategori
            </LabelInput>
            <Input
              id="cat-name-input"
              type="text"
              required
              placeholder="Contoh: Kopi / Non-Kopi / Dessert"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <span className="text-fg mb-1.5 block text-xs font-semibold">
              Pilih Ikon Kategori
            </span>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    className={`p-2.5 rounded-md border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border bg-bg text-muted hover:border-line"
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="text-[10px] font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-bg border-border rounded-lg border p-3 flex items-center justify-between">
            <div>
              <p className="text-fg font-semibold text-xs mb-0.5">
                Lacak Stok Bawaan (Track Stock)
              </p>
              <p className="text-muted text-[11px]">
                Aktif untuk Ritel (Barang fisik), Mati untuk Jasa/Layanan.
              </p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded-sm border-line text-accent focus:ring-accent cursor-pointer"
              checked={isDefaultTrackStock}
              onChange={(e) => setIsDefaultTrackStock(e.target.checked)}
            />
          </div>

          <div>
            <LabelInput htmlFor="cat-sort-input">
              Urutan Tampilan (Sort Order)
            </LabelInput>
            <Input
              id="cat-sort-input"
              type="number"
              min={1}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 1)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={saving}
            >
              {category ? "Perbarui" : "Simpan Kategori"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
