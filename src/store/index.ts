import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  date: string; // YYYY-MM-DD
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
  addReceipt: (receipt: Omit<Receipt, "id" | "createdAt">) => void;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  clearAll: () => void;
  getReceiptsByYear: (year: number) => Receipt[];
  getTotalByCategory: (year: number) => Record<DocumentCategory, number>;
  getTotalIncome: (year: number) => number;
  getTotalExpense: (year: number) => number;
}

export const CATEGORIES: DocumentCategory[] = [
  "事務用品費",
  "交際費",
  "旅費交通費",
  "外注費",
  "ソフトウェア",
  "広告宣伝費",
  "備品・設備費",
  "水道光熱費",
  "売上",
  "その他",
];

const EXPENSE_CATEGORIES: DocumentCategory[] = [
  "事務用品費",
  "交際費",
  "旅費交通費",
  "外注費",
  "ソフトウェア",
  "広告宣伝費",
  "備品・設備費",
  "水道光熱費",
  "その他",
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      receipts: [],

      addReceipt: (receipt) => {
        const newReceipt: Receipt = {
          ...receipt,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ receipts: [newReceipt, ...state.receipts] }));
      },

      updateReceipt: (id, updates) => {
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteReceipt: (id) => {
        set((state) => ({
          receipts: state.receipts.filter((r) => r.id !== id),
        }));
      },

      clearAll: () => {
        set({ receipts: [] });
      },

      getReceiptsByYear: (year) => {
        return get().receipts.filter((r) => r.date.startsWith(String(year)));
      },

      getTotalByCategory: (year) => {
        const receipts = get().getReceiptsByYear(year);
        const totals = {} as Record<DocumentCategory, number>;
        CATEGORIES.forEach((cat) => (totals[cat] = 0));
        receipts.forEach((r) => {
          totals[r.category] = (totals[r.category] || 0) + r.amount;
        });
        return totals;
      },

      getTotalIncome: (year) => {
        return get()
          .getReceiptsByYear(year)
          .filter((r) => r.category === "売上")
          .reduce((sum, r) => sum + r.amount, 0);
      },

      getTotalExpense: (year) => {
        return get()
          .getReceiptsByYear(year)
          .filter((r) => EXPENSE_CATEGORIES.includes(r.category))
          .reduce((sum, r) => sum + r.amount, 0);
      },
    }),
    {
      name: "receiptsnap-storage",
    }
  )
);
