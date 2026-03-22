"use client";

import { MainLayout } from "@/components/MainLayout";
import { useStore } from "@/store";
import { formatCurrency, formatDateShort, getStatusColor, getStatusLabel, getCategoryColor } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Upload,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const currentYear = new Date().getFullYear();

export default function HomePage() {
  const { receipts, getTotalIncome, getTotalExpense } = useStore();

  const income = getTotalIncome(currentYear);
  const expense = getTotalExpense(currentYear);
  const profit = income - expense;
  const pendingCount = receipts.filter((r) => r.status === "pending").length;
  const yearReceipts = receipts.filter((r) =>
    r.date.startsWith(String(currentYear))
  );
  const recentReceipts = receipts.slice(0, 5);

  const summaryCards = [
    {
      label: "売上合計",
      value: formatCurrency(income),
      icon: TrendingUp,
      gradient: "gradient-card-green",
      sub: `${currentYear}年度`,
    },
    {
      label: "経費合計",
      value: formatCurrency(expense),
      icon: TrendingDown,
      gradient: "gradient-card-pink",
      sub: `${currentYear}年度`,
    },
    {
      label: "書類数",
      value: `${yearReceipts.length}件`,
      icon: FileText,
      gradient: "gradient-card-blue",
      sub: `${currentYear}年度`,
    },
    {
      label: "確認待ち",
      value: `${pendingCount}件`,
      icon: Clock,
      gradient: "gradient-card-purple",
      sub: "要確認",
    },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <span className="text-sm font-medium text-brand-600">
              {currentYear}年度
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            ダッシュボード
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            証憑の管理状況と収支サマリー
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {summaryCards.map(({ label, value, icon: Icon, gradient, sub }) => (
            <div
              key={label}
              className={`${gradient} rounded-2xl p-4 text-white shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium opacity-90">{label}</span>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-bold leading-tight">{value}</p>
              <p className="text-xs opacity-75 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Profit Banner */}
        {income > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {currentYear}年度 収支差引
                </p>
                <p
                  className={`text-3xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {formatCurrency(profit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">経費率</p>
                <p className="text-2xl font-bold text-gray-700">
                  {income > 0 ? Math.round((expense / income) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Upload CTA */}
        <Link
          href="/upload"
          className="block bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl p-5 mb-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">書類をアップロード</p>
                <p className="text-xs opacity-80">
                  領収書・請求書を登録する
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-80" />
          </div>
        </Link>

        {/* Recent Receipts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">最近の書類</h2>
            <Link
              href="/receipts"
              className="text-sm text-brand-500 font-medium flex items-center gap-1 hover:text-brand-600"
            >
              すべて見る
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentReceipts.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">書類がまだありません</p>
              <Link
                href="/upload"
                className="mt-3 inline-block text-sm text-brand-500 font-medium hover:text-brand-600"
              >
                最初の書類をアップロード →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {receipt.vendor || "取引先未設定"}
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getCategoryColor(receipt.category)}`}
                      >
                        {receipt.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDateShort(receipt.date)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(receipt.amount)}
                    </p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(receipt.status)}`}
                    >
                      {getStatusLabel(receipt.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
