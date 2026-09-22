"use client";

interface CategoryPillsProps {
  categories: Array<{ id: string; name: string }>;
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export function CategoryPills({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="categories no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-6 py-3">
      <button
        type="button"
        onClick={() => onSelectCategory("Semua")}
        className={`inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
          activeCategory === "Semua"
            ? "border-fg bg-fg text-surface font-semibold shadow-xs"
            : "border-line bg-surface text-muted hover:border-fg/40 hover:text-fg"
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={`inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "border-fg bg-fg text-surface font-semibold shadow-xs"
                : "border-line bg-surface text-muted hover:border-fg/40 hover:text-fg"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
