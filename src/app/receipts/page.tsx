"use client";

import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useStore, CATEGORIES, type DocumentCategory, type DocumentStatus } from "@/store";
import {
  formatCurrency,
  formatDateShort,
  getStatusColor,
  getStatusLabel,
  getCategoryColor,
} from "@/lib/utils";
import Link from "next/link";
import {
  Search,
  Filter,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronDown,
} from "lucide-react";

export default function ReceiptsPage() {
  const { receipts, updateReceipt, deleteReceipt } = useStore();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const filtered = receipts
    .filter((r) => {
      const matchSearch =
        !search ||
        r.vendor.toLowerCase().includes(search.toLowerCase()) ||
        r.note.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        filterCategory === "all" || r.category === filterCategory;
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      const diff = a.date.localeCompare(b.date);
      return sortOrder === "desc" ? -diff : diff;
    });

  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);

  const handleStatusChange = (id: string, status: DocumentStatus) => {
    updateReceipt(id, { status });
  };

  const handleDelete = (id: string) => {
    if (confirm("この書類を削除しますか？")) {
      deleteReceipt(id);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">証憑一覧</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {filtered.length}件 · 合計 {formatCurrency(totalAmount)}
            </p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 px-4 py-2 gradient-brand text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">追加</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="取引先・メモで検索..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
            />
          </div>

          {/* Filter Row */}
          <div className="flex gap-2 flex-wrap">
            {/* Category Filter */}
            <div className="relative flex-1 min-w-[140px]">
              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value as DocumentCategory | "all")
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-300 appearance-none bg-white"
              >
                <option value="all">すべての科目</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 min-w-[120px]">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as DocumentStatus | "all")
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-300 appearance-none bg-white"
              >
                <option value="all">すべてのステータス</option>
                <option value="pending">確認待ち</option>
                <option value="confirmed">確認済み</option>
                <option value="rejected">要修正</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-3 h-3" />
              {sortOrder === "desc" ? "新しい順" : "古い順"}
            </button>
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {receipts.length === 0
                ? "書類がまだありません"
                : "条件に一致する書類がありません"}
            </p>
            {receipts.length === 0 && (
              <Link
                href="/upload"
                className="mt-3 inline-block text-sm text-brand-500 font-medium hover:text-brand-600"
              >
                最初の書類をアップロード →
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Image thumbnail */}
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {receipt.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={receipt.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {receipt.vendor || "取引先未設定"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-400">
                            {formatDateShort(receipt.date)}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getCategoryColor(receipt.category)}`}
                          >
                            {receipt.category}
                          </span>
                        </div>
                        {receipt.note && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {receipt.note}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(receipt.amount)}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(receipt.status)}`}
                        >
                          {getStatusLabel(receipt.status)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() =>
                          handleStatusChange(receipt.id, "confirmed")
                        }
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                          receipt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        確認済み
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(receipt.id, "pending")
                        }
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                          receipt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        確認待ち
                      </button>
                      <button
                        onClick={() => handleDelete(receipt.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
