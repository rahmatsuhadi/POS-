"use client";

import { Plus, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Product, SelectedVariant } from "@/types";

interface VariantModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    selectedVariants: SelectedVariant[],
    notes: string,
  ) => void;
}

export function VariantModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: VariantModalProps) {
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    [],
  );
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (product?.variants) {
      // Default initial selections (first option of each group)
      const initial: SelectedVariant[] = product.variants.map((g) => ({
        group: g.group,
        label: g.options[0].label,
        delta: g.options[0].delta,
      }));
      setSelectedVariants(initial);
      setNotes("");
    } else {
      setSelectedVariants([]);
      setNotes("");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSelectOption = (
    groupName: string,
    label: string,
    delta: number,
  ) => {
    setSelectedVariants((prev) => {
      const filtered = prev.filter((v) => v.group !== groupName);
      return [...filtered, { group: groupName, label, delta }];
    });
  };

  const deltaTotal = selectedVariants.reduce((sum, v) => sum + v.delta, 0);
  const totalPrice = product.price + deltaTotal;
  const formatIDR = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  const handleAdd = () => {
    onConfirm(product, selectedVariants, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-surface animate-zoom-in max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-lg shadow-xl duration-200">
        <div className="border-line flex items-center justify-between border-b p-5">
          <h2 className="font-display text-fg text-base font-bold">
            Pilih Varian
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-close text-muted hover:bg-fg-soft grid h-8 w-8 place-items-center rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-line bg-bg flex items-center gap-3.5 border-b p-4">
          <div className="bg-surface border-line grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border">
            {product.image ? (
              /* biome-ignore lint/performance/noImgElement: product thumbnail preview */
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-accent text-lg font-bold">
                {product.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-fg text-sm font-semibold">{product.name}</h3>
            <p className="text-muted mt-0.5 font-mono text-xs">
              Harga Dasar: {formatIDR(product.price)}
            </p>
          </div>
        </div>

        <div className="p-5">
          {product.variants?.map((g) => {
            const currentSelection = selectedVariants.find(
              (v) => v.group === g.group,
            );

            return (
              <div key={g.group} className="mb-4">
                <div className="text-muted mb-2 text-xs font-semibold tracking-wider uppercase">
                  {g.group}
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((opt) => {
                    const isSelected = currentSelection?.label === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() =>
                          handleSelectOption(g.group, opt.label, opt.delta)
                        }
                        className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-sm border px-3.5 py-2 text-xs font-medium transition-all ${isSelected ? "border-accent text-accent bg-[var(--accent-soft)] font-semibold" : "bg-surface text-fg hover:border-fg border-[var(--border)]"}`}
                      >
                        <span>{opt.label}</span>
                        {opt.delta > 0 && (
                          <span className="delta text-muted font-mono text-[11px]">
                            (+{formatIDR(opt.delta)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="mb-5">
            <label
              htmlFor="variantNote"
              className="text-muted mb-2 block text-xs font-semibold tracking-wider uppercase"
            >
              Catatan Item (opsional)
            </label>
            <textarea
              id="variantNote"
              className="text-fg border-line bg-bg focus:border-accent w-full resize-none rounded-sm border p-2.5 text-xs transition-colors focus:outline-none"
              placeholder="Contoh: Kurang es, manis sedang, tanpa sedotan..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div>
              <span className="text-muted block text-[11px]">Total Harga</span>
              <span className="text-fg font-mono text-lg font-bold">
                {formatIDR(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="text-surface bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all active:scale-95"
            >
              <Plus size={18} weight="bold" />
              <span>Tambah Ke Keranjang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
