"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  BarChart3,
  FileDown,
  FileText,
  Download,
  Cloud,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Receipt,
  Smartphone,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── チェックボックス課題 ────────────────────────────────────
const PAIN_POINTS = [
  "領収書をどこかに入れたまま行方不明になった",
  "確定申告の時期にレシートをまとめて探す羽目になった",
  "スマホのスクリーンショットがどこにあるかわからない",
  "経費の合計を手入力でExcelに打ち込んでいる",
  "去年の書類、もう捨てていいのかわからない",
  "税務調査が来たとき証拠を出せる自信がない",
];

// ─── FAQ ────────────────────────────────────────────────────
const FAQS = [
  {
    q: "確定申告の締め切りを過ぎても使えますか？",
    a: "はい。期限後申告にも対応しています。書類をまとめてアップロードしてPDFを出力できます。遅れても申告しないよりずっとマシです。",
  },
  {
    q: "スマホだけで使えますか？",
    a: "はい。スマホのブラウザで完全に動作します。PCで開いてQRコードを読み取り、スマホで撮影することもできます。",
  },
  {
    q: "データはどこに保存されますか？",
    a: "無料プランはブラウザ内（端末）に保存されます。7年保存プランは国内のセキュアなクラウドサーバーに保存されます。",
  },
  {
    q: "領収書以外も登録できますか？",
    a: "はい。請求書・銀行明細・スクリーンショット・PDFなど、あらゆる書類に対応しています。",
  },
];

// ─── 料金 ────────────────────────────────────────────────────
const PRICES = [
  { name: "無料プラン", price: "¥0", period: "ずっと無料", desc: "アップロード・レポート・CSV", highlight: false },
  { name: "シンプル出力", price: "¥500", period: "/ 回", desc: "収支内訳書PDF", highlight: false },
  { name: "税務調査対応", price: "¥1,000", period: "/ 回", desc: "決算書＋証憑一覧PDF", highlight: false },
  { name: "7年保存プラン", price: "¥2,500", period: "/ 年", desc: "クラウド保存＋PDF出力し放題", highlight: true },
];

// ─── 機能 ────────────────────────────────────────────────────
const FEATURES = [
  { icon: Camera,    label: "写真・スクショ・PDF対応",   desc: "どんな書類でもそのままアップロード" },
  { icon: BarChart3, label: "月別・科目別レポート",       desc: "収支が自動でグラフ化される" },
  { icon: FileDown,  label: "収支内訳書PDF出力",          desc: "国税庁フォーマット準拠" },
  { icon: FileText,  label: "税務調査対応の証憑一覧",     desc: "書類を日付順に自動整理" },
  { icon: Download,  label: "CSVエクスポート",             desc: "会計ソフトへの連携も簡単" },
  { icon: Cloud,     label: "7年間クラウド保存",           desc: "電子帳簿保存法に完全対応" },
  { icon: Smartphone,label: "スマホ完全対応",              desc: "撮ってすぐ登録できる" },
  { icon: Shield,    label: "セキュア決済",                desc: "ロボットペイメント採用" },
];

