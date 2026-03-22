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
    color: "border-brand-200 bg-brand-50",
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
    color: "border-purple-200 bg-purple-50",
    badge: "おすすめ",
  },
];

export default function ExportPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("complete");
  const [step, setStep] = useState<"select" | "payment" | "generating" | "done">("select");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");

  const { getTotalIncome, getTotalExpense, getTotalByCategory, getReceiptsByYear } = useStore();

  const income = getTotalIncome(selectedYear);
  const expense = getTotalExpense(selectedYear);
  const profit = income - expense;
  const totals = getTotalByCategory(selectedYear);
  const receipts = getReceiptsByYear(selectedYear);
  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  const handleProceedToPayment = () => {
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGeneratePDF = async () => {
    setStep("generating");

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate and download PDF
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(236, 72, 153);
      doc.text("ReceiptSnap", 20, 20);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${selectedYear}年度 収支報告書`, 20, 32);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`出力日：${new Date().toLocaleDateString("ja-JP")}`, 20, 40);

      // Summary
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

      // Category breakdown
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
        const sorted = [...receipts].sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        sorted.forEach((r) => {
          if (ry > 270) {
            doc.addPage();
            ry = 20;
          }
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
          <div className="text-center">
            <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileDown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              PDFを生成中...
            </h2>
            <p className="text-gray-500 text-sm">しばらくお待ちください</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step === "done") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              PDFのダウンロードが完了しました
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {selectedYear}年度の{plan.name}プランのPDFが保存されました
            </p>
            <button
              onClick={() => setStep("select")}
              className="px-6 py-3 gradient-brand text-white rounded-xl font-medium text-sm"
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
        <div className="p-4 md:p-8 max-w-lg mx-auto">
          <button
            onClick={() => setStep("select")}
            className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
          >
            ← 戻る
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">お支払い</h1>
          <p className="text-gray-500 text-sm mb-6">
            {selectedYear}年度 {plan.name}プラン
          </p>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <h2 className="font-semibold text-gray-900 mb-3 text-sm">
              ご注文内容
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {plan.name}プラン（{selectedYear}年度）
              </span>
              <span className="text-sm font-semibold">
                ¥{plan.price.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">合計</span>
              <span className="text-lg font-bold text-brand-600">
                ¥{plan.price.toLocaleString()}（税込）
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <h2 className="font-semibold text-gray-900 mb-3 text-sm">
              お支払い方法
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left",
                  paymentMethod === "card"
                    ? "border-brand-400 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <CreditCard
                  className={cn(
                    "w-5 h-5",
                    paymentMethod === "card"
                      ? "text-brand-500"
                      : "text-gray-400"
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    クレジットカード
                  </p>
                  <p className="text-xs text-gray-500">
                    Visa / Mastercard / JCB
                  </p>
                </div>
                {paymentMethod === "card" && (
                  <Check className="w-4 h-4 text-brand-500 ml-auto" />
                )}
              </button>
              <button
                onClick={() => setPaymentMethod("bank")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left",
                  paymentMethod === "bank"
                    ? "border-brand-400 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Receipt
                  className={cn(
                    "w-5 h-5",
                    paymentMethod === "bank"
                      ? "text-brand-500"
                      : "text-gray-400"
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">口座振替</p>
                  <p className="text-xs text-gray-500">銀行口座から直接引き落とし</p>
                </div>
                {paymentMethod === "bank" && (
                  <Check className="w-4 h-4 text-brand-500 ml-auto" />
                )}
              </button>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  決済機能は準備中です
                </p>
                <p className="text-xs text-yellow-600 mt-0.5">
                  現在はデモとして、決済なしでPDFをダウンロードできます
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGeneratePDF}
            className="w-full py-3.5 gradient-brand text-white rounded-2xl font-semibold text-sm shadow-sm hover:shadow-md transition-shadow"
          >
            PDFをダウンロードする（デモ）
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">決算書PDF出力</h1>
          <p className="text-gray-500 text-sm mt-1">
            プランを選択してPDFをダウンロードしてください
          </p>
        </div>

        {/* Year Selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            対象年度
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 appearance-none bg-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}年度
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Summary Preview */}
        <div className="bg-gradient-to-r from-gray-50 to-brand-50 rounded-2xl border border-gray-100 p-4 mb-5">
          <p className="text-xs font-medium text-gray-500 mb-3">
            {selectedYear}年度 収支サマリー
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-500">売上</p>
              <p className="text-sm font-bold text-green-600">
                {formatCurrency(income)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">経費</p>
              <p className="text-sm font-bold text-brand-600">
                {formatCurrency(expense)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">利益</p>
              <p
                className={`text-sm font-bold ${profit >= 0 ? "text-gray-900" : "text-red-500"}`}
              >
                {formatCurrency(profit)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            書類数：{receipts.length}件
          </p>
        </div>

        {/* Plan Selection */}
        <div className="space-y-3 mb-6">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={cn(
                "w-full text-left rounded-2xl border-2 p-5 transition-all",
                selectedPlan === p.id
                  ? "border-brand-400 bg-brand-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      selectedPlan === p.id
                        ? "border-brand-500 bg-brand-500"
                        : "border-gray-300"
                    )}
                  >
                    {selectedPlan === p.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  {p.badge && (
                    <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {p.badge}
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ¥{p.price.toLocaleString()}
                  <span className="text-xs font-normal text-gray-500">
                    /シーズン
                  </span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 ml-7">{p.description}</p>
              <ul className="space-y-1 ml-7">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <Lock className="w-3.5 h-3.5" />
          <span>ロボットペイメントによる安全な決済処理</span>
        </div>

        <button
          onClick={handleProceedToPayment}
          className="w-full py-3.5 gradient-brand text-white rounded-2xl font-semibold text-sm shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {plan.name}プランで出力する（¥{plan.price.toLocaleString()}）
        </button>
      </div>
    </MainLayout>
  );
}
