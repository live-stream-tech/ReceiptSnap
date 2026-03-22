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
  Smartphone,
  Laptop,
  ShieldCheck,
} from "lucide-react";

// ─── サンプルデータ（作られたデータの見本用）────────────────
const SAMPLE_RECEIPTS = [
  { date: "2025-01-10", vendor: "〇〇株式会社",         amount: 350000, category: "売上",       type: "income"  },
  { date: "2025-01-15", vendor: "Amazon Japan",         amount: 12800,  category: "消耗品費",   type: "expense" },
  { date: "2025-01-20", vendor: "JR東海（新幹線）",     amount: 14520,  category: "旅費交通費", type: "expense" },
  { date: "2025-02-05", vendor: "△△デザイン事務所",    amount: 280000, category: "売上",       type: "income"  },
  { date: "2025-02-12", vendor: "Adobe Creative Cloud", amount: 6248,   category: "通信費",     type: "expense" },
  { date: "2025-02-18", vendor: "カフェ（打合せ）",     amount: 2400,   category: "接待交際費", type: "expense" },
  { date: "2025-03-01", vendor: "□□株式会社",          amount: 420000, category: "売上",       type: "income"  },
  { date: "2025-03-08", vendor: "レンタルオフィス",     amount: 22000,  category: "地代家賃",   type: "expense" },
  { date: "2025-03-15", vendor: "NTTドコモ",            amount: 3800,   category: "通信費",     type: "expense" },
  { date: "2025-03-20", vendor: "〇〇株式会社（外注）", amount: 55000,  category: "外注工賃",   type: "expense" },
];

const totalIncome  = SAMPLE_RECEIPTS.filter(r => r.type === "income").reduce((s, r) => s + r.amount, 0);
const totalExpense = SAMPLE_RECEIPTS.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);
const profit       = totalIncome - totalExpense;

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

const fmt    = (n: number) => `¥${n.toLocaleString()}`;
const fmtNum = (n: number) => n > 0 ? n.toLocaleString() : "";

// ─── STEPデータ（便利シーンを説明に統合）────────────────────
const STEPS = [
  {
    num: "1",
    title: "書類をアップロード",
    lead: "撮って送るだけ。それだけでOK。",
    desc: "領収書・請求書・スクリーンショット・PDFに対応。外出先でレシートを受け取ったらその場でスマホのカメラで撮影してアップロード。ネットショッピングの注文確認メールはスクリーンショットのまま送るだけ。紙を持ち帰る必要はありません。",
    scenes: [
      { icon: Camera,    text: "レシートをスマホで撮影" },
      { icon: Monitor,   text: "注文確認メールをスクショ" },
      { icon: FileDown,  text: "請求書PDFをそのまま" },
      { icon: Laptop,    text: "PCからまとめてアップロード" },
    ],
    icon: Upload,
    color: "from-sky-400 to-blue-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    numColor: "text-sky-300",
    accentColor: "text-sky-600",
  },
  {
    num: "2",
    title: "情報を確認・登録",
    lead: "足りないところだけ入力。あとは自動。",
    desc: "日付・取引先・金額・勘定科目を確認して登録。ステータス管理で「確認待ち」「登録済み」を一目で把握。帰宅後にPCの大きな画面でまとめて整理することもできます。スマホで登録したデータはPCでもすぐ確認できます。",
    scenes: [
      { icon: Smartphone, text: "スマホで登録" },
      { icon: Laptop,     text: "PCで一覧確認・編集" },
      { icon: ShieldCheck, text: "電子帳簿保存法対応形式で保存" },
    ],
    icon: FileText,
    color: "from-teal-400 to-emerald-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    numColor: "text-teal-300",
    accentColor: "text-teal-600",
  },
  {
    num: "3",
    title: "収支をリアルタイム確認",
    lead: "いつでも今の状態がわかる。",
    desc: "月別グラフ・科目別内訳が自動で集計されます。確定申告の直前に1年分をまとめて整理するのは大変。日々少しずつ登録しておけば、3月に慌てる必要がありません。経費率や利益もいつでも把握できます。",
    scenes: [
      { icon: BarChart3,  text: "月別収支グラフ" },
      { icon: FileText,   text: "科目別自動集計" },
    ],
    icon: BarChart3,
    color: "from-blue-400 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    numColor: "text-blue-300",
    accentColor: "text-blue-600",
  },
  {
    num: "4",
    title: "決算書PDFをワンクリック出力",
    lead: "国税庁フォーマット準拠の書類が自動生成。",
    desc: "登録した証憑データをもとに、収支内訳書（国税庁・一般用）を自動生成します。証憑一覧も自動添付。税理士に渡す資料としてもそのまま使えます。",
    scenes: [
      { icon: FileDown,   text: "収支内訳書（国税庁様式）" },
      { icon: FileText,   text: "証憑一覧を自動添付" },
    ],
    icon: FileDown,
    color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    numColor: "text-violet-300",
    accentColor: "text-violet-600",
  },
];

