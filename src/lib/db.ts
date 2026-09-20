import Dexie, { type Table } from "dexie";
import type {
  Category,
  Product,
  StoreProfile,
  SyncQueueItem,
  Transaction,
} from "../types";

export class KalaPOSDatabase extends Dexie {
  store_profile!: Table<StoreProfile, string>;
  categories!: Table<Category, string>;
  products!: Table<Product, string>;
  transactions!: Table<Transaction, string>;
  sync_queue!: Table<SyncQueueItem, string>;

  constructor() {
    super("KalaPOSDatabase");
    this.version(2).stores({
      store_profile: "id, name, mode, isOnboarded",
      categories: "id, name, isDefaultTrackStock, sortOrder",
      products: "id, name, category, barcode, trackStock",
      transactions: "id, invoiceNumber, status, synced, createdAt",
      sync_queue: "id, action, createdAt",
    });
  }
}

export const db = new KalaPOSDatabase();

export async function seedInitialDataIfNeeded() {
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    await db.categories.bulkAdd([
      {
        id: "cat-all",
        name: "Semua",
        isDefaultTrackStock: false,
        sortOrder: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "cat-kopi",
        name: "Kopi",
        isDefaultTrackStock: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "cat-nonkopi",
        name: "Non-Kopi",
        isDefaultTrackStock: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "cat-makanan",
        name: "Makanan",
        isDefaultTrackStock: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: "cat-jasa",
        name: "Jasa",
        isDefaultTrackStock: false,
        sortOrder: 4,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  const productCount = await db.products.count();
  if (productCount === 0) {
    const now = new Date().toISOString();
    await db.products.bulkAdd([
      {
        id: "prod-1",
        name: "Espresso Signature",
        price: 22000,
        category: "Kopi",
        stock: 45,
        trackStock: true,
        barcode: "899123456001",
        image:
          "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400&h=400",
        icon: "Coffee",
        variants: [
          {
            group: "Ukuran",
            options: [
              { label: "Regular", delta: 0 },
              { label: "Large", delta: 5000 },
            ],
          },
          {
            group: "Level Gula",
            options: [
              { label: "Normal", delta: 0 },
              { label: "Less Sugar", delta: 0 },
              { label: "No Sugar", delta: 0 },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod-2",
        name: "Kopi Susu Gula Aren",
        price: 25000,
        category: "Kopi",
        stock: 30,
        trackStock: true,
        barcode: "899123456002",
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400&h=400",
        icon: "Coffee",
        variants: [
          {
            group: "Ukuran",
            options: [
              { label: "Regular", delta: 0 },
              { label: "Large", delta: 5000 },
            ],
          },
          {
            group: "Topping",
            options: [
              { label: "Tanpa Topping", delta: 0 },
              { label: "Boba (+4k)", delta: 4000 },
              { label: "Jelly (+3k)", delta: 3000 },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod-3",
        name: "Matcha Latte Premium",
        price: 28000,
        category: "Non-Kopi",
        stock: 20,
        trackStock: true,
        barcode: "899123456003",
        image:
          "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400&h=400",
        icon: "Coffee",
        variants: [
          {
            group: "Suhu",
            options: [
              { label: "Dingin (Ice)", delta: 0 },
              { label: "Panas (Hot)", delta: 0 },
            ],
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod-4",
        name: "Croissant Butter",
        price: 24000,
        category: "Makanan",
        stock: 12,
        trackStock: true,
        barcode: "899123456004",
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400&h=400",
        icon: "Cookie",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod-5",
        name: "Jasa Giling Biji Kopi",
        price: 10000,
        category: "Jasa",
        stock: 0,
        trackStock: false,
        barcode: "899123456005",
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400&h=400",
        icon: "Wrench",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod-6",
        name: "Sewa Tempat Event / Jam",
        price: 150000,
        category: "Jasa",
        stock: 0,
        trackStock: false,
        barcode: "899123456006",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400&h=400",
        icon: "Building",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  } else {
    // Check if seeded products lack images, update them if needed
    const firstProd = await db.products.get("prod-1");
    if (firstProd && !firstProd.image) {
      await db.products.update("prod-1", {
        image:
          "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400",
      });
      await db.products.update("prod-2", {
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400",
      });
      await db.products.update("prod-3", {
        image:
          "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400",
      });
      await db.products.update("prod-4", {
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400",
      });
      await db.products.update("prod-5", {
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400",
      });
      await db.products.update("prod-6", {
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
      });
    }
  }
}
