"use client";

import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../lib/db";
import type { Category } from "../../types";
import Button from "../ui/Button";
import { CategoryModal } from "./CategoryModal";

interface CategoryManagementCardProps {
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

export function CategoryManagementCard({
  onShowToast,
}: CategoryManagementCardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const items = await db.categories.orderBy("sortOrder").toArray();
      setCategories(items);
    } catch (err) {
      console.error("Gagal membaca kategori:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === "cat-all") {
      if (onShowToast)
        onShowToast("Kategori utama 'Semua' tidak dapat dihapus", "error");
      return;
    }
    if (!confirm(`Hapus kategori "${name}"?`)) return;

    try {
      await db.categories.delete(id);
      await loadCategories();
      if (onShowToast)
        onShowToast(`Kategori "${name}" berhasil dihapus`, "success");
    } catch (err) {
      console.error("Gagal menghapus kategori:", err);
      if (onShowToast) onShowToast("Gagal menghapus kategori", "error");
    }
  };

  const handleSaveCategory = async (data: Partial<Category>) => {
    const now = new Date().toISOString();
    if (data.id) {
      // Edit existing
      await db.categories.update(data.id, {
        name: data.name,
        icon: data.icon,
        isDefaultTrackStock: data.isDefaultTrackStock,
        sortOrder: data.sortOrder,
      });
      if (onShowToast) onShowToast("Kategori berhasil diperbarui!", "success");
    } else {
      // Create new
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: data.name || "Kategori Baru",
        icon: data.icon || "Tag",
        isDefaultTrackStock: data.isDefaultTrackStock ?? true,
        sortOrder: data.sortOrder || categories.length + 1,
        createdAt: now,
      };
      await db.categories.add(newCat);
      if (onShowToast)
        onShowToast("Kategori baru berhasil ditambahkan!", "success");
    }
    await loadCategories();
  };

  if (loading) {
    return (
      <div className="bg-surface border-border rounded-xl border p-6 animate-pulse">
        <div className="bg-fg-soft h-6 w-48 rounded mb-4" />
        <div className="space-y-2">
          <div className="bg-fg-soft h-12 w-full rounded-lg" />
          <div className="bg-fg-soft h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border-border rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4 border-border">
        <div>
          <h2 className="text-fg font-bold text-lg">
            Manajemen Kategori Produk
          </h2>
          <p className="text-muted text-xs">
            Kelola pengelompokan produk dan opsi bawaan pelacakan stok (Ritel vs
            Jasa).
          </p>
        </div>

        <Button type="button" size="sm" onClick={handleOpenAdd}>
          <PlusIcon size={16} />
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Category List */}
      <div className="divide-y border-border divide-border border rounded-lg overflow-hidden bg-bg">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 flex items-center justify-between hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-fg-soft text-fg grid h-9 w-9 place-items-center rounded-md text-xs font-bold">
                {cat.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-fg font-medium text-sm">{cat.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>Urutan #{cat.sortOrder}</span>
                  <span>•</span>
                  <span>
                    {cat.isDefaultTrackStock
                      ? "Lacak Stok (Ritel)"
                      : "Tanpa Stok (Jasa)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="text-muted hover:text-fg hover:bg-fg-soft p-1.5 rounded-md transition-colors cursor-pointer"
                title="Edit Kategori"
              >
                <PencilSimpleIcon size={18} />
              </button>
              {cat.id !== "cat-all" && (
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-muted hover:text-danger hover:bg-danger-soft p-1.5 rounded-md transition-colors cursor-pointer"
                  title="Hapus Kategori"
                >
                  <TrashIcon size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={modalOpen}
        category={editingCategory}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
