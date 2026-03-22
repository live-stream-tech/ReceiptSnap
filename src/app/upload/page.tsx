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
  CloudUpload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const { addReceipt } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
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
          <div className="text-center animate-fade-up">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 mb-2">登録完了しました</h2>
            <p className="text-brand-600/50 text-sm">証憑一覧に移動します...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-brand-900 tracking-wide">書類をアップロード</h1>
          <p className="text-brand-600/60 mt-1 text-sm">領収書・請求書を登録してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload Area */}
          <div className="card-glass rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div className="px-6 py-4 border-b border-sky-100/60">
              <h2 className="font-bold text-brand-900 text-sm">書類ファイル</h2>
            </div>
            <div className="p-6">
              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="プレビュー"
                    className="w-full max-h-56 object-contain rounded-xl bg-sky-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFileName("");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-brand-900/60 rounded-full flex items-center justify-center text-white hover:bg-brand-900/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-brand-500/50 mt-2 text-center truncate">{fileName}</p>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
                    isDragging
                      ? "border-sky-400 bg-sky-50"
                      : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/50"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CloudUpload className="w-8 h-8 text-sky-400" />
                  </div>
                  <p className="text-sm font-medium text-brand-700">ファイルをドラッグ＆ドロップ</p>
                  <p className="text-xs text-brand-500/50 mt-1">または下のボタンから選択</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-sky-200 text-sm font-medium text-brand-700 hover:bg-sky-50 transition-colors"
                >
                  <Camera className="w-5 h-5 text-sky-500" />
                  カメラで撮影
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-sky-200 text-sm font-medium text-brand-700 hover:bg-sky-50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-sky-500" />
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
          <div className="card-glass rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "160ms" }}>
            <div className="px-6 py-4 border-b border-sky-100/60">
              <h2 className="font-bold text-brand-900 text-sm">書類情報</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-2">
                  日付 <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white/80"
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-2">
                  取引先・店舗名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="例：Amazon、コンビニ、〇〇株式会社"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white/80"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-2">
                  金額（円） <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-medium">¥</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0"
                    required
                    min="0"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white/80"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-2">
                  勘定科目 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as DocumentCategory })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent appearance-none bg-white/80"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-2">メモ（任意）</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="備考・詳細など"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent resize-none bg-white/80"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-up">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all gradient-hero shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            書類を登録する
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
