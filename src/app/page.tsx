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
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Calendar,
} from "lucide-react";

const currentYear = new Date().getFullYear();

export default function HomePage() {
  const { receipts, getTotalIncome, getTotalExpense } = useStore();

  const income = getTotalIncome(currentYear);
  const expense = getTotalExpense(currentYear);
  const profit = income - expense;
  const pendingCount = receipts.filter((r) => r.status === "pending").length;
  const yearReceipts = receipts.filter((r) => r.date.startsWith(String(currentYear)));
  const recentReceipts = receipts.slice(0, 5);

  const summaryCards = [
    {
      label: "売上合計",
      value: formatCurrency(income),
      icon: TrendingUp,
      gradient: "from-sky-400 to-blue-600",
      sub: `${currentYear}年度`,
      delay: "0ms",
    },
    {
      label: "経費合計",
      value: formatCurrency(expense),
      icon: TrendingDown,
      gradient: "from-cyan-400 to-teal-600",
      sub: `${currentYear}年度`,
      delay: "80ms",
    },
    {
      label: "書類数",
      value: `${yearReceipts.length}件`,
      icon: FileText,
      gradient: "from-teal-400 to-emerald-600",
      sub: `${currentYear}年度`,
      delay: "160ms",
    },
    {
      label: "確認待ち",
      value: `${pendingCount}件`,
      icon: Clock,
      gradient: "from-blue-400 to-indigo-600",
      sub: "要確認",
      delay: "240ms",
    },
  ];

  const features = [
    { icon: ShieldCheck, label: "電子帳簿保存法対応",       color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Zap,         label: "写真・スクリーンショット・PDF対応", color: "text-sky-500",     bg: "bg-sky-50" },
    { icon: Calendar,    label: "7年間クラウド保存",        color: "text-teal-500",    bg: "bg-teal-50" },
    { icon: Sparkles,    label: "決算書PDFをワンクリック出力",   color: "text-blue-500",    bg: "bg-blue-50" },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-sky-500 font-medium mb-1">
          <Calendar className="w-4 h-4" />
          <span>{currentYear}年度</span>
        </div>
        <h1 className="text-3xl font-bold text-brand-900 tracking-wide">ダッシュボード</h1>
        <p className="text-brand-600/60 mt-1 text-sm">証憑の管理状況と収支サマリー</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, gradient, sub, delay }) => (
          <div
            key={label}
            className="card-glass rounded-2xl p-5 hover-lift animate-fade-up"
            style={{ animationDelay: delay }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-brand-600/60 font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-brand-900 leading-tight">{value}</p>
            <p className="text-xs text-brand-500/60 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Profit Banner */}
      {income > 0 && (
        <div
          className="card-glass rounded-2xl p-6 mb-6 animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-600/60 mb-1">{currentYear}年度 収支差引</p>
              <p className={`text-3xl font-bold ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {formatCurrency(profit)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-brand-500/50">経費率</p>
              <p className="text-2xl font-bold text-brand-700">
                {income > 0 ? Math.round((expense / income) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload CTA */}
      <Link
        href="/upload"
        className="block mb-8 animate-fade-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="gradient-hero rounded-2xl p-6 flex items-center justify-between group hover-lift shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">書類をアップロード</p>
              <p className="text-sky-200 text-sm mt-0.5">領収書・請求書を登録する</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </Link>

      {/* Feature pills */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 animate-fade-up"
        style={{ animationDelay: "480ms" }}
      >
        {features.map(({ icon: Icon, label, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl px-4 py-3 flex items-center gap-3 border border-white/60`}>
            <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
            <span className="text-xs font-medium text-brand-800">{label}</span>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div
        className="card-glass rounded-2xl overflow-hidden animate-fade-up"
        style={{ animationDelay: "560ms" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-sky-100/60">
          <h2 className="text-lg font-bold text-brand-900">最近の書類</h2>
          <Link
            href="/receipts"
            className="text-sm text-brand-500 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
          >
            すべて見る <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentReceipts.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
              <FileText className="w-10 h-10 text-sky-300" />
            </div>
            <p className="text-brand-600/50 text-sm mb-4">書類がまだありません</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-700 font-medium transition-colors"
            >
              最初の書類をアップロード <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {recentReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-sky-50/40 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl gradient-sky flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-brand-900 truncate">
                      {receipt.vendor || "取引先未設定"}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(receipt.category)}`}>
                      {receipt.category}
                    </span>
                  </div>
                  <p className="text-xs text-brand-500/50">{formatDateShort(receipt.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-brand-700">{formatCurrency(receipt.amount)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(receipt.status)}`}>
                    {getStatusLabel(receipt.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
