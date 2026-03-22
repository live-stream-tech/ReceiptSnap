"use client";

import Link from "next/link";
import { Camera, Sparkles, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

// ─── FAQ ────────────────────────────────────────────────────
const FAQS = [
  { q: "確定申告の締め切りを過ぎても使えますか？", a: "はい。期限後申告にも使えます。書類をまとめてアップロードしてPDFを出力できます。" },
  { q: "スマホだけで使えますか？", a: "はい。スマホのブラウザで完全に動作します。アプリのインストールは不要です。" },
  { q: "無料でどこまで使えますか？", a: "書類のアップロード・整理・レポート確認・CSVダウンロードまで無料です。PDF出力のみ有料です。" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-bold text-gray-800 leading-relaxed">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-5 -mt-1">{a}</p>
      )}
    </div>
  );
}

export default function LPPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── ① ファーストビュー ── */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* ロゴ */}
        <p className="text-sm font-bold text-sky-500 tracking-widest mb-8">ReceiptSnap</p>

        {/* メインコピー */}
        <h1 className="text-4xl font-black leading-snug text-gray-900 mb-5">
          撮るだけで<br />
          <span className="text-sky-500">収支内訳書</span>が完成
        </h1>

        {/* サブコピー */}
        <p className="text-base text-gray-500 leading-relaxed mb-10">
          レシートもスクショもOK<br />
          もう手入力はいりません
        </p>
        {/* 3分で完了バッジ */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-sm font-bold mb-6">
          <span>⏱️</span>
          <span>3分で完了</span>
        </div>

        {/* CTAボタン */}
        <Link
          href="/upload"
          className="inline-block w-full max-w-xs py-5 rounded-2xl bg-sky-500 text-white text-lg font-black text-center shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform"
        >
          今すぐ無料で試す
        </Link>

        {/* スクロール誘導 */}
        <div className="absolute bottom-8 flex flex-col items-center gap-1 animate-bounce">
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </div>
      </section>

      {/* ── ② 共感セクション ── */}
      <section className="px-6 py-20 text-center bg-gray-50">
        <p className="text-2xl font-black text-gray-900 leading-relaxed mb-6">
          レシート、<br />
          溜めてませんか？
        </p>
        <p className="text-base text-gray-500 leading-relaxed">
          あとでやろうと思って<br />
          気づいたら大量…<br />
          <br />
          確定申告のたびに<br />
          同じことを繰り返していませんか？
        </p>
      </section>

      {/* ── ③ 解決セクション ── */}
      <section className="px-6 py-20 text-center">
        <p className="text-xs font-bold text-sky-500 tracking-widest mb-6">SOLUTION</p>
        <p className="text-2xl font-black text-gray-900 leading-relaxed mb-6">
          ReceiptSnapなら<br />
          <span className="text-sky-500">撮るだけ</span>で自動分類
        </p>
        <p className="text-base text-gray-500 leading-relaxed">
          日付・金額・カテゴリを<br />
          まとめて処理<br />
          <br />
          そのまま書類にできます
        </p>
      </section>

      {/* ── ④ 3ステップ ── */}
      <section className="px-6 py-20 bg-gray-50">
        <p className="text-xs font-bold text-sky-500 tracking-widest text-center mb-10">HOW TO USE</p>

        <div className="flex flex-col gap-8 max-w-xs mx-auto">
          {[
            { icon: Camera,    step: "01", label: "撮る",     desc: "レシートやスクショをそのまま撮影" },
            { icon: Sparkles,  step: "02", label: "自動分類", desc: "日付・金額・カテゴリが自動で整理" },
            { icon: FileText,  step: "03", label: "PDF出力",  desc: "収支内訳書がそのまま完成" },
          ].map(({ icon: Icon, step, label, desc }) => (
            <div key={step} className="flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center">
                <Icon className="w-7 h-7 text-sky-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-sky-400 tracking-widest mb-0.5">STEP {step}</p>
                <p className="text-lg font-black text-gray-900 mb-1">{label}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ⑤ ベネフィット ── */}
      <section className="px-6 py-20 text-center">
        <p className="text-xs font-bold text-sky-500 tracking-widest mb-10">BENEFITS</p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {[
            { emoji: "⏱️", text: "入力時間\nほぼゼロ" },
            { emoji: "📄", text: "確定申告が\n一瞬" },
            { emoji: "💼", text: "副業でも\n安心" },
            { emoji: "🗑️", text: "もうエクセル\n不要" },
          ].map(({ emoji, text }) => (
            <div key={text} className="bg-gray-50 rounded-2xl py-7 px-4 flex flex-col items-center gap-2">
              <span className="text-3xl">{emoji}</span>
              <p className="text-sm font-bold text-gray-800 whitespace-pre-line text-center leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ⑥ CTA（再） ── */}
      <section className="px-6 py-20 text-center bg-sky-500">
        <p className="text-2xl font-black text-white mb-3 leading-snug">
          まずは無料で<br />試してみてください
        </p>
        <p className="text-sm text-sky-100 mb-10">まずは1枚、撮るだけで試せます</p>
        <Link
          href="/upload"
          className="inline-block w-full max-w-xs py-5 rounded-2xl bg-white text-sky-500 text-lg font-black text-center shadow-lg active:scale-[0.98] transition-transform"
        >
          今すぐ無料で試す
        </Link>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <p className="text-xs font-bold text-sky-500 tracking-widest text-center mb-8">FAQ</p>
        <div className="divide-y divide-gray-100">
          {FAQS.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ── ⑦ フッター ── */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mb-4">
          <Link href="/terms" className="hover:text-gray-600 transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</Link>
          <Link href="/legal" className="hover:text-gray-600 transition-colors">特定商取引法</Link>
        </div>
        <p className="text-xs text-gray-300">© ReceiptSnap</p>
      </footer>

    </div>
  );
}
