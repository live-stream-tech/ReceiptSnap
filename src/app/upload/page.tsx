"use client";

import { useState, useRef, useEffect } from "react";
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
  Smartphone,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

// PC判定フック
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export default function UploadPage() {
  const router = useRouter();
  const { addReceipt } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useIsDesktop();

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [QRCode, setQRCode] = useState<React.ComponentType<{ value: string; size: number; level: string; bgColor: string; fgColor: string; style?: React.CSSProperties }> | null>(null);
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

  // QRコードライブラリを動的インポート
  useEffect(() => {
    if (showQR) {
      import("qrcode.react").then((mod) => {
        setQRCode(() => mod.QRCodeSVG as typeof QRCode);
      });
    }
  }, [showQR]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

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
          <p className="text-brand-600/60 mt-1 text-sm">領収書・請求書・スクリーンショットを登録してください</p>
        </div>

        {/* PC向け：スマホで撮影するQRコード誘導 */}
        {isDesktop && (
          <div className="card-glass rounded-2xl overflow-hidden mb-5 animate-fade-up" style={{ animationDelay: "40ms" }}>
            <button
              type="button"
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-sky-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-brand-900">スマホで撮影してアップロード</p>
                  <p className="text-xs text-brand-500/60">QRコードを読み取るとスマホで直接撮影できます</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">おすすめ</span>
                <QrCode className={cn("w-4 h-4 text-brand-400 transition-transform duration-200", showQR && "rotate-180")} />
              </div>
            </button>

            {showQR && (
              <div className="px-6 pb-6 border-t border-sky-100/60 animate-fade-up">
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-5">
                  {/* QRコード */}
                  <div className="flex-shrink-0">
                    <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center shadow-md border border-sky-100 p-2">
                      {QRCode ? (
                        <QRCode
                          value={currentUrl}
                          size={112}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#0369a1"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-sky-50 rounded-xl flex items-center justify-center">
                          <QrCode className="w-10 h-10 text-sky-300 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-brand-400/60 text-center mt-2">このページのQRコード</p>
                  </div>

                  {/* 説明 */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-brand-900 mb-3">使い方</p>
                    <ol className="space-y-2.5">
                      {[
                        { num: "1", text: "スマホのカメラでQRコードを読み取る" },
                        { num: "2", text: "スマホのブラウザでこのページが開く" },
                        { num: "3", text: "「カメラで撮影」ボタンで領収書を撮影" },
                        { num: "4", text: "情報を入力して登録完了" },
                      ].map(({ num, text }) => (
                        <li key={num} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {num}
                          </span>
                          <span className="text-xs text-brand-700 leading-relaxed">{text}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-[11px] text-brand-400/60 mt-3 leading-relaxed">
                      ※ 写真・スクリーンショット・PDFに対応しています
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
                  <p className="text-xs text-brand-400/40 mt-1">写真・スクリーンショット・PDF対応</p>
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
