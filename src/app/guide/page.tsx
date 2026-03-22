"use client";

import { MainLayout } from "@/components/MainLayout";
import Link from "next/link";
import {
  Upload,
  FileText,
  BarChart3,
  FileDown,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Camera,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

// ── モックデータ（ダミーデータを活用したビジュアル表現）──
const MOCK_RECEIPTS = [
  { vendor: "Amazon Japan", date: "2025年3月15日", amount: "¥12,800", category: "事務用品費", status: "confirmed", statusLabel: "確認済み", statusColor: "bg-emerald-100 text-emerald-700" },
  { vendor: "新幹線（東京→大阪）", date: "2025年3月10日", amount: "¥14,520", category: "旅費交通費", status: "confirmed", statusLabel: "確認済み", statusColor: "bg-emerald-100 text-emerald-700" },
  { vendor: "Adobe Creative Cloud", date: "2025年3月1日", amount: "¥6,248", category: "ソフトウェア", status: "pending", statusLabel: "確認待ち", statusColor: "bg-amber-100 text-amber-700" },
  { vendor: "〇〇株式会社（売上）", date: "2025年2月28日", amount: "¥350,000", category: "売上", status: "confirmed", statusLabel: "確認済み", statusColor: "bg-emerald-100 text-emerald-700" },
  { vendor: "コーヒーショップ（打合せ）", date: "2025年2月20日", amount: "¥2,400", category: "交際費", status: "confirmed", statusLabel: "確認済み", statusColor: "bg-emerald-100 text-emerald-700" },
];

const MOCK_CATEGORIES = [
  { name: "旅費交通費", amount: "¥42,800", pct: 38, color: "#60a5fa" },
  { name: "外注費",     amount: "¥35,000", pct: 31, color: "#34d399" },
  { name: "ソフトウェア", amount: "¥18,744", pct: 17, color: "#22d3ee" },
  { name: "事務用品費", amount: "¥12,800", pct: 11, color: "#38bdf8" },
  { name: "交際費",     amount: "¥2,400",  pct: 2,  color: "#818cf8" },
];

const steps = [
  {
    step: "01",
    title: "書類をアップロード",
    desc: "領収書・請求書の写真またはPDFをアップロードします。日付・取引先・金額・勘定科目を入力して登録するだけです。",
    icon: Upload,
    color: "from-sky-400 to-blue-600",
    mock: <UploadMock />,
  },
  {
    step: "02",
    title: "証憑一覧で管理",
    desc: "登録した書類は一覧で確認できます。確認済み・確認待ちのステータスを切り替えて、申告準備の進捗を管理しましょう。",
    icon: FileText,
    color: "from-teal-400 to-emerald-600",
    mock: <ReceiptsMock />,
  },
  {
    step: "03",
    title: "レポートで収支を把握",
    desc: "月別の収支グラフと科目別の経費内訳を自動集計。経費率や利益をリアルタイムで確認できます。",
    icon: BarChart3,
    color: "from-blue-400 to-indigo-600",
    mock: <ReportMock />,
  },
  {
    step: "04",
    title: "決算書PDFを出力",
    desc: "確定申告に必要な収支内訳書・青色申告決算書をワンクリックで生成。コンプリートプランでは証憑一覧も添付されます。",
    icon: FileDown,
    color: "from-violet-400 to-purple-600",
    mock: <ExportMock />,
  },
];

function UploadMock() {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-sky-100/60">
        <p className="font-bold text-brand-900 text-sm">書類ファイル</p>
      </div>
      <div className="p-5">
        {/* Fake image preview */}
        <div className="w-full h-28 bg-gradient-to-br from-sky-50 to-teal-50 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-sky-200">
          <div className="text-center">
            <Camera className="w-8 h-8 text-sky-300 mx-auto mb-1" />
            <p className="text-xs text-brand-500/60">領収書.jpg</p>
          </div>
        </div>
        {/* Fake form fields */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-24 h-8 bg-sky-50 rounded-lg border border-sky-200 flex items-center px-3">
              <span className="text-xs text-brand-600">2025-03-15</span>
            </div>
            <div className="flex-1 h-8 bg-sky-50 rounded-lg border border-sky-200 flex items-center px-3">
              <span className="text-xs text-brand-600">Amazon Japan</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 h-8 bg-sky-50 rounded-lg border border-sky-200 flex items-center px-3">
              <span className="text-xs text-brand-600">¥ 12,800</span>
            </div>
            <div className="flex-1 h-8 bg-sky-50 rounded-lg border border-sky-200 flex items-center px-3">
              <span className="text-xs text-brand-600">事務用品費</span>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full py-2.5 gradient-hero rounded-xl text-white text-xs font-bold text-center">
          書類を登録する
        </div>
      </div>
    </div>
  );
}

function ReceiptsMock() {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-sky-100/60 flex items-center justify-between">
        <p className="font-bold text-brand-900 text-sm">証憑一覧</p>
        <span className="text-xs text-brand-500/60">5件</span>
      </div>
      <div className="divide-y divide-sky-50">
        {MOCK_RECEIPTS.slice(0, 3).map((r) => (
          <div key={r.vendor} className="flex items-center gap-3 px-5 py-3">
            <div className="w-9 h-9 rounded-xl gradient-sky flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-900 truncate">{r.vendor}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-brand-500/50">{r.date}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded-full">{r.category}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-brand-700">{r.amount}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${r.statusColor}`}>{r.statusLabel}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg">
          <CheckCircle className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] text-emerald-700 font-medium">確認済み</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg">
          <Clock className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] text-amber-700 font-medium">確認待ち</span>
        </div>
      </div>
    </div>
  );
}

function ReportMock() {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 p-4 border-b border-sky-100/60">
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <p className="text-[10px] text-emerald-600/70">売上</p>
          <p className="text-xs font-bold text-emerald-700">¥420,000</p>
        </div>
        <div className="bg-sky-50 rounded-xl p-3 text-center">
          <TrendingDown className="w-4 h-4 text-sky-500 mx-auto mb-1" />
          <p className="text-[10px] text-sky-600/70">経費</p>
          <p className="text-xs font-bold text-sky-700">¥111,744</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-3 text-center">
          <BarChart3 className="w-4 h-4 text-teal-500 mx-auto mb-1" />
          <p className="text-[10px] text-teal-600/70">利益</p>
          <p className="text-xs font-bold text-teal-700">¥308,256</p>
        </div>
      </div>
      {/* Category bars */}
      <div className="p-4 space-y-2.5">
        {MOCK_CATEGORIES.map(({ name, amount, pct, color }) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-brand-800">{name}</span>
              <span className="text-[10px] font-bold text-brand-700">{amount}</span>
            </div>
            <div className="w-full bg-sky-50 rounded-full h-1.5">
              <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportMock() {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-sky-100/60">
        <p className="font-bold text-brand-900 text-sm">決算書PDF出力</p>
      </div>
      <div className="p-5 space-y-3">
        {/* Plan cards */}
        <div className="border-2 border-sky-400 bg-sky-50/60 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                <FileDown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-900">ベーシック</p>
                <p className="text-[10px] text-brand-500/60">収支報告書・決算書</p>
              </div>
            </div>
            <span className="text-sm font-bold text-brand-900">¥500</span>
          </div>
        </div>
        <div className="border-2 border-teal-400 bg-teal-50/60 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-900">コンプリート</p>
                <p className="text-[10px] text-brand-500/60">決算書＋証憑一覧PDF</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-brand-900">¥1,000</span>
              <p className="text-[10px] text-teal-600 font-semibold">おすすめ</p>
            </div>
          </div>
        </div>
        <div className="w-full py-2.5 gradient-hero rounded-xl text-white text-xs font-bold text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          PDFを出力する
        </div>
      </div>
    </div>
  );
}

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
          フリーランス・個人事業主の確定申告を、4ステップで完結させます。
        </p>
      </div>

      {/* Feature overview */}
      <div
        className="card-glass rounded-2xl p-6 mb-10 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <h2 className="font-bold text-brand-900 mb-4">ReceiptSnapでできること</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: "電子帳簿保存法対応",     desc: "スキャン書類を法的要件を満たした形式で保管。税務調査にも対応できる証憑一覧を自動生成します。", color: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: Sparkles,    title: "確定申告書類を自動生成", desc: "収支内訳書・青色申告決算書をPDFで出力。コンプリートプランでは書類一式をまとめて出力できます。", color: "text-sky-500",     bg: "bg-sky-50" },
            { icon: BarChart3,   title: "収支をリアルタイム把握", desc: "月別グラフ・科目別内訳を自動集計。経費率や利益をいつでも確認でき、節税のヒントにもなります。", color: "text-teal-500",    bg: "bg-teal-50" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className={`${bg} rounded-2xl p-5`}>
              <Icon className={`w-7 h-7 ${color} mb-3`} />
              <p className="font-bold text-brand-900 text-sm mb-2">{title}</p>
              <p className="text-xs text-brand-700/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="space-y-12 mb-10">
        {steps.map(({ step, title, desc, icon: Icon, color, mock }, i) => (
          <div
            key={step}
            className="animate-fade-up"
            style={{ animationDelay: `${160 + i * 80}ms` }}
          >
            {/* Step header */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-500 tracking-widest mb-0.5">STEP {step}</p>
                <h2 className="text-xl font-bold text-brand-900">{title}</h2>
              </div>
            </div>

            {/* Description + Mock layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <p className="text-sm text-brand-700/80 leading-relaxed mb-5">{desc}</p>
                {/* Tips */}
                {i === 0 && (
                  <div className="bg-sky-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-sky-700 mb-2">💡 ポイント</p>
                    {[
                      "JPG・PNG・PDFに対応しています",
                      "勘定科目は後から変更できます",
                      "売上は「売上」科目で登録してください",
                      "メモ欄に取引の詳細を記録しておくと便利です",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-sky-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
                {i === 1 && (
                  <div className="bg-teal-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-teal-700 mb-2">💡 ステータスの使い方</p>
                    {[
                      "「確認済み」：内容を確認して申告に使う書類",
                      "「確認待ち」：まだ内容を確認していない書類",
                      "「要修正」：金額・科目を修正が必要な書類",
                      "科目・金額はいつでも編集できます",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-teal-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
                {i === 2 && (
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-blue-700 mb-2">💡 レポートの活用法</p>
                    {[
                      "年度を切り替えて過去の収支も確認できます",
                      "経費率が高い科目を把握して節税対策に",
                      "月別グラフで売上の波を把握しましょう",
                      "レポート画面からPDF出力に直接進めます",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-blue-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
                {i === 3 && (
                  <div className="bg-violet-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-violet-700 mb-2">💡 プランの選び方</p>
                    {[
                      "ベーシック：数字だけ確認したい方向け",
                      "コンプリート：税務調査対策・税理士提出用",
                      "コンプリートは証憑を日付順に自動整理",
                      "年度ごとに購入するシーズン制です",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-violet-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mock UI */}
              <div className="hover-lift transition-all duration-300">
                {mock}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div
        className="card-glass rounded-2xl p-6 mb-8 animate-fade-up"
        style={{ animationDelay: "480ms" }}
      >
        <h2 className="font-bold text-brand-900 text-lg mb-5">よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "データはどこに保存されますか？",
              a: "現在はお使いのブラウザ（localStorage）に保存されます。ブラウザのデータを削除すると消えますのでご注意ください。クラウド保存機能は近日公開予定です。",
            },
            {
              q: "対応している書類の種類は？",
              a: "領収書・レシート・請求書・契約書など、経費・売上に関わるすべての書類に対応しています。JPG・PNG・PDFファイルをアップロードできます。",
            },
            {
              q: "決済はいつ対応しますか？",
              a: "現在はデモ版として決済なしでPDFをダウンロードできます。正式な決済機能は近日公開予定です。",
            },
            {
              q: "青色申告に対応していますか？",
              a: "はい。青色申告決算書（一般用）のPDF出力に対応しています。コンプリートプランでは証憑一覧も添付されます。",
            },
            {
              q: "スマートフォンでも使えますか？",
              a: "はい。モバイル対応のレスポンシブデザインです。カメラで撮影した領収書をそのままアップロードできます。",
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="border-b border-sky-100 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-bold text-brand-900 mb-1.5">Q. {q}</p>
              <p className="text-sm text-brand-700/70 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="gradient-hero rounded-2xl p-7 text-white text-center hover-lift shadow-lg animate-fade-up"
        style={{ animationDelay: "560ms" }}
      >
        <h2 className="text-2xl font-bold mb-2">さっそく始めましょう</h2>
        <p className="text-sky-200 text-sm mb-6">最初の書類をアップロードして、確定申告の準備を始めてください。</p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-sky-700 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors shadow-md"
        >
          <Upload className="w-5 h-5" />
          書類をアップロードする
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </MainLayout>
  );
}
