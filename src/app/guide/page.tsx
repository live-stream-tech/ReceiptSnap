"use client";

import { MainLayout } from "@/components/MainLayout";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Upload,
  FileText,
  BarChart3,
  FileDown,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronDown,
  Camera,
  Monitor,
  Receipt,
  Smartphone,
  Laptop,
  Wifi,
  Zap,
  Clock,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";

// ─── サンプルデータ ──────────────────────────────────────────
const SAMPLE_RECEIPTS = [
  { date: "2025-01-10", vendor: "〇〇株式会社",       amount: 350000, category: "売上",       type: "income"  },
  { date: "2025-01-15", vendor: "Amazon Japan",       amount: 12800,  category: "消耗品費",   type: "expense" },
  { date: "2025-01-20", vendor: "JR東海（新幹線）",   amount: 14520,  category: "旅費交通費", type: "expense" },
  { date: "2025-02-05", vendor: "△△デザイン事務所",  amount: 280000, category: "売上",       type: "income"  },
  { date: "2025-02-12", vendor: "Adobe CC",           amount: 6248,   category: "通信費",     type: "expense" },
  { date: "2025-02-18", vendor: "カフェ（打合せ）",   amount: 2400,   category: "接待交際費", type: "expense" },
  { date: "2025-03-01", vendor: "□□株式会社",        amount: 420000, category: "売上",       type: "income"  },
  { date: "2025-03-08", vendor: "レンタルオフィス",   amount: 22000,  category: "地代家賃",   type: "expense" },
  { date: "2025-03-15", vendor: "NTTドコモ",          amount: 3800,   category: "通信費",     type: "expense" },
  { date: "2025-03-20", vendor: "〇〇株式会社（外注）", amount: 55000, category: "外注工賃",  type: "expense" },
];

const totalIncome  = SAMPLE_RECEIPTS.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0);
const totalExpense = SAMPLE_RECEIPTS.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);
const profit       = totalIncome - totalExpense;

// 国税庁フォーマットの経費科目（一般用）
const NTA_CATEGORIES = [
  "租税公課", "荷造運賃", "水道光熱費", "旅費交通費", "通信費",
  "広告宣伝費", "接待交際費", "損害保険料", "修繕費", "消耗品費",
  "減価償却費", "福利厚生費", "給料賃金", "外注工賃", "利子割引料",
  "地代家賃", "貸倒金", "雑費",
];

const categoryTotals: Record<string, number> = {};
SAMPLE_RECEIPTS.filter(r => r.type === "expense").forEach(r => {
  categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount;
});

const fmt = (n: number) => `¥${n.toLocaleString()}`;
const fmtNum = (n: number) => n > 0 ? n.toLocaleString() : "";

// ─── ステップ定義 ────────────────────────────────────────────
const STEPS = [
  {
    num: "1", title: "書類をアップロード",
    desc: "領収書・請求書の写真、スクリーンショット、PDFをアップロードします。",
    icon: Upload, color: "from-sky-400 to-blue-600",
    bg: "bg-sky-50", border: "border-sky-200", numColor: "text-sky-400",
  },
  {
    num: "2", title: "情報を入力・確認",
    desc: "日付・取引先・金額・勘定科目を入力して登録。ステータスで確認状況を管理できます。",
    icon: FileText, color: "from-teal-400 to-emerald-600",
    bg: "bg-teal-50", border: "border-teal-200", numColor: "text-teal-400",
  },
  {
    num: "3", title: "収支をリアルタイム確認",
    desc: "月別グラフ・科目別内訳が自動集計されます。経費率や利益をいつでも把握できます。",
    icon: BarChart3, color: "from-blue-400 to-indigo-600",
    bg: "bg-blue-50", border: "border-blue-200", numColor: "text-blue-400",
  },
  {
    num: "4", title: "決算書PDFを出力",
    desc: "確定申告に必要な決算書をワンクリックで生成。証憑一覧も自動添付されます。",
    icon: FileDown, color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50", border: "border-violet-200", numColor: "text-violet-400",
  },
];

