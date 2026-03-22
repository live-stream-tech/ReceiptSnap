"use client";

import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useStore } from "@/store";
import {
  User,
  Building2,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Download,
  Trash2,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const { receipts } = useStore();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["日付", "取引先", "金額", "科目", "ステータス", "メモ"];
    const rows = receipts.map((r) => [
      r.date,
      r.vendor,
      r.amount,
      r.category,
      r.status,
      r.note,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receiptsnap_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const menuItems = [
    {
      icon: Bell,
      label: "通知設定",
      description: "リマインダー・アラートの管理",
      action: () => {},
    },
    {
      icon: Shield,
      label: "プライバシー・セキュリティ",
      description: "データの保護と管理",
      action: () => {},
    },
    {
      icon: HelpCircle,
      label: "ヘルプ・サポート",
      description: "よくある質問・お問い合わせ",
      action: () => {},
    },
    {
      icon: FileText,
      label: "利用規約・プライバシーポリシー",
      description: "法的情報の確認",
      action: () => {},
    },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">設定</h1>
          <p className="text-gray-500 text-sm mt-1">アカウントと環境の設定</p>
        </div>

        {/* Business Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="flex items-center gap-3 p-4 border-b border-gray-50">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-brand-600" />
            </div>
            <h2 className="font-semibold text-gray-900 text-sm">事業者情報</h2>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                屋号・事業者名
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="例：フリーランスデザイン工房"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                氏名
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="例：山田 太郎"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full py-2.5 gradient-brand text-white rounded-xl font-medium text-sm transition-all"
            >
              {saved ? "保存しました ✓" : "保存する"}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="flex items-center gap-3 p-4 border-b border-gray-50">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900 text-sm">データ管理</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  CSVエクスポート
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  全書類データをCSVで出力（弥生会計対応）
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                出力
              </button>
            </div>
            <div className="border-t border-gray-50 pt-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    書類数
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    登録済みの書類
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {receipts.length}件
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Storage CTA */}
        <div className="bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl p-5 mb-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold mb-1">7年間クラウド保存</p>
              <p className="text-xs opacity-80 mb-3">
                電子帳簿保存法に対応。書類を安全にクラウドで保管します。
              </p>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white text-brand-600 rounded-xl text-xs font-semibold hover:bg-brand-50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                詳細を見る（準備中）
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          {menuItems.map(({ icon: Icon, label, description, action }, i) => (
            <button
              key={label}
              onClick={action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${i > 0 ? "border-t border-gray-50" : ""}`}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-300 pb-4">
          ReceiptSnap v1.0.0 · 電子帳簿保存法対応
        </p>
      </div>
    </MainLayout>
  );
}
