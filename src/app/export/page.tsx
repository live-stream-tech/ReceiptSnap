"use client";

import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import {
  FileDown,
  Check,
  Lock,
  Sparkles,
  ChevronDown,
  Receipt,
  FileText,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

type Plan = "basic" | "complete";

const PLANS = [
  {
    id: "basic" as Plan,
    name: "ベーシック",
    price: 500,
    description: "収支報告書・決算書（数字のみ）",
    features: [
      "収支内訳書PDF",
      "青色申告決算書PDF",
      "科目別集計表",
      "1シーズン有効",
    ],
    gradient: "from-sky-400 to-blue-600",
    badge: null,
  },
  {
    id: "complete" as Plan,
    name: "コンプリート",
    price: 1000,
    description: "決算書＋書類まとめPDF（日付順）",
    features: [
      "ベーシックの全機能",
      "アップロード書類を日付順に添付",
      "科目別に整理されたPDF",
      "税務調査対応の証憑一覧",
    ],
    gradient: "from-teal-400 to-emerald-600",
    badge: "おすすめ",
  },
];

export default function ExportPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("complete");
  const [step, setStep] = useState<"select" | "payment" | "generating" | "done">("select");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");

  const { getTotalIncome, getTotalExpense, getTotalByCategory, getReceiptsByYear } = useStore();

  const income   = getTotalIncome(selectedYear);
  const expense  = getTotalExpense(selectedYear);
  const profit   = income - expense;
  const totals   = getTotalByCategory(selectedYear);
  const receipts = getReceiptsByYear(selectedYear);
  const plan     = PLANS.find((p) => p.id === selectedPlan)!;

  const handleProceedToPayment = () => {
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGeneratePDF = async () => {
    setStep("generating");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      doc.setFontSize(20);
      doc.setTextColor(3, 105, 161);
      doc.text("ReceiptSnap", 20, 20);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${selectedYear}年度 収支報告書`, 20, 32);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`出力日：${new Date().toLocaleDateString("ja-JP")}`, 20, 40);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("■ 収支サマリー", 20, 55);

      doc.setFontSize(10);
      const summaryData = [
        ["売上合計", formatCurrency(income)],
        ["経費合計", formatCurrency(expense)],
        ["差引利益", formatCurrency(profit)],
      ];

      summaryData.forEach(([label, value], i) => {
        doc.text(label, 25, 65 + i * 8);
        doc.text(value, 100, 65 + i * 8, { align: "right" });
      });

      doc.setFontSize(12);
      doc.text("■ 科目別経費内訳", 20, 100);

      doc.setFontSize(9);
      let y = 110;
      Object.entries(totals)
        .filter(([cat, amt]) => cat !== "売上" && amt > 0)
        .sort(([, a], [, b]) => b - a)
        .forEach(([category, amount]) => {
          doc.text(category, 25, y);
          doc.text(formatCurrency(amount), 100, y, { align: "right" });
          y += 7;
        });

      if (selectedPlan === "complete" && receipts.length > 0) {
        doc.addPage();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("■ 証憑一覧（日付順）", 20, 20);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("日付", 20, 30);
        doc.text("取引先", 45, 30);
        doc.text("科目", 110, 30);
        doc.text("金額", 160, 30, { align: "right" });
        doc.line(20, 32, 190, 32);

        doc.setTextColor(0, 0, 0);
        let ry = 38;
        const sorted = [...receipts].sort((a, b) => a.date.localeCompare(b.date));
        sorted.forEach((r) => {
          if (ry > 270) { doc.addPage(); ry = 20; }
          doc.text(r.date, 20, ry);
          doc.text(r.vendor.substring(0, 25), 45, ry);
          doc.text(r.category.substring(0, 10), 110, ry);
          doc.text(formatCurrency(r.amount), 160, ry, { align: "right" });
          ry += 6;
        });
      }

      doc.save(`receiptsnap_${selectedYear}_${selectedPlan}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    }

    setStep("done");
  };

  if (step === "generating") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center animate-fade-up">
            <div className="w-20 h-20 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg animate-pulse">
              <FileDown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 mb-2">PDFを生成中...</h2>
            <p className="text-brand-600/50 text-sm">しばらくお待ちください</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step === "done") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-6 animate-fade-up">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 mb-2">PDFのダウンロードが完了しました</h2>
            <p className="text-brand-600/50 text-sm mb-6">
              {selectedYear}年度の{plan.name}プランのPDFが保存されました
            </p>
            <button
              onClick={() => setStep("select")}
              className="px-8 py-3 gradient-hero text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              別の年度を出力する
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step === "payment") {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setStep("select")}
            className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 mb-6 transition-colors animate-fade-up"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>

          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold text-brand-900 tracking-wide">お支払い</h1>
            <p className="text-brand-600/60 text-sm mt-1">{selectedYear}年度 {plan.name}プラン</p>
          </div>

          {/* Order Summary */}
          <div className="card-glass rounded-2xl p-6 mb-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <h2 className="font-bold text-brand-900 text-sm mb-4">ご注文内容</h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-brand-700">{plan.name}プラン（{selectedYear}年度）</span>
              <span className="text-sm font-bold text-brand-900">¥{plan.price.toLocaleString()}</span>
            </div>
            <div className="border-t border-sky-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-brand-900">合計</span>
              <span className="text-xl font-bold text-sky-600">¥{plan.price.toLocaleString()}（税込）</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card-glass rounded-2xl p-6 mb-5 animate-fade-up" style={{ animationDelay: "160ms" }}>
            <h2 className="font-bold text-brand-900 text-sm mb-4">お支払い方法</h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  paymentMethod === "card"
                    ? "border-sky-400 bg-sky-50"
                    : "border-sky-100 hover:border-sky-300"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", paymentMethod === "card" ? "gradient-sky" : "bg-sky-50")}>
                  <CreditCard className={cn("w-5 h-5", paymentMethod === "card" ? "text-white" : "text-sky-400")} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-900">クレジットカード</p>
                  <p className="text-xs text-brand-500/60">Visa / Mastercard / JCB</p>
                </div>
                {paymentMethod === "card" && <Check className="w-4 h-4 text-sky-500 ml-auto" />}
              </button>
              <button
                onClick={() => setPaymentMethod("bank")}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  paymentMethod === "bank"
                    ? "border-sky-400 bg-sky-50"
                    : "border-sky-100 hover:border-sky-300"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", paymentMethod === "bank" ? "gradient-sky" : "bg-sky-50")}>
                  <Receipt className={cn("w-5 h-5", paymentMethod === "bank" ? "text-white" : "text-sky-400")} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-900">口座振替</p>
                  <p className="text-xs text-brand-500/60">銀行口座から直接引き落とし</p>
                </div>
                {paymentMethod === "bank" && <Check className="w-4 h-4 text-sky-500 ml-auto" />}
              </button>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">決済機能は準備中です</p>
                <p className="text-xs text-amber-600 mt-0.5">現在はデモとして、決済なしでPDFをダウンロードできます</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGeneratePDF}
            className="w-full py-4 gradient-hero text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            PDFをダウンロードする（デモ）
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-brand-900 tracking-wide">決算書PDF出力</h1>
          <p className="text-brand-600/60 text-sm mt-1">プランを選択してPDFをダウンロードしてください</p>
        </div>

        {/* Year Selection */}
        <div className="card-glass rounded-2xl p-5 mb-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <label className="block text-xs font-semibold text-brand-700 mb-3">対象年度</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 appearance-none bg-white/80"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}年度</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" />
          </div>
        </div>

        {/* Summary Preview */}
        <div
          className="card-glass rounded-2xl p-5 mb-5 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <p className="text-xs font-semibold text-brand-600/60 mb-4">{selectedYear}年度 収支サマリー</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-emerald-600/70 mb-1">売上</p>
              <p className="text-sm font-bold text-emerald-700">{formatCurrency(income)}</p>
            </div>
            <div className="bg-sky-50 rounded-xl p-3">
              <p className="text-xs text-sky-600/70 mb-1">経費</p>
              <p className="text-sm font-bold text-sky-700">{formatCurrency(expense)}</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-3">
              <p className="text-xs text-teal-600/70 mb-1">利益</p>
              <p className={`text-sm font-bold ${profit >= 0 ? "text-teal-700" : "text-red-500"}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </div>
          <p className="text-xs text-brand-500/40 mt-3">書類数：{receipts.length}件</p>
        </div>

        {/* Plan Selection */}
        <div className="space-y-4 mb-6">
          {PLANS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={cn(
                "w-full text-left rounded-2xl border-2 p-5 transition-all animate-fade-up hover-lift",
                selectedPlan === p.id
                  ? "border-sky-400 bg-sky-50/60 shadow-md"
                  : "border-sky-100 bg-white/80 hover:border-sky-300"
              )}
              style={{ animationDelay: `${240 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    `bg-gradient-to-br ${p.gradient}`
                  )}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-900">{p.name}</span>
                      {p.badge && (
                        <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-semibold">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-600/60 mt-0.5">{p.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-brand-900">¥{p.price.toLocaleString()}</span>
                  <p className="text-xs text-brand-500/50">/シーズン</p>
                </div>
              </div>
              <ul className="space-y-1.5 pl-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-brand-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 text-xs text-brand-500/50 mb-5 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <Lock className="w-3.5 h-3.5" />
          <span>ロボットペイメントによる安全な決済処理</span>
        </div>

        <button
          onClick={handleProceedToPayment}
          className="w-full py-4 gradient-hero text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 animate-fade-up"
          style={{ animationDelay: "480ms" }}
        >
          <Sparkles className="w-5 h-5" />
          {plan.name}プランで出力する（¥{plan.price.toLocaleString()}）
        </button>
      </div>
    </MainLayout>
  );
}