// ─── 便利さ訴求データ ────────────────────────────────────────
const CONVENIENCES = [
  {
    icon: Smartphone,
    title: "スマホで撮ってすぐ登録",
    desc: "外出先でレシートを受け取ったら、その場でスマホのカメラで撮影してアップロード。財布の中で紙がぐちゃぐちゃになる前に記録できます。",
    color: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
    tag: "スマホ対応",
    tagColor: "bg-sky-100 text-sky-700",
  },
  {
    icon: Laptop,
    title: "PCでまとめて整理",
    desc: "帰宅後はPCのブラウザで一覧を確認・編集。大きな画面で月ごとの収支をチェックしながら、漏れがないか確認できます。",
    color: "from-teal-400 to-emerald-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
    tag: "PC対応",
    tagColor: "bg-teal-100 text-teal-700",
  },
  {
    icon: Monitor,
    title: "スクリーンショットもそのままOK",
    desc: "ネットショッピングの注文確認メールや、オンラインサービスの請求画面をスクリーンショットで保存してアップロードするだけ。印刷不要です。",
    color: "from-violet-400 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    tag: "スクショ対応",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    icon: Wifi,
    title: "どこからでもアクセス",
    desc: "データはクラウドに保存されるため、スマホで登録した書類をPCで確認、自宅でも外出先でも同じデータにアクセスできます。",
    color: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    tag: "クラウド保存",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: Clock,
    title: "確定申告の直前に焦らない",
    desc: "1年分の書類を3月にまとめて整理するのは大変です。ReceiptSnapなら日々少しずつ登録しておけば、申告期間に慌てる必要がありません。",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    tag: "時短",
    tagColor: "bg-amber-100 text-amber-700",
  },
  {
    icon: ShieldCheck,
    title: "電子帳簿保存法にも対応",
    desc: "2024年から義務化された電子帳簿保存法。紙の領収書を捨てられる要件を満たした形式で保存するため、紙の管理から解放されます。",
    color: "from-emerald-400 to-green-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    tag: "電帳法対応",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
];

// ─── サンプルレシートコンポーネント ─────────────────────────
function SampleReceipt() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 max-w-xs mx-auto">
      {/* レシートヘッダー */}
      <div className="bg-slate-800 px-4 py-3 text-center">
        <p className="text-white font-bold text-sm tracking-widest">〇〇コーヒーショップ</p>
        <p className="text-slate-400 text-[10px] mt-0.5">東京都渋谷区〇〇1-2-3</p>
      </div>
      {/* レシート本体 */}
      <div className="px-5 py-4 font-mono text-xs">
        <p className="text-slate-500 text-center mb-3 text-[10px]">2025年03月18日（火）14:32</p>
        <div className="space-y-1.5 mb-3 pb-3 border-b border-dashed border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-700">ブレンドコーヒー</span>
            <span className="text-slate-800 font-semibold">¥550</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-700">カフェラテ</span>
            <span className="text-slate-800 font-semibold">¥660</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-700">チーズケーキ</span>
            <span className="text-slate-800 font-semibold">¥580</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-700">アメリカーノ</span>
            <span className="text-slate-800 font-semibold">¥610</span>
          </div>
        </div>
        <div className="space-y-1 mb-3 pb-3 border-b border-dashed border-slate-200">
          <div className="flex justify-between text-slate-500">
            <span>小計</span>
            <span>¥2,400</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>消費税（10%）</span>
            <span>¥218</span>
          </div>
        </div>
        <div className="flex justify-between font-bold text-slate-900 text-sm">
          <span>合計</span>
          <span>¥2,400</span>
        </div>
        <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-0.5 text-slate-400 text-[10px]">
          <div className="flex justify-between">
            <span>お預かり</span>
            <span>¥3,000</span>
          </div>
          <div className="flex justify-between">
            <span>お釣り</span>
            <span>¥600</span>
          </div>
        </div>
        <p className="text-center text-slate-400 text-[10px] mt-4">ありがとうございました</p>
        <p className="text-center text-slate-300 text-[9px] mt-1">登録番号：T1234567890123</p>
      </div>
      {/* 科目タグ */}
      <div className="bg-sky-50 px-4 py-2.5 flex items-center justify-between border-t border-sky-100">
        <div className="flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-sky-500" />
          <span className="text-[11px] font-bold text-sky-700">接待交際費</span>
        </div>
        <span className="text-[11px] font-bold text-slate-700">¥2,400</span>
      </div>
    </div>
  );
}

