import Dexie, { type Table } from "dexie";
import type { Receipt } from "@/store";

class ReceiptSnapDB extends Dexie {
  receipts!: Table<Receipt>;

  constructor() {
    super("receiptsnap-db");
    this.version(1).stores({
      receipts: "id, date, vendor, amount, category, status, createdAt",
    });
  }
}

export const db = new ReceiptSnapDB();

// localStorage → IndexedDB マイグレーション（初回のみ）
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    const count = await db.receipts.count();
    if (count > 0) return; // すでにデータあり → スキップ

    const raw = localStorage.getItem("receiptsnap-storage");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const receipts: Receipt[] = parsed?.state?.receipts ?? [];
    if (receipts.length === 0) return;

    await db.receipts.bulkPut(receipts);
    // マイグレーション完了後はlocalStorageをクリア
    localStorage.removeItem("receiptsnap-storage");
    console.log(`[ReceiptSnap] Migrated ${receipts.length} receipts to IndexedDB`);
  } catch (e) {
    console.warn("[ReceiptSnap] Migration failed:", e);
  }
}
