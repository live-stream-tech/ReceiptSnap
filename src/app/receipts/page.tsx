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
  Clock,
  FileText,
  ChevronDown,
  ArrowRight,
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
      const matchCategory = filterCategory === "all" || r.category === filterCategory;
      const matchStatus   = filterStatus === "all"   || r.status === filterStatus;
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 tracking-wide">証憑一覧</h1>
          <p className="text-brand-600/60 text-sm mt-1">
            {filtered.length}件 · 合計 {formatCurrency(totalAmount)}
          </p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-2.5 gradient-hero text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">追加</span>
        </Link>
      </div>

      {/* Filters */}
      <div
        className="card-glass rounded-2xl p-5 mb-5 space-y-4 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="取引先・メモで検索..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white/80"
          />
        </div>

        {/* Filter Row */}
        <div className="flex gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="relative flex-1 min-w-[140px]">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as DocumentCategory | "all")}
              className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 appearance-none bg-white/80"
            >
              <option value="all">すべての科目</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | "all")}
              className="w-full px-4 py-2.5 rounded-xl border border-sky-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 appearance-none bg-white/80"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">確認待ち</option>
              <option value="confirmed">確認済み</option>
              <option value="rejected">要修正</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-200 text-xs font-medium text-brand-700 hover:bg-sky-50 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            {sortOrder === "desc" ? "新しい順" : "古い順"}
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className="card-glass rounded-2xl py-16 text-center animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
            <FileText className="w-10 h-10 text-sky-300" />
          </div>
          <p className="text-brand-600/50 text-sm mb-4">
            {receipts.length === 0 ? "書類がまだありません" : "条件に一致する書類がありません"}
          </p>
          {receipts.length === 0 && (
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 font-medium transition-colors"
            >
              最初の書類をアップロード <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div
          className="card-glass rounded-2xl overflow-hidden animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="divide-y divide-sky-50">
            {filtered.map((receipt) => (
              <div
                key={receipt.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-sky-50/40 transition-colors group"
              >
                {/* Image thumbnail */}
                <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden">
                  {receipt.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={receipt.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-sky flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900 truncate">
                        {receipt.vendor || "取引先未設定"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-brand-500/50">{formatDateShort(receipt.date)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(receipt.category)}`}>
                          {receipt.category}
                        </span>
                      </div>
                      {receipt.note && (
                        <p className="text-xs text-brand-500/40 mt-0.5 truncate">{receipt.note}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{formatCurrency(receipt.amount)}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(receipt.status)}`}>
                        {getStatusLabel(receipt.status)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => handleStatusChange(receipt.id, "confirmed")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                        receipt.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-sky-50 text-brand-500 hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      確認済み
                    </button>
                    <button
                      onClick={() => handleStatusChange(receipt.id, "pending")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                        receipt.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-sky-50 text-brand-500 hover:bg-amber-50 hover:text-amber-600"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      確認待ち
                    </button>
                    <button
                      onClick={() => handleDelete(receipt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-sky-50 text-brand-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
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
    </MainLayout>
  );
}
