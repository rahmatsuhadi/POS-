"use client";

import { PlusIcon } from "@phosphor-icons/react";
import type { Product } from "@/types";
import { formatIDR } from "@/utils/currency";

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function ProductGrid({ products, onSelectProduct }: ProductGridProps) {
  const getStockBadge = (product: Product) => {
    if (!product.trackStock) {
      return (
        <span className="stock-badge rounded-sm bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold">
          Layanan
        </span>
      );
    }
    if (product.stock <= 0) {
      return (
        <span className="stock-badge out-stock bg-danger-soft text-danger border border-danger/20 rounded-sm px-2 py-0.5 text-[10px] font-semibold">
          Habis
        </span>
      );
    }
    if (product.stock <= 5) {
      return (
        <span className="stock-badge low-stock bg-warning-soft text-amber-700 border border-amber-500/20 rounded-sm px-2 py-0.5 text-[10px] font-semibold">
          Stok {product.stock}
        </span>
      );
    }
    return (
      <span className="stock-badge in-stock bg-accent-soft text-accent border border-accent/20 rounded-sm px-2 py-0.5 text-[10px] font-semibold">
        Stok {product.stock}
      </span>
    );
  };

  if (products.length === 0) {
    return (
      <div className="product-grid-wrap flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 text-muted">
        <div className="h-36 w-36">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 320"
            width="100%"
            height="100%"
            role="img"
            aria-label="Produk Kosong"
          >
            <title>Produk Kosong</title>
            <rect width="100%" height="100%" fill="transparent" />
            <g
              stroke="#8d9297"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M 174 135 C 174 72, 226 72, 226 135" strokeWidth="7" />
              <polygon
                points="148,135 252,135 268,272 132,272"
                strokeWidth="7.5"
              />
              <path
                d="M 188 215 C 188 200, 212 200, 212 215"
                strokeWidth="6.5"
              />
              <path
                d="M 124 78 C 124 67, 149 67, 149 83 C 149 96, 141 96, 141 106"
                strokeWidth="6.5"
              />
              <path
                d="M 282 170 L 288 176 M 288 170 L 282 176"
                strokeWidth="2.2"
              />
              <path
                d="M 119 238 L 119 248 M 114 243 L 124 243"
                strokeWidth="2.2"
              />
              <circle cx="112" cy="192" r="5" strokeWidth="2.5" />
              <circle cx="280" cy="222" r="4.5" strokeWidth="2.5" />
            </g>
            <g fill="#8d9297">
              <circle cx="141" cy="115" r="4.5" />
              <circle cx="177" cy="177" r="6" />
              <circle cx="223" cy="177" r="6" />
            </g>
          </svg>
        </div>
        <p className="text-sm">Tidak ada produk ditemukan</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => {
          const isOutOfStock = product.trackStock && product.stock <= 0;
          const hasVariants = Boolean(
            product.variants && product.variants.length > 0,
          );

          return (
            <button
              key={product.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectProduct(product)}
              className={`group border-line bg-surface relative flex flex-col rounded-lg border p-3 text-left transition-all cursor-pointer ${
                isOutOfStock
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-accent hover:shadow-xs active:scale-[0.99]"
              }`}
            >
              <div className="bg-bg relative mb-2.5 aspect-square w-full overflow-hidden rounded-md">
                {/* biome-ignore lint/performance/noImgElement: catalog image preview */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute top-2 right-2 z-10">
                  {getStockBadge(product)}
                </div>
              </div>

              <h3 className="text-fg line-clamp-2 flex h-8 items-center text-xs leading-snug font-medium">
                {product.name}
              </h3>

              <div className="my-1 flex h-4 items-center">
                {hasVariants ? (
                  <span className="text-accent text-[10px] font-medium">
                    Varian Opsional
                  </span>
                ) : (
                  <span className="text-[10px] font-medium opacity-0 select-none">
                    -
                  </span>
                )}
              </div>

              <div className="text-fg mt-auto pt-1 font-bold text-sm tracking-tight tabular-nums">
                {formatIDR(product.price)}
              </div>

              <div className="bg-accent text-white group-hover:opacity-90 absolute right-3 bottom-3 grid h-8 w-8 place-items-center rounded-md shadow-xs transition-all active:scale-95">
                <PlusIcon size={16} weight="bold" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
