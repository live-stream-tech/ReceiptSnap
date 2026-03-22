"use client";

import { useState } from "react";
import { MainLayout, showToast } from "@/components/MainLayout";
import { useStore } from "@/store";
import {
  Building2,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Download,
  Trash2,
  FileText,
  ExternalLink,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { receipts, clearAll } = useStore();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = async () => {
    if (resetConfirm) {
      await clearAll();
      showToast("全データを削除しました", "info");
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["日付", "取引先", "金額", "科目", "ステータス", "メモ"];
    const rows = receipts.map((r) => [r.date, r.vendor, r.amount, r.category, r.status, r.note]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `receiptsnap_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const menuItems = [
    { icon: Bell,      label: "通知設定",                   description: "リマインダー・アラートの管理",   color: "bg-sky-50",     iconColor: "text-sky-500" },
    { icon: Shield,    label: "プライバシー・セキュリティ", description: "データの保護と管理",             color: "bg-teal-50",    iconColor: "text-teal-500" },
    { icon: HelpCircle, label: "ヘルプ・サポート",          description: "よくある質問・お問い合わせ",     color: "bg-blue-50",    iconColor: "text-blue-500" },
    { icon: FileText,  label: "利用規約・プライバシーポリシー", description: "法的情報の確認",            color: "bg-indigo-50",  iconColor: "text-indigo-500" },
  ];

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-brand-900 tracking-wide">設定</h1>
          <p className="text-brand-600/60 text-sm mt-1">アカウントと環境の設定</p>
        </div>

        {/* Business Info */}
        <div
          className="card-glass rounded-2xl overflow-hidden mb-5 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-sky-100/60">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="font-bold text-brand-900 text-sm">事業者情報</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-2">屋号・事業者名</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="例：フリーランスデザイン工房"
                className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white/80"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-2">氏名</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="例：山田 太郎"
                className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white/80"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full py-3 gradient-hero text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  保存しました
                </>
              ) : "保存する"}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div
          className="card-glass rounded-2xl overflow-hidden mb-5 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-sky-100/60">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-teal-500" />
            </div>
            <h2 className="font-bold text-brand-900 text-sm">データ管理</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-900">CSVエクスポート</p>
                <p className="text-xs text-brand-500/60 mt-0.5">全書類データをCSVで出力（弥生会計対応）</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-xs font-bold hover:bg-teal-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                出力
              </button>
            </div>
            <div className="border-t border-sky-100 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-brand-900">書類数</p>
                  <p className="text-xs text-brand-500/60 mt-0.5">登録済みの書類</p>
                </div>
                <span className="text-lg font-bold text-brand-700">{receipts.length}件</span>
              </div>
              <button
                onClick={handleReset}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                  resetConfirm
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-red-200 bg-white text-red-400 hover:border-red-400 hover:text-red-600"
                }`}
              >
                {resetConfirm ? "⚠️ もう一度タップで全データを削除します" : "すべてのデータをリセット"}
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Storage CTA */}
        <div
          className="gradient-hero rounded-2xl p-6 mb-5 text-white hover-lift shadow-lg animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg mb-1">7年間クラウド保存</p>
              <p className="text-sky-200 text-xs mb-4">電子帳簿保存法に対応。書類を安全にクラウドで保管します。</p>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-sky-700 rounded-xl text-xs font-bold hover:bg-sky-50 transition-colors shadow-sm">
                <ExternalLink className="w-3.5 h-3.5" />
                詳細を見る（準備中）
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div
          className="card-glass rounded-2xl overflow-hidden mb-5 animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          {menuItems.map(({ icon: Icon, label, description, color, iconColor }, i) => (
            <button
              key={label}
              className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-sky-50/40 transition-colors text-left ${i > 0 ? "border-t border-sky-50" : ""}`}
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-900">{label}</p>
                <p className="text-xs text-brand-500/50 mt-0.5">{description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-sky-300 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Version */}
        <p className="text-center text-xs text-brand-500/30 pb-4 animate-fade-up" style={{ animationDelay: "400ms" }}>
          ReceiptSnap v1.0.0 · 電子帳簿保存法対応
        </p>
      </div>
    </MainLayout>
  );
}
