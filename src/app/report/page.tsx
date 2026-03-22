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
  事務用品費:    "#38bdf8",
  交際費:        "#818cf8",
  旅費交通費:    "#60a5fa",
  外注費:        "#34d399",
  ソフトウェア:  "#22d3ee",
  広告宣伝費:    "#2dd4bf",
  "備品・設備費": "#0ea5e9",
  水道光熱費:    "#06b6d4",
  その他:        "#94a3b8",
};

export default function ReportPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { getTotalByCategory, getTotalIncome, getTotalExpense, getReceiptsByYear } = useStore();

  const totals   = getTotalByCategory(selectedYear);
  const income   = getTotalIncome(selectedYear);
  const expense  = getTotalExpense(selectedYear);
  const profit   = income - expense;
  const receipts = getReceiptsByYear(selectedYear);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const monthReceipts = receipts.filter((r) => r.date.startsWith(`${selectedYear}-${month}`));
    const monthExpense  = monthReceipts.filter((r) => r.category !== "売上").reduce((sum, r) => sum + r.amount, 0);
    const monthIncome   = monthReceipts.filter((r) => r.category === "売上").reduce((sum, r) => sum + r.amount, 0);
    return { month: `${i + 1}月`, expense: monthExpense, income: monthIncome };
  });

  const maxMonthly = Math.max(...monthlyData.map((d) => Math.max(d.expense, d.income)), 1);

  const expenseBreakdown = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat,
    amount: totals[cat] || 0,
    color: CATEGORY_COLORS[cat] || "#94a3b8",
  }))
    .filter((d) => d.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalExpenseForPct = expenseBreakdown.reduce((sum, d) => sum + d.amount, 0);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 tracking-wide">レポート</h1>
          <p className="text-brand-600/60 text-sm mt-1">収支の分析と集計</p>
        </div>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="pl-4 pr-9 py-2.5 rounded-xl border border-sky-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-300 appearance-none bg-white/80"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}年度</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: TrendingUp,   label: "売上", value: income,   color: "text-emerald-600", bg: "bg-emerald-50", iconColor: "text-emerald-500", delay: "0ms" },
          { icon: TrendingDown, label: "経費", value: expense,  color: "text-sky-600",     bg: "bg-sky-50",     iconColor: "text-sky-500",     delay: "80ms" },
          { icon: BarChart3,    label: "利益", value: profit,   color: profit >= 0 ? "text-teal-700" : "text-red-500", bg: "bg-teal-50", iconColor: "text-teal-500", delay: "160ms" },
        ].map(({ icon: Icon, label, value, color, bg, iconColor, delay }) => (
          <div
            key={label}
            className="card-glass rounded-2xl p-4 hover-lift animate-fade-up"
            style={{ animationDelay: delay }}
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-xs text-brand-600/60 mb-1">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{formatCurrency(value)}</p>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div
        className="card-glass rounded-2xl p-6 mb-5 animate-fade-up"
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="font-bold text-brand-900 text-sm mb-5">月別収支</h2>
        <div className="flex items-end gap-1 h-32">
          {monthlyData.map(({ month, expense: exp, income: inc }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex flex-col-reverse gap-0.5 h-24">
                {inc > 0 && (
                  <div
                    className="w-full rounded-t bg-emerald-400 transition-all"
                    style={{ height: `${(inc / maxMonthly) * 100}%` }}
                  />
                )}
                {exp > 0 && (
                  <div
                    className="w-full rounded-t bg-sky-400 transition-all"
                    style={{ height: `${(exp / maxMonthly) * 100}%` }}
                  />
                )}
                {inc === 0 && exp === 0 && (
                  <div className="w-full h-1 bg-sky-100 rounded" />
                )}
              </div>
              <span className="text-[9px] text-brand-500/50">{month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sky-400" />
            <span className="text-xs text-brand-600/60">経費</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <span className="text-xs text-brand-600/60">売上</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div
        className="card-glass rounded-2xl p-6 mb-5 animate-fade-up"
        style={{ animationDelay: "320ms" }}
      >
        <h2 className="font-bold text-brand-900 text-sm mb-5">科目別経費</h2>
        {expenseBreakdown.length === 0 ? (
          <p className="text-sm text-brand-500/40 text-center py-6">経費データがありません</p>
        ) : (
          <div className="space-y-4">
            {expenseBreakdown.map(({ category, amount, color }) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-brand-800">{category}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-brand-700">{formatCurrency(amount)}</span>
                    <span className="text-[10px] text-brand-500/50 ml-2">
                      {totalExpenseForPct > 0 ? Math.round((amount / totalExpenseForPct) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-sky-50 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
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
      <div
        className="gradient-hero rounded-2xl p-6 text-white animate-fade-up hover-lift shadow-lg"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">決算書PDFを作成</h3>
            <p className="text-sky-200 text-xs mb-4">収支報告書・決算書をPDFで出力できます</p>
            <Link
              href="/export"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-sky-700 rounded-xl text-xs font-bold hover:bg-sky-50 transition-colors shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              PDFを作成する
            </Link>
          </div>
          <FileDown className="w-12 h-12 opacity-20" />
        </div>
      </div>
    </MainLayout>
  );
}
