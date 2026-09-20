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
        className={`inline-flex min-h-[40px] items-center rounded-full border px-4.5 py-2 text-xs font-medium whitespace-nowrap transition-all ${activeCategory === "Semua" ? "bg-fg border-fg text-surface font-semibold" : "border-line bg-surface text-muted hover:border-bg hover:text-fg"}`}
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
            className={`inline-flex min-h-[40px] items-center rounded-full border px-4.5 py-2 text-xs font-medium whitespace-nowrap transition-all ${isActive ? "border-fg text-surface bg-fg font-semibold" : "border-line bg-surface text-muted hover:border-bg hover:text-fg"}`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
