import Dexie, { type Table } from "dexie";
import type { Category, StoreProfile } from "../types";

export class KalaPOSDatabase extends Dexie {
  store_profile!: Table<StoreProfile, string>;
  categories!: Table<Category, string>;

  constructor() {
    super("KalaPOSDatabase");
    this.version(1).stores({
      store_profile: "id, name, mode, isOnboarded",
      categories: "id, name, isDefaultTrackStock, sortOrder",
    });
  }
}

export const db = new KalaPOSDatabase();
