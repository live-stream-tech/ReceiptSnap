"use client";

import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useStore, CATEGORIES } from "@/store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileDown,
  ChevronDown,
} from "lucide-react";

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== "売上");

const CATEGORY_COLORS: Record<string, string> = {
  事務用品費: "#60a5fa",
  交際費: "#a78bfa",
  旅費交通費: "#818cf8",
  外注費: "#fb923c",
  ソフトウェア: "#22d3ee",
  広告宣伝費: "#f472b6",
  "備品・設備費": "#2dd4bf",
  水道光熱費: "#38bdf8",
  その他: "#94a3b8",
};

export default function ReportPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { getTotalByCategory, getTotalIncome, getTotalExpense, getReceiptsByYear } =
    useStore();

  const totals = getTotalByCategory(selectedYear);
  const income = getTotalIncome(selectedYear);
  const expense = getTotalExpense(selectedYear);
  const profit = income - expense;
  const receipts = getReceiptsByYear(selectedYear);

  // Monthly breakdown
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const monthReceipts = receipts.filter((r) =>
      r.date.startsWith(`${selectedYear}-${month}`)
    );
    const monthExpense = monthReceipts
      .filter((r) => r.category !== "売上")
      .reduce((sum, r) => sum + r.amount, 0);
    const monthIncome = monthReceipts
      .filter((r) => r.category === "売上")
      .reduce((sum, r) => sum + r.amount, 0);
    return { month: `${i + 1}月`, expense: monthExpense, income: monthIncome };
  });

  const maxMonthly = Math.max(
    ...monthlyData.map((d) => Math.max(d.expense, d.income)),
    1
  );

  // Category breakdown (expenses only)
  const expenseBreakdown = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat,
    amount: totals[cat] || 0,
    color: CATEGORY_COLORS[cat] || "#94a3b8",
  }))
    .filter((d) => d.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalExpenseForPct = expenseBreakdown.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
            <p className="text-gray-500 text-sm mt-0.5">収支の分析と集計</p>
          </div>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-300 appearance-none bg-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}年度
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">売上</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(income)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-500">経費</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(expense)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              <span className="text-xs text-gray-500">利益</span>
            </div>
            <p
              className={`text-lg font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {formatCurrency(profit)}
            </p>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">
            月別収支
          </h2>
          <div className="flex items-end gap-1 h-32">
            {monthlyData.map(({ month, expense: exp, income: inc }) => (
              <div
                key={month}
                className="flex-1 flex flex-col items-center gap-0.5"
              >
                <div className="w-full flex flex-col-reverse gap-0.5 h-24">
                  {inc > 0 && (
                    <div
                      className="w-full rounded-t bg-green-400 transition-all"
                      style={{ height: `${(inc / maxMonthly) * 100}%` }}
                    />
                  )}
                  {exp > 0 && (
                    <div
                      className="w-full rounded-t bg-brand-400 transition-all"
                      style={{ height: `${(exp / maxMonthly) * 100}%` }}
                    />
                  )}
                  {inc === 0 && exp === 0 && (
                    <div className="w-full h-1 bg-gray-100 rounded" />
                  )}
                </div>
                <span className="text-[9px] text-gray-400">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-brand-400" />
              <span className="text-xs text-gray-500">経費</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-400" />
              <span className="text-xs text-gray-500">売上</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">
            科目別経費
          </h2>
          {expenseBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              経費データがありません
            </p>
          ) : (
            <div className="space-y-3">
              {expenseBreakdown.map(({ category, amount, color }) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      {category}
                    </span>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-gray-900">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-2">
                        {totalExpenseForPct > 0
                          ? Math.round((amount / totalExpenseForPct) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${totalExpenseForPct > 0 ? (amount / totalExpenseForPct) * 100 : 0}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PDF Export CTA */}
        <div className="bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1">決算書PDFを作成</h3>
              <p className="text-xs opacity-80 mb-3">
                収支報告書・決算書をPDFで出力できます
              </p>
              <div className="flex gap-2">
                <Link
                  href="/export"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white text-brand-600 rounded-xl text-xs font-semibold hover:bg-brand-50 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  PDFを作成する
                </Link>
              </div>
            </div>
            <FileDown className="w-10 h-10 opacity-20" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
