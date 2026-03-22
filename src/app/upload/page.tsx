"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useStore, CATEGORIES, type DocumentCategory } from "@/store";
import { useRouter } from "next/navigation";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const { addReceipt } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    amount: "",
    category: "事務用品費" as DocumentCategory,
    note: "",
    status: "pending" as const,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vendor.trim()) {
      setError("取引先を入力してください");
      return;
    }
    if (!form.amount || isNaN(Number(form.amount))) {
      setError("金額を正しく入力してください");
      return;
    }
    setError("");

    addReceipt({
      date: form.date,
      vendor: form.vendor,
      amount: Number(form.amount),
      category: form.category,
      note: form.note,
      status: form.status,
      imageUrl: preview || undefined,
      fileName: fileName || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      router.push("/receipts");
    }, 1500);
  };

  if (submitted) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              登録完了しました
            </h2>
            <p className="text-gray-500 text-sm">証憑一覧に移動します...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">書類をアップロード</h1>
          <p className="text-gray-500 text-sm mt-1">
            領収書・請求書を登録してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload Area */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">書類ファイル</h2>
            </div>
            <div className="p-4">
              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="プレビュー"
                    className="w-full max-h-48 object-contain rounded-xl bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFileName("");
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/60 rounded-full flex items-center justify-center text-white hover:bg-gray-900/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center truncate">
                    {fileName}
                  </p>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-300 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    ファイルをドラッグ＆ドロップ
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    または下のボタンから選択
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4 text-brand-500" />
                  カメラで撮影
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-brand-500" />
                  ファイルを選択
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">書類情報</h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  日付 <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  取引先・店舗名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="例：Amazon、コンビニ、〇〇株式会社"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  金額（円） <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ¥
                  </span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="0"
                    required
                    min="0"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  勘定科目 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as DocumentCategory,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent appearance-none bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  メモ（任意）
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="備考・詳細など"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={cn(
              "w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all",
              "gradient-brand shadow-sm hover:shadow-md active:scale-[0.98]"
            )}
          >
            書類を登録する
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