// ─── 国税庁フォーマット準拠の収支内訳書 ─────────────────────
function NTAShushiNaiyakusho() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg text-[11px] font-sans">
      {/* PDFウィンドウバー */}
      <div className="bg-slate-700 px-4 py-2.5 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-slate-300 text-[10px]">収支内訳書（一般用）_2025年度.pdf</span>
      </div>

      <div className="p-5 bg-white">
        {/* 書類タイトル */}
        <div className="text-center mb-4 pb-3 border-b-2 border-slate-800">
          <p className="text-[10px] text-slate-500 mb-0.5">令和7年分</p>
          <h3 className="text-base font-bold text-slate-900 tracking-widest">収支内訳書（一般用）</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">※ 国税庁様式に基づくサンプルです</p>
        </div>

        {/* 事業者情報 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-[10px]">
          <div className="flex gap-2">
            <span className="text-slate-500 w-16 flex-shrink-0">住所</span>
            <span className="text-slate-700 border-b border-slate-200 flex-1">東京都渋谷区〇〇1-2-3</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-16 flex-shrink-0">氏名</span>
            <span className="text-slate-700 border-b border-slate-200 flex-1">山田 太郎</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-16 flex-shrink-0">業種名</span>
            <span className="text-slate-700 border-b border-slate-200 flex-1">フリーランス（ITコンサルタント）</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-16 flex-shrink-0">屋号</span>
            <span className="text-slate-700 border-b border-slate-200 flex-1">Yamada Consulting</span>
          </div>
        </div>

        {/* 収入金額 */}
        <div className="mb-3">
          <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-t-lg">
            収入金額
          </div>
          <table className="w-full border border-slate-300 border-t-0 text-[10px]">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 text-slate-600 bg-slate-50 border-r border-slate-200 w-48">
                  ① 売上（収入）金額
                </td>
                <td className="px-3 py-1.5 text-right font-bold text-emerald-700">
                  {fmtNum(totalIncome)}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 text-slate-600 bg-slate-50 border-r border-slate-200">
                  ② 家事消費・事業消費
                </td>
                <td className="px-3 py-1.5 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-sky-50">
                <td className="px-3 py-1.5 font-bold text-slate-700 bg-sky-100 border-r border-slate-200">
                  ④ 収入金額計（①+②+③）
                </td>
                <td className="px-3 py-1.5 text-right font-bold text-slate-900">
                  {fmtNum(totalIncome)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 経費 */}
        <div className="mb-3">
          <div className="bg-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-t-lg">
            経費
          </div>
          <table className="w-full border border-slate-300 border-t-0 text-[10px]">
            <tbody>
              {NTA_CATEGORIES.map((cat, i) => {
                const amount = categoryTotals[cat] || 0;
                return (
                  <tr key={cat} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-3 py-1 text-slate-600 border-r border-slate-200 w-36">{cat}</td>
                    <td className={`px-3 py-1 text-right ${amount > 0 ? "font-semibold text-slate-800" : "text-slate-300"}`}>
                      {amount > 0 ? fmtNum(amount) : "—"}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-sky-50 border-t-2 border-slate-300">
                <td className="px-3 py-1.5 font-bold text-slate-700 bg-sky-100 border-r border-slate-200">
                  経費計
                </td>
                <td className="px-3 py-1.5 text-right font-bold text-slate-900">
                  {fmtNum(totalExpense)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 所得金額 */}
        <div>
          <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-t-lg">
            所得金額
          </div>
          <table className="w-full border border-slate-300 border-t-0 text-[10px]">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 text-slate-600 bg-slate-50 border-r border-slate-200">
                  専従者控除前の所得金額
                </td>
                <td className="px-3 py-1.5 text-right font-semibold text-slate-800">
                  {fmtNum(profit)}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 text-slate-600 bg-slate-50 border-r border-slate-200">
                  専従者控除額
                </td>
                <td className="px-3 py-1.5 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="px-3 py-2 font-bold text-slate-800 bg-emerald-100 border-r border-slate-200 text-[11px]">
                  所得金額（事業所得）
                </td>
                <td className="px-3 py-2 text-right font-bold text-emerald-700 text-[13px]">
                  {fmtNum(profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[9px] text-slate-400 mt-3 text-right">
          ※ 電子帳簿保存法に基づき保管　　単位：円
        </p>
      </div>

      {/* 証憑一覧セクション */}
      <div className="border-t-2 border-dashed border-slate-200 p-5 bg-slate-50/50">
        <p className="text-[10px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          添付：証憑一覧（コンプリートプランのみ）
        </p>
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left px-2 py-1 text-slate-500 font-semibold border border-slate-200">日付</th>
              <th className="text-left px-2 py-1 text-slate-500 font-semibold border border-slate-200">取引先</th>
              <th className="text-left px-2 py-1 text-slate-500 font-semibold border border-slate-200">科目</th>
              <th className="text-right px-2 py-1 text-slate-500 font-semibold border border-slate-200">金額</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_RECEIPTS.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-2 py-1 text-slate-600 border border-slate-100">{r.date}</td>
                <td className="px-2 py-1 text-slate-700 border border-slate-100">{r.vendor}</td>
                <td className="px-2 py-1 border border-slate-100">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${r.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                    {r.category}
                  </span>
                </td>
                <td className={`px-2 py-1 text-right font-semibold border border-slate-100 ${r.type === "income" ? "text-emerald-700" : "text-slate-700"}`}>
                  {r.type === "income" ? "+" : ""}{fmt(r.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── メインページ ────────────────────────────────────────────
export default function GuidePage() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-sky-500 font-medium mb-2">
          <BookOpen className="w-4 h-4" />
          <span>使い方ガイド</span>
        </div>
        <h1 className="text-3xl font-bold text-brand-900 tracking-wide">ReceiptSnapの使い方</h1>
        <p className="text-brand-600/60 mt-2 text-sm leading-relaxed">
          写真・スクリーンショット・PDFをアップロードするだけ。確定申告の準備が4ステップで完結します。
        </p>
      </div>

      {/* 対応ファイル形式 */}
      <div className="card-glass rounded-2xl p-5 mb-10 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <p className="text-xs font-bold text-brand-500/60 uppercase tracking-widest mb-3">対応ファイル形式</p>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Camera,    label: "写真（JPG / PNG）",  color: "text-sky-500",    bg: "bg-sky-50" },
            { icon: Monitor,   label: "スクリーンショット", color: "text-teal-500",   bg: "bg-teal-50" },
            { icon: FileDown,  label: "PDF",               color: "text-violet-500", bg: "bg-violet-50" },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2.5 ${bg} rounded-xl border border-white/60`}>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs font-medium text-brand-800">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-14">
        {STEPS.map(({ num, title, desc, icon: Icon, color, bg, border, numColor }, i) => (
          <div key={num} className="animate-fade-up" style={{ animationDelay: `${120 + i * 80}ms` }}>
            <div className={`${bg} border-2 ${border} rounded-3xl p-6 md:p-8`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className={`text-8xl font-black leading-none ${numColor} opacity-15 select-none block`}>{num}</span>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-900">{title}</h2>
                  </div>
                  <p className="text-sm text-brand-700/70 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex justify-center py-3">
                <ChevronDown className="w-9 h-9 text-brand-300" strokeWidth={1.5} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── 便利さ訴求セクション ───────────────────────── */}
      <div className="mb-14 animate-fade-up" style={{ animationDelay: "480ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-sky-500 tracking-widest mb-0.5">WHY RECEIPTSNAP</p>
            <h2 className="text-xl font-bold text-brand-900">こんなときに便利</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONVENIENCES.map(({ icon: Icon, title, desc, color, bg, border, tag, tagColor }, i) => (
            <div
              key={title}
              className={`${bg} border ${border} rounded-2xl p-5 hover-lift`}
              style={{ animationDelay: `${500 + i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-brand-900">{title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tagColor}`}>{tag}</span>
                  </div>
                  <p className="text-xs text-brand-700/70 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 仕上がりプレビューセクション ───────────────── */}
      <div className="animate-fade-up" style={{ animationDelay: "700ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-violet-500 tracking-widest mb-0.5">STEP 4 の仕上がりイメージ</p>
            <h2 className="text-xl font-bold text-brand-900">出力されるPDFの見本</h2>
          </div>
        </div>

        {/* サンプルバッジ */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
            <Sparkles className="w-3 h-3" />
            これはサンプルデータによるプレビューです。実際の入力データで生成されます。
          </span>
        </div>

        {/* 2カラム：レシートサンプル ＋ 収支内訳書 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 左：レシートサンプル */}
          <div>
            <p className="text-xs font-bold text-brand-600/60 mb-3 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              登録する書類の例（レシート）
            </p>
            <SampleReceipt />
          </div>

          {/* 右：収支内訳書 */}
          <div>
            <p className="text-xs font-bold text-brand-600/60 mb-3 flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              出力されるPDF（収支内訳書・国税庁様式）
            </p>
            <NTAShushiNaiyakusho />
          </div>
        </div>

        {/* ─── スマホインストール QRコード ───────────────── */}
        <div className="card-glass rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-500 tracking-widest mb-0.5">INSTALL ON MOBILE</p>
              <h2 className="text-xl font-bold text-brand-900">スマホにインストールする</h2>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* QRコード */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
                <QRCodeSVG
                  value="https://receipt-snap-nine.vercel.app"
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#0ea5e9"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[11px] text-brand-500/60 text-center">
                receipt-snap-nine.vercel.app
              </p>
            </div>
            {/* 手順 */}
            <div className="flex-1">
              <p className="text-sm text-brand-700/70 mb-4 leading-relaxed">
                QRコードをスマホのカメラで読み取ると、ブラウザで開きます。そのままホーム画面に追加するとアプリのように起動できます。
              </p>
              <div className="space-y-3">
                {/* iOS */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-white rounded-full"> iOS</span>
                    <span className="text-xs font-semibold text-slate-700">Safariで開く</span>
                  </div>
                  <ol className="text-xs text-slate-600 space-y-1">
                    <li className="flex gap-2"><span className="text-sky-500 font-bold">1.</span> 画面下部の共有ボタン（↑）をタップ</li>
                    <li className="flex gap-2"><span className="text-sky-500 font-bold">2.</span>「ホーム画面に追加」をタップ</li>
                    <li className="flex gap-2"><span className="text-sky-500 font-bold">3.</span>「追加」をタップして完了</li>
                  </ol>
                </div>
                {/* Android */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">Android</span>
                    <span className="text-xs font-semibold text-slate-700">Chromeで開く</span>
                  </div>
                  <ol className="text-xs text-slate-600 space-y-1">
                    <li className="flex gap-2"><span className="text-emerald-500 font-bold">1.</span> 右上のメニュー（⋮）をタップ</li>
                    <li className="flex gap-2"><span className="text-emerald-500 font-bold">2.</span>「ホーム画面に追加」をタップ</li>
                    <li className="flex gap-2"><span className="text-emerald-500 font-bold">3.</span>「追加」をタップして完了</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="gradient-hero rounded-2xl p-7 text-white text-center hover-lift shadow-lg">
          <h2 className="text-xl font-bold mb-1">さっそく始めましょう</h2>
          <p className="text-sky-200 text-sm mb-5">最初の書類をアップロードして、確定申告の準備を始めてください。</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-sky-700 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors shadow-md"
          >
            <Upload className="w-4 h-4" />
            書類をアップロードする
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
