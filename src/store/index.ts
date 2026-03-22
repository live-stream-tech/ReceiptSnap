import { create } from "zustand";
import { db, migrateFromLocalStorage } from "@/lib/db";

export type DocumentStatus = "pending" | "confirmed" | "rejected";
export type DocumentCategory =
  | "事務用品費"
  | "交際費"
  | "旅費交通費"
  | "外注費"
  | "ソフトウェア"
  | "広告宣伝費"
  | "備品・設備費"
  | "水道光熱費"
  | "売上"
  | "その他";

export interface Receipt {
  id: string;
  date: string;
  vendor: string;
  amount: number;
  category: DocumentCategory;
  status: DocumentStatus;
  note: string;
  imageUrl?: string;
  fileName?: string;
  createdAt: string;
}

export interface AppState {
  receipts: Receipt[];
  isLoading: boolean;
  loadReceipts: () => Promise<void>;
  addReceipt: (receipt: Omit<Receipt, "id" | "createdAt">) => Promise<void>;
  updateReceipt: (id: string, updates: Partial<Receipt>) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  getReceiptsByYear: (year: number) => Receipt[];
  getTotalByCategory: (year: number) => Record<DocumentCategory, number>;
  getTotalIncome: (year: number) => number;
  getTotalExpense: (year: number) => number;
}

export const CATEGORIES: DocumentCategory[] = [
  "事務用品費","交際費","旅費交通費","外注費","ソフトウェア",
  "広告宣伝費","備品・設備費","水道光熱費","売上","その他",
];

const EXPENSE_CATEGORIES: DocumentCategory[] = [
  "事務用品費","交際費","旅費交通費","外注費","ソフトウェア",
  "広告宣伝費","備品・設備費","水道光熱費","その他",
];

export const useStore = create<AppState>()((set, get) => ({
  receipts: [],
  isLoading: false,

  loadReceipts: async () => {
    set({ isLoading: true });
    try {
      await migrateFromLocalStorage();
      const receipts = await db.receipts.orderBy("createdAt").reverse().toArray();
      set({ receipts, isLoading: false });
    } catch (e) {
      console.error("[ReceiptSnap] Failed to load receipts:", e);
      set({ isLoading: false });
    }
  },

  addReceipt: async (receipt) => {
    const newReceipt: Receipt = {
      ...receipt,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.receipts.put(newReceipt);
    set((state) => ({ receipts: [newReceipt, ...state.receipts] }));
  },

  updateReceipt: async (id, updates) => {
    await db.receipts.update(id, updates);
    set((state) => ({
      receipts: state.receipts.map((r) => r.id === id ? { ...r, ...updates } : r),
    }));
  },

  deleteReceipt: async (id) => {
    await db.receipts.delete(id);
    set((state) => ({ receipts: state.receipts.filter((r) => r.id !== id) }));
  },

  clearAll: async () => {
    await db.receipts.clear();
    set({ receipts: [] });
  },

  getReceiptsByYear: (year) =>
    get().receipts.filter((r) => r.date.startsWith(String(year))),

  getTotalByCategory: (year) => {
    const receipts = get().getReceiptsByYear(year);
    const totals = {} as Record<DocumentCategory, number>;
    CATEGORIES.forEach((cat) => (totals[cat] = 0));
    receipts.forEach((r) => { totals[r.category] = (totals[r.category] || 0) + r.amount; });
    return totals;
  },

  getTotalIncome: (year) =>
    get().getReceiptsByYear(year)
      .filter((r) => r.category === "売上")
      .reduce((sum, r) => sum + r.amount, 0),

  getTotalExpense: (year) =>
    get().getReceiptsByYear(year)
      .filter((r) => EXPENSE_CATEGORIES.includes(r.category))
      .reduce((sum, r) => sum + r.amount, 0),
}));