// ─── 国税庁フォーマット収支内訳書コンポーネント ──────────────
function NTAShushiNaiyakusho() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-[10px] shadow-sm">
      {/* ヘッダー */}
      <div className="bg-slate-800 text-white px-4 py-3">
        <div className="text-center font-bold text-sm mb-2">収支内訳書（一般用）</div>
        <div className="grid grid-cols-2 gap-x-4 text-[10px] text-slate-300">
          <div><span className="text-slate-400">住所：</span>東京都渋谷区〇〇1-2-3</div>
          <div><span className="text-slate-400">氏名：</span>山田 太郎</div>
          <div><span className="text-slate-400">業種名：</span>デザイン業</div>
          <div><span className="text-slate-400">屋号：</span>山田デザイン事務所</div>
        </div>
      </div>
      {/* 収入金額 */}
      <div className="border-b border-slate-200">
        <div className="bg-slate-700 text-white text-[10px] font-bold px-3 py-1">収入金額</div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-1.5 text-slate-600 bg-slate-50 border-r border-slate-200 w-44">① 売上（収入）金額</td>
              <td className="px-3 py-1.5 text-right font-bold text-emerald-700">{fmtNum(totalIncome)}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-1.5 text-slate-500 bg-slate-50 border-r border-slate-200">② 家事消費・事業消費</td>
              <td className="px-3 py-1.5 text-right text-slate-400">—</td>
            </tr>
            <tr className="bg-sky-50">
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-sky-100 border-r border-slate-200">④ 収入金額計</td>
              <td className="px-3 py-1.5 text-right font-bold text-slate-900">{fmtNum(totalIncome)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 経費 */}
      <div className="border-b border-slate-200">
        <div className="bg-slate-700 text-white text-[10px] font-bold px-3 py-1">経費</div>
        <table className="w-full">
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
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-sky-100 border-r border-slate-200">経費計</td>
              <td className="px-3 py-1.5 text-right font-bold text-slate-900">{fmtNum(totalExpense)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 所得金額 */}
      <div>
        <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1">所得金額</div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-1.5 text-slate-600 bg-slate-50 border-r border-slate-200">専従者控除前の所得金額</td>
              <td className="px-3 py-1.5 text-right font-semibold text-slate-800">{fmtNum(profit)}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-1.5 text-slate-500 bg-slate-50 border-r border-slate-200">専従者控除額</td>
              <td className="px-3 py-1.5 text-right text-slate-400">—</td>
            </tr>
            <tr className="bg-emerald-50">
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-emerald-100 border-r border-slate-200">事業所得の金額</td>
              <td className="px-3 py-1.5 text-right font-bold text-emerald-700">{fmtNum(profit)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 証憑一覧 */}
      <div className="border-t-2 border-slate-300">
        <div className="bg-slate-600 text-white text-[10px] font-bold px-3 py-1">証憑一覧（添付）</div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="px-3 py-1 text-left text-slate-500 font-medium">日付</th>
              <th className="px-3 py-1 text-left text-slate-500 font-medium">取引先</th>
              <th className="px-3 py-1 text-left text-slate-500 font-medium">科目</th>
              <th className="px-3 py-1 text-right text-slate-500 font-medium">金額</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_RECEIPTS.map((r, i) => (
              <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                <td className="px-3 py-1 text-slate-600">{r.date}</td>
                <td className="px-3 py-1 text-slate-700">{r.vendor}</td>
                <td className="px-3 py-1">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${r.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                    {r.category}
                  </span>
                </td>
                <td className={`px-3 py-1 text-right font-semibold ${r.type === "income" ? "text-emerald-700" : "text-slate-800"}`}>
                  {fmt(r.amount)}
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

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <div className="mb-14 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-sky-500 font-bold mb-4">
          <BookOpen className="w-4 h-4" />
          <span>使い方ガイド</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight mb-4">
          撮って、登録して、PDF出力。<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">それだけ。</span>
        </h1>
        <p className="text-lg text-brand-600/70 leading-relaxed max-w-xl">
          写真・スクリーンショット・PDFをアップロードするだけ。あとは自動で集計して、国税庁フォーマットの決算書PDFを出力します。
        </p>
        {/* 対応形式バッジ */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { icon: Camera,   label: "写真（JPG / PNG）",  color: "text-sky-600",    bg: "bg-sky-50",    border: "border-sky-200" },
            { icon: Monitor,  label: "スクリーンショット", color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-200" },
            { icon: FileDown, label: "PDF",               color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
          ].map(({ icon: Icon, label, color, bg, border }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2 ${bg} rounded-xl border ${border}`}>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className={`text-sm font-bold ${color}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          4 STEPS
      ══════════════════════════════════════════════════════ */}
      <div className="mb-16">
        {STEPS.map(({ num, title, lead, desc, scenes, icon: Icon, color, bg, border, numColor, accentColor }, i) => (
          <div key={num} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`${bg} border-2 ${border} rounded-3xl p-7 md:p-10`}>
              {/* STEP番号 + タイトル */}
              <div className="flex items-start gap-4 mb-5">
                <span className={`text-9xl font-black leading-none ${numColor} select-none flex-shrink-0 -mt-2`}>{num}</span>
                <div className="pt-3">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-900">{title}</h2>
                  </div>
                  <p className={`text-base font-bold ${accentColor} mb-3`}>{lead}</p>
                  <p className="text-sm text-brand-700/70 leading-relaxed">{desc}</p>
                </div>
              </div>
              {/* シーンバッジ */}
              <div className="flex flex-wrap gap-2 ml-0 md:ml-32">
                {scenes.map(({ icon: SIcon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 rounded-lg border border-white/80 shadow-sm">
                    <SIcon className={`w-3.5 h-3.5 ${accentColor}`} />
                    <span className="text-xs font-semibold text-brand-800">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 矢印 */}
            {i < STEPS.length - 1 && (
              <div className="flex justify-center py-4">
                <ChevronDown className="w-12 h-12 text-brand-300" strokeWidth={1.5} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          作られたデータの見本
      ══════════════════════════════════════════════════════ */}
      <div className="mb-14 animate-fade-up" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-violet-500 tracking-widest">SAMPLE OUTPUT</p>
            <h2 className="text-2xl font-black text-brand-900">作られたデータの見本</h2>
          </div>
        </div>
        <p className="text-sm text-brand-600/60 mb-6 ml-0">
          以下はReceiptSnapで書類を登録・管理した結果、自動で生成されるデータのサンプルです。
        </p>

        {/* 証憑一覧サンプル */}
        <div className="card-glass rounded-2xl p-5 mb-5">
          <p className="text-xs font-bold text-brand-500/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            登録された証憑一覧
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left text-slate-500 font-medium">日付</th>
                  <th className="pb-2 text-left text-slate-500 font-medium">取引先</th>
                  <th className="pb-2 text-left text-slate-500 font-medium">科目</th>
                  <th className="pb-2 text-right text-slate-500 font-medium">金額</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_RECEIPTS.slice(0, 6).map((r, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{r.date}</td>
                    <td className="py-2 text-slate-800 font-medium">{r.vendor}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                        {r.category}
                      </span>
                    </td>
                    <td className={`py-2 text-right font-bold ${r.type === "income" ? "text-emerald-700" : "text-slate-800"}`}>
                      {fmt(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-400 mt-2 text-right">…他 {SAMPLE_RECEIPTS.length - 6} 件</p>
          </div>
        </div>

        {/* 収支サマリー */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "売上合計",   value: fmt(totalIncome),  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "経費合計",   value: fmt(totalExpense), color: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-100" },
            { label: "事業所得",   value: fmt(profit),       color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-100" },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-4 text-center`}>
              <p className="text-[10px] text-slate-500 mb-1">{label}</p>
              <p className={`text-base font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* 出力PDFプレビュー */}
        <div className="card-glass rounded-2xl p-5">
          <p className="text-xs font-bold text-brand-500/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FileDown className="w-3.5 h-3.5" />
            出力されるPDF（収支内訳書・国税庁様式）
          </p>
          <NTAShushiNaiyakusho />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          スマホインストール QRコード
      ══════════════════════════════════════════════════════ */}
      <div className="card-glass rounded-2xl p-6 mb-8 animate-fade-up" style={{ animationDelay: "500ms" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-sky-500 tracking-widest mb-0.5">INSTALL ON MOBILE</p>
            <h2 className="text-xl font-black text-brand-900">スマホにインストールする</h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
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
            <p className="text-[11px] text-brand-500/60 text-center">receipt-snap-nine.vercel.app</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-brand-700/70 mb-4 leading-relaxed">
              QRコードをスマホのカメラで読み取ると、ブラウザで開きます。そのままホーム画面に追加するとアプリのように起動できます。
            </p>
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-white rounded-full"> iOS</span>
                  <span className="text-xs font-semibold text-slate-700">Safariで開く</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1">
                  <li className="flex gap-2"><span className="text-sky-500 font-bold">1.</span> 画面下部の共有ボタン（↑）をタップ</li>
                  <li className="flex gap-2"><span className="text-sky-500 font-bold">2.</span>「ホーム画面に追加」をタップ</li>
                  <li className="flex gap-2"><span className="text-sky-500 font-bold">3.</span>「追加」をタップして完了</li>
                </ol>
              </div>
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

      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <div className="gradient-hero rounded-2xl p-8 text-white text-center hover-lift shadow-lg animate-fade-up" style={{ animationDelay: "600ms" }}>
        <h2 className="text-2xl font-black mb-2">さっそく始めましょう</h2>
        <p className="text-sky-200 text-sm mb-6">最初の書類をアップロードして、確定申告の準備を始めてください。</p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-sky-700 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors shadow-md"
        >
          <Upload className="w-4 h-4" />
          書類をアップロードする
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </MainLayout>
  );
}