// ─── FAQ アイテム ────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-white/20 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(v => !v)}
    >
      <div className="flex items-center justify-between px-6 py-5 bg-white/5 hover:bg-white/10 transition-colors">
        <p className="text-sm font-bold text-white pr-4">{q}</p>
        <ChevronDown className={cn("w-5 h-5 text-sky-300 flex-shrink-0 transition-transform duration-300", open && "rotate-180")} />
      </div>
      {open && (
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-sm text-sky-100/80 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── メインコンポーネント ────────────────────────────────────
export default function LPPage() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const count = checked.size;
  const urgencyMsg =
    count === 0 ? null :
    count <= 2 ? { text: "ReceiptSnapで少し楽になれます", color: "text-sky-300" } :
    count <= 4 ? { text: "ReceiptSnapで書類管理を仕組み化しましょう", color: "text-yellow-300" } :
                 { text: "今すぐReceiptSnapを使い始めてください 🙏", color: "text-red-300" };

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden">

      {/* ── ノイズ・グロー背景 ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-sky-600/20 blur-[120px]" />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[80px]" />
      </div>

      {/* ── ヘッダー ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/">
          <Image src="/logo.png" alt="ReceiptSnap" width={140} height={42} className="object-contain brightness-0 invert" />
        </Link>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-sky-500/30"
        >
          無料で始める
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        {/* 緊急バッジ */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold mb-8 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          確定申告シーズン真っ只中
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          確定申告の書類、
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-teal-400">
            どこにありますか？
          </span>
        </h1>

        <p className="text-lg md:text-xl text-sky-100/70 leading-relaxed max-w-2xl mx-auto mb-10">
          レシート・請求書・スクリーンショットをまとめて管理。<br className="hidden md:block" />
          収支内訳書PDFまで自動で作れます。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/upload"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-lg shadow-2xl shadow-sky-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/60"
          >
            <Sparkles className="w-5 h-5" />
            無料で始める
          </Link>
          <Link
            href="#how"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white/80 hover:bg-white/5 font-bold text-base transition-all duration-200"
          >
            使い方を見る
            <ChevronDown className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-white/30">登録不要・クレカ不要・今すぐ使える</p>

        {/* ヒーロー装飾カード */}
        <div className="mt-16 grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {[
            { label: "対応書類", value: "全種類", sub: "写真・スクショ・PDF" },
            { label: "出力形式", value: "PDF", sub: "国税庁フォーマット準拠" },
            { label: "保存期間", value: "7年", sub: "電子帳簿保存法対応" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-[10px] text-sky-300/70 font-bold tracking-widest mb-1">{label}</p>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── チェックボックス課題提起 ── */}
      <section className="relative z-10 px-6 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-sky-400 tracking-widest mb-3">PAIN POINTS</p>
          <h2 className="text-3xl md:text-4xl font-black">
            こんな経験、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">ありませんか？</span>
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {PAIN_POINTS.map((point, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200",
                checked.has(i)
                  ? "border-sky-400 bg-sky-500/15 shadow-lg shadow-sky-500/20"
                  : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                checked.has(i)
                  ? "border-sky-400 bg-sky-500"
                  : "border-white/30"
              )}>
                {checked.has(i) && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors duration-200",
                checked.has(i) ? "text-white" : "text-white/60"
              )}>
                {point}
              </span>
            </button>
          ))}
        </div>

        {/* 結果メッセージ */}
        <div className={cn(
          "text-center transition-all duration-500",
          urgencyMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {urgencyMsg && (
            <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <p className={cn("text-base font-black", urgencyMsg.color)}>{urgencyMsg.text}</p>
              {count >= 3 && (
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1.5 mt-3 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-all"
                >
                  今すぐ無料で始める <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── 3ステップ ── */}
      <section id="how" className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-sky-400 tracking-widest mb-3">HOW IT WORKS</p>
          <h2 className="text-3xl md:text-4xl font-black">
            撮って、整理して、
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">申告書類を出力するだけ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              icon: "📸",
              title: "撮る・スキャンする",
              desc: "レシート・請求書・スクリーンショット・PDFをそのままアップロード。スマホのカメラで撮るだけでOK。",
              color: "from-sky-500 to-blue-600",
            },
            {
              num: "02",
              icon: "📊",
              title: "自動で整理される",
              desc: "日付・取引先・金額・科目を入力するだけで収支が自動集計。月別・科目別グラフもリアルタイムで更新。",
              color: "from-teal-500 to-emerald-600",
            },
            {
              num: "03",
              icon: "📄",
              title: "PDF出力で申告完了",
              desc: "国税庁フォーマット準拠の収支内訳書PDFをワンクリックで出力。税務調査対応の証憑一覧も作れます。",
              color: "from-violet-500 to-purple-600",
            },
          ].map(({ num, icon, title, desc, color }) => (
            <div key={num} className="relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-4 -left-2 text-6xl font-black text-white/5 select-none">{num}</div>
              <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl mb-5 shadow-lg", color)}>
                {icon}
              </div>
              <h3 className="text-lg font-black text-white mb-3">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 機能一覧 ── */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-sky-400 tracking-widest mb-3">FEATURES</p>
          <h2 className="text-3xl md:text-4xl font-black">
            必要な機能が
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">全部入り</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-sky-500/30 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-200">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-white mb-1">{label}</p>
              <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 料金 ── */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-sky-400 tracking-widest mb-3">PRICING</p>
          <h2 className="text-3xl md:text-4xl font-black">
            使った分だけ。
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">必要なときに、必要なだけ。</span>
          </h2>
          <p className="text-sm text-white/40 mt-4">基本機能は無料。PDF出力は都度課金。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PRICES.map(({ name, price, period, desc, highlight }) => (
            <div
              key={name}
              className={cn(
                "relative rounded-2xl p-6 border transition-all duration-200",
                highlight
                  ? "bg-gradient-to-br from-sky-500/20 to-teal-500/20 border-sky-400/50 shadow-xl shadow-sky-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/8"
              )}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black text-white bg-gradient-to-r from-sky-500 to-teal-500 shadow-md whitespace-nowrap">
                    おすすめ
                  </span>
                </div>
              )}
              <p className="text-xs font-bold text-sky-300/70 mb-2">{name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-white">{price}</span>
                <span className="text-xs text-white/40">{period}</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/pricing" className="text-sm text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-4">
            詳しいプラン比較を見る →
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-sky-400 tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black">よくある質問</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ── 最終CTA ── */}
      <section className="relative z-10 px-6 py-24 text-center max-w-3xl mx-auto">
        {/* グロー */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-sky-500/10 blur-[80px]" />
        </div>

        <div className="relative">
          <p className="text-xs font-bold text-sky-400 tracking-widest mb-6">GET STARTED</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            来年の確定申告を、
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-teal-400">
              今年と同じ地獄に
            </span>
            <br />
            しないために。
          </h2>
          <p className="text-base text-white/50 mb-10 leading-relaxed">
            今日から書類を撮り始めるだけで、<br />
            来年の申告がまるごと楽になります。
          </p>

          <Link
            href="/upload"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xl shadow-2xl shadow-sky-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-sky-500/70"
          >
            <Receipt className="w-6 h-6" />
            無料で始める
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-xs text-white/25 mt-5">登録不要・クレカ不要・今すぐ使える</p>
        </div>
      </section>

      {/* ── フッター ── */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logo.png" alt="ReceiptSnap" width={100} height={30} className="object-contain brightness-0 invert opacity-50" />
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link href="/terms" className="hover:text-white/60 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">プライバシーポリシー</Link>
            <Link href="/legal" className="hover:text-white/60 transition-colors">特定商取引法</Link>
            <Link href="/" className="hover:text-white/60 transition-colors">アプリを開く</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
