"use client";

import Link from "next/link";
import { Camera, Sparkles, FileText, ChevronDown, Check, X } from "lucide-react";
import { useState } from "react";

// ─── FAQ ────────────────────────────────────────────────────
const FAQS = [
  { q: "アプリのインストールは必要ですか？", a: "不要です。スマホのブラウザだけで完全に動作します。" },
  { q: "無料でどこまで使えますか？", a: "書類のアップロード・整理・レポート確認・CSVダウンロードまで無料です。PDF出力のみ有料です。" },
  { q: "データはどこに保存されますか？", a: "データはお使いのブラウザ（端末）に保存されます。サーバーへの送信はありません。" },
  { q: "確定申告の締め切りを過ぎても使えますか？", a: "はい。期限後申告にも使えます。書類をまとめてアップロードしてPDFを出力できます。" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-bold text-gray-800 leading-relaxed">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-4 -mt-1">{a}</p>
      )}
    </div>
  );
}

export default function LPPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">

      {/* ── ① ファーストビュー ── */}
      <section className="flex flex-col items-center justify-center min-h-[100svh] px-6 text-center relative pb-24">
        {/* ロゴ */}
        <p className="text-xs font-bold text-sky-500 tracking-widest mb-8">ReceiptSnap</p>

        {/* フック */}
        <p className="text-lg font-bold text-gray-500 mb-3">確定申告、まだ手入力してる？</p>

        {/* メインコピー */}
        <h1 className="text-[2.6rem] font-black leading-tight text-gray-900 mb-6">
          レシートを撮るだけで<br />
          <span className="text-sky-500">3分で終わる</span>
        </h1>

        {/* サブ */}
        <p className="text-base text-gray-500 leading-relaxed mb-8">
          収支内訳書まで自動で完成。<br />手入力はもういりません。
        </p>

        {/* 安心バッジ */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["登録不要", "データ保存なし", "スマホ完結"].map(t => (
            <span key={t} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold">
              <Check className="w-3 h-3" />
              {t}
            </span>
          ))}
        </div>

        {/* CTAボタン */}
        <Link
          href="/upload"
          className="inline-block w-full max-w-sm py-5 rounded-2xl bg-sky-500 text-white text-xl font-black text-center shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform"
        >
          今すぐ無料で試す
        </Link>

        {/* スクロール誘導 */}
        <div className="absolute bottom-6 flex flex-col items-center gap-1 animate-bounce">
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </div>
      </section>

      {/* ── ② 差別化セクション ── */}
      <section className="px-6 py-14 bg-gray-50">
        <p className="text-center text-xs font-bold text-sky-500 tracking-widest mb-8">ReceiptSnapの違い</p>

        <div className="max-w-sm mx-auto flex flex-col gap-4">
          {/* 他アプリ */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-bold text-gray-400 mb-3">他の家計簿・経費アプリ</p>
            <div className="flex flex-col gap-2">
              {["レシートをスキャン", "カテゴリ分類", "グラフで確認"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{t}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm font-bold text-red-400">収支内訳書は自分で作る必要あり</span>
              </div>
            </div>
          </div>

          {/* ReceiptSnap */}
          <div className="rounded-2xl border-2 border-sky-400 bg-sky-50 p-5 relative">
            <span className="absolute -top-3 left-5 bg-sky-500 text-white text-xs font-black px-3 py-1 rounded-full">ReceiptSnap</span>
            <div className="flex flex-col gap-2 mt-1">
              {["レシートをスキャン", "カテゴリ分類", "グラフで確認"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{t}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <Check className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span className="text-sm font-black text-sky-600">収支内訳書まで自動で完成 ✨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ③ 3ステップ ── */}
      <section className="px-6 py-14">
        <p className="text-center text-xs font-bold text-sky-500 tracking-widest mb-10">使い方</p>

        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {[
            { icon: Camera,   step: "1", label: "撮る",     desc: "レシート・スクショ・PDFをそのまま" },
            { icon: Sparkles, step: "2", label: "自動整理", desc: "日付・金額・カテゴリが自動で分類" },
            { icon: FileText, step: "3", label: "書類完成", desc: "収支内訳書がそのままPDFで出力" },
          ].map(({ icon: Icon, step, label, desc }) => (
            <div key={step} className="flex items-center gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center shadow-md shadow-sky-200">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-sky-400 tracking-widest mb-0.5">STEP {step}</p>
                <p className="text-lg font-black text-gray-900 mb-0.5">{label}</p>
                <p className="text-sm text-gray-400 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ④ 安心セクション ── */}
      <section className="px-6 py-14 bg-gray-50">
        <p className="text-center text-xs font-bold text-sky-500 tracking-widest mb-8">安心して使えます</p>

        <div className="max-w-sm mx-auto flex flex-col gap-4">
          {[
            { emoji: "🔒", title: "データ保存なし", desc: "入力データはすべてお使いの端末（ブラウザ）に保存されます。サーバーには送信されません。" },
            { emoji: "📱", title: "スマホ完結", desc: "アプリのインストール不要。スマホのブラウザだけで全機能が使えます。" },
            { emoji: "🆓", title: "登録不要・無料から", desc: "アカウント登録なしですぐ使えます。アップロード・整理・確認まで無料です。" },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
              <span className="text-2xl flex-shrink-0">{emoji}</span>
              <div>
                <p className="text-sm font-black text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ⑤ 最終CTA ── */}
      <section className="px-6 py-16 text-center">
        <p className="text-2xl font-black text-gray-900 leading-snug mb-3">
          まず1枚、<br />撮るだけでいい。
        </p>
        <p className="text-sm text-gray-400 mb-8">3分で終わります</p>
        <Link
          href="/upload"
          className="inline-block w-full max-w-sm py-5 rounded-2xl bg-sky-500 text-white text-xl font-black text-center shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform"
        >
          今すぐ無料で試す
        </Link>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-14 max-w-lg mx-auto">
        <p className="text-xs font-bold text-sky-500 tracking-widest text-center mb-6">よくある質問</p>
        <div className="divide-y divide-gray-100">
          {FAQS.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ── フッター ── */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mb-4">
          <Link href="/terms" className="hover:text-gray-600 transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</Link>
          <Link href="/legal" className="hover:text-gray-600 transition-colors">特定商取引法</Link>
        </div>
        <p className="text-xs text-gray-300">© ReceiptSnap</p>
      </footer>

      {/* ── 固定CTAボタン（スマホ用） ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100 z-50 md:hidden">
        <Link
          href="/upload"
          className="block w-full py-4 rounded-2xl bg-sky-500 text-white text-lg font-black text-center shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform"
        >
          今すぐ無料で試す
        </Link>
      </div>

    </div>
  );
}
