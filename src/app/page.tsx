"use client";

import { MainLayout } from "@/components/MainLayout";
import { useStore } from "@/store";
import { formatCurrency, formatDateShort, getCategoryColor, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";
import { Camera, FileText, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const currentYear = new Date().getFullYear();

export default function HomePage() {
  const { receipts, isLoading, getTotalIncome, getTotalExpense } = useStore();

  const hasData = receipts.length > 0;

  // ローディング中
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[75vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-brand-400/60">読み込み中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  const income = getTotalIncome(currentYear);
  const expense = getTotalExpense(currentYear);
  const recentReceipts = receipts.slice(0, 5);

  // ── データなし：空状態 ────────────────────────────────────
  if (!hasData) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
          {/* タイトル */}
          <h1 className="text-2xl font-black text-brand-900 mb-3">ReceiptSnap</h1>
          <p className="text-base text-brand-700 leading-relaxed mb-2">
            レシートを1枚撮るだけで<br />
            収支内訳書が完成します
          </p>
          <p className="text-xs text-brand-400/60 mb-12">
            ※スクリーンショットも利用できます
          </p>

          {/* メインCTA */}
          <Link
            href="/upload"
            className="flex items-center justify-center gap-3 w-full max-w-xs py-5 rounded-2xl bg-sky-500 text-white text-lg font-black shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform mb-16"
          >
            <Camera className="w-6 h-6" />
            レシートを撮る
          </Link>

          {/* 空状態メッセージ */}
          <div className="mb-12">
            <p className="text-sm font-bold text-brand-500/60 mb-1">まだデータがありません</p>
            <p className="text-xs text-brand-400/50 leading-relaxed">
              レシートを1枚撮るだけで<br />
              自動で分類・集計されます
            </p>
          </div>

          {/* サブ情報（安心感） */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              "自動で日付・金額を抽出",
              "カテゴリ分類",
              "収支内訳書を作成",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                <p className="text-xs text-brand-400/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── データあり：ダッシュボード ────────────────────────────
  return (
    <MainLayout>
      <div className="space-y-6">

        {/* 収支サマリー */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up">
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-brand-500/60 font-medium">売上</p>
            </div>
            <p className="text-xl font-black text-brand-900 leading-tight">{formatCurrency(income)}</p>
            <p className="text-[10px] text-brand-400/50 mt-1">{currentYear}年度</p>
          </div>
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-brand-500/60 font-medium">経費</p>
            </div>
            <p className="text-xl font-black text-brand-900 leading-tight">{formatCurrency(expense)}</p>
            <p className="text-[10px] text-brand-400/50 mt-1">{currentYear}年度</p>
          </div>
        </div>

        {/* メインCTA */}
        <Link
          href="/upload"
          className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-sky-500 text-white text-lg font-black shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <Camera className="w-6 h-6" />
          レシートを撮る
        </Link>

        {/* 最近の書類 */}
        <div className="card-glass rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-sky-100/60">
            <h2 className="text-sm font-bold text-brand-900">最近の書類</h2>
            <Link
              href="/receipts"
              className="text-xs text-sky-500 font-bold flex items-center gap-1"
            >
              すべて見る <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-sky-50/60">
            {recentReceipts.map((receipt) => (
              <div key={receipt.id} className="flex items-center gap-3 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-bold text-brand-900 truncate">
                      {receipt.vendor || "取引先未設定"}
                    </p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${getCategoryColor(receipt.category)}`}>
                      {receipt.category}
                    </span>
                  </div>
                  <p className="text-xs text-brand-400/60">{formatDateShort(receipt.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-brand-800">{formatCurrency(receipt.amount)}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${getStatusColor(receipt.status)}`}>
                    {getStatusLabel(receipt.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
