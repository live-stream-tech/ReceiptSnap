"use client";

import { MainLayout } from "@/components/MainLayout";
import {
  Check,
  X,
  CreditCard,
  Shield,
  RefreshCw,
  HelpCircle,
  Zap,
  Cloud,
  FileDown,
  Sparkles,
} from "lucide-react";

// ─── プランデータ ────────────────────────────────────────────
const PLANS = [
  {
    id: "free",
    name: "無料プラン",
    price: null,
    priceLabel: "¥0",
    period: "ずっと無料",
    description: "まずは試してみたい方に。基本的な書類管理が使えます。",
    icon: Zap,
    color: "from-slate-400 to-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    badge: null,
    features: [
      { label: "書類アップロード（写真・スクショ・PDF）", included: true },
      { label: "証憑一覧・検索・フィルター", included: true },
      { label: "収支レポート（月別グラフ・科目別集計）", included: true },
      { label: "CSVエクスポート", included: true },
      { label: "PDF出力（収支内訳書）", included: false },
      { label: "AI自動読み取り", included: false },
      { label: "クラウド保存（7年間）", included: false },
    ],
    cta: "今すぐ始める",
    ctaHref: "/upload",
    ctaStyle: "border-2 border-slate-300 text-slate-700 hover:bg-slate-100",
  },
  {
    id: "pdf",
    name: "PDF出力",
    price: 500,
    priceLabel: "¥500",
    period: "/ 回",
    description: "確定申告の時期に1回だけ使いたい方に。国税庁フォーマット準拠の収支内訳書を出力します。",
    icon: FileDown,
    color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badge: "人気",
    features: [
      { label: "書類アップロード（写真・スクショ・PDF）", included: true },
      { label: "証憑一覧・検索・フィルター", included: true },
      { label: "収支レポート（月別グラフ・科目別集計）", included: true },
      { label: "CSVエクスポート", included: true },
      { label: "PDF出力（収支内訳書）", included: true },
      { label: "AI自動読み取り", included: false },
      { label: "クラウド保存（7年間）", included: false },
    ],
    cta: "PDF出力する",
    ctaHref: "/export",
    ctaStyle: "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700",
  },
  {
    id: "ai",
    name: "AI自動読み取り",
    price: 30,
    priceLabel: "¥30",
    period: "/ 枚",
    description: "撮って送るだけで日付・取引先・金額・科目を自動入力。手入力の手間をゼロに。",
    icon: Sparkles,
    color: "from-sky-400 to-blue-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    badge: null,
    features: [
      { label: "書類アップロード（写真・スクショ・PDF）", included: true },
      { label: "証憑一覧・検索・フィルター", included: true },
      { label: "収支レポート（月別グラフ・科目別集計）", included: true },
      { label: "CSVエクスポート", included: true },
      { label: "PDF出力（収支内訳書）", included: false },
      { label: "AI自動読み取り（1枚ごと）", included: true },
      { label: "クラウド保存（7年間）", included: false },
    ],
    cta: "AI読み取りを使う",
    ctaHref: "/upload",
    ctaStyle: "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700",
  },
  {
    id: "cloud",
    name: "7年保存プラン",
    price: 500,
    priceLabel: "¥500",
    period: "/ 年",
    description: "電子帳簿保存法に対応したクラウド保存。PDF出力・ダウンロードも料金内で何度でも。",
    icon: Cloud,
    color: "from-teal-400 to-emerald-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    badge: "おすすめ",
    features: [
      { label: "書類アップロード（写真・スクショ・PDF）", included: true },
      { label: "証憑一覧・検索・フィルター", included: true },
      { label: "収支レポート（月別グラフ・科目別集計）", included: true },
      { label: "CSVエクスポート", included: true },
      { label: "PDF出力（収支内訳書）何度でも", included: true },
      { label: "AI自動読み取り", included: false },
      { label: "クラウド保存（7年間）", included: true },
    ],
    cta: "7年保存を始める",
    ctaHref: "/export",
    ctaStyle: "bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700",
  },
];

// ─── FAQ ────────────────────────────────────────────────────
const FAQS = [
  {
    q: "支払い方法は何が使えますか？",
    a: "クレジットカード（VISA・Mastercard・JCB・American Express）がご利用いただけます。決済はロボットペイメント株式会社が提供するセキュアな決済システムを使用しています。",
  },
  {
    q: "7年保存プランはいつでも解約できますか？",
    a: "はい、いつでも解約できます。解約後は次回更新日まで引き続きご利用いただけます。更新日以降はクラウド保存へのアクセスができなくなりますが、それまでにCSVでデータをエクスポートしていただけます。",
  },
  {
    q: "PDF出力は1回の支払いで何枚出力できますか？",
    a: "1回の支払いで、その年度の収支内訳書PDFを何度でも出力できます（同一年度内）。",
  },
  {
    q: "AI自動読み取りの精度はどのくらいですか？",
    a: "一般的なレシート・請求書・スクリーンショットで90%以上の精度で読み取れます。読み取り結果は必ず確認画面で表示されるので、不足している項目だけ手入力で補えます。",
  },
  {
    q: "領収書のデータはどこに保存されますか？",
    a: "無料プランはお使いのブラウザ（端末内）に保存されます。7年保存プランは国内のセキュアなクラウドサーバーに保存され、どの端末からでもアクセスできます。",
  },
  {
    q: "返金はできますか？",
    a: "デジタルコンテンツの性質上、PDF出力・AI読み取りの都度課金は原則として返金対応しておりません。7年保存プランは、サービス開始前であれば全額返金いたします。ご不明な点はお問い合わせください。",
  },
];

// ─── コンポーネント ──────────────────────────────────────────
export default function PricingPage() {
  return (
    <MainLayout>

      {/* HERO */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-2 text-sm text-sky-500 font-bold mb-4">
          <CreditCard className="w-4 h-4" />
          <span>料金・プラン</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight mb-4">
          使った分だけ。<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">必要なときに、必要なだけ。</span>
        </h1>
        <p className="text-lg text-brand-600/70 leading-relaxed max-w-xl">
          基本機能は無料。PDF出力・AI読み取りは都度課金。7年クラウド保存は年額500円のサブスクリプション。
        </p>
      </div>

      {/* プランカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14 animate-fade-up" style={{ animationDelay: "80ms" }}>
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative ${plan.bg} border-2 ${plan.border} rounded-3xl p-6 flex flex-col`}
            >
              {/* バッジ */}
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color} shadow-md`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* ヘッダー */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-brand-900">{plan.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-brand-900">{plan.priceLabel}</span>
                    <span className="text-sm text-brand-500">{plan.period}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-brand-600/70 leading-relaxed mb-5">{plan.description}</p>

              {/* 機能リスト */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(({ label, included }) => (
                  <li key={label} className="flex items-start gap-2.5">
                    {included ? (
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${included ? "text-brand-800" : "text-slate-400"}`}>{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaHref}
                className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          );
        })}
      </div>

      {/* 支払いについて */}
      <div className="card-glass rounded-3xl p-7 mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-sky-500 tracking-widest">PAYMENT</p>
            <h2 className="text-xl font-black text-brand-900">支払いについて</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 決済システム */}
          <div className="bg-white/60 rounded-2xl p-5 border border-white/80">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-brand-900">決済システム</h3>
            </div>
            <p className="text-xs text-brand-600/70 leading-relaxed mb-3">
              ロボットペイメント株式会社が提供するセキュアな決済システムを採用しています。カード情報は当サービスのサーバーには保存されません。
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["VISA", "Mastercard", "JCB", "AMEX"].map(card => (
                <span key={card} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{card}</span>
              ))}
            </div>
          </div>

          {/* 請求タイミング */}
          <div className="bg-white/60 rounded-2xl p-5 border border-white/80">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-teal-500" />
              <h3 className="text-sm font-bold text-brand-900">請求タイミング</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "PDF出力", desc: "出力操作時に即時決済" },
                { label: "AI読み取り", desc: "読み取り実行時に即時決済" },
                { label: "7年保存プラン", desc: "契約時に年額を一括決済。翌年同日に自動更新" },
              ].map(({ label, desc }) => (
                <div key={label}>
                  <p className="text-xs font-bold text-brand-800">{label}</p>
                  <p className="text-[11px] text-brand-500/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* キャンセル・返金 */}
          <div className="bg-white/60 rounded-2xl p-5 border border-white/80">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-violet-500" />
              <h3 className="text-sm font-bold text-brand-900">キャンセル・返金</h3>
            </div>
            <div className="space-y-2.5">
              <div>
                <p className="text-xs font-bold text-brand-800">都度課金（PDF・AI）</p>
                <p className="text-[11px] text-brand-500/70">デジタルコンテンツの性質上、原則返金不可</p>
              </div>
              <div>
                <p className="text-xs font-bold text-brand-800">7年保存プラン</p>
                <p className="text-[11px] text-brand-500/70">サービス開始前は全額返金。開始後は次回更新日まで利用可能（日割り返金なし）</p>
              </div>
              <div>
                <p className="text-xs font-bold text-brand-800">自動更新の停止</p>
                <p className="text-[11px] text-brand-500/70">設定画面からいつでも解約可能</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-500 tracking-widest">FAQ</p>
            <h2 className="text-xl font-black text-brand-900">よくある質問</h2>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="card-glass rounded-2xl p-5">
              <p className="text-sm font-bold text-brand-900 mb-2 flex items-start gap-2">
                <span className="text-sky-500 font-black flex-shrink-0">Q.</span>
                {q}
              </p>
              <p className="text-sm text-brand-600/70 leading-relaxed pl-5">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 特商法リンク */}
      <div className="text-center text-xs text-brand-400/60 animate-fade-up" style={{ animationDelay: "400ms" }}>
        <p>
          ご利用にあたっては
          <a href="/terms" className="text-sky-500 hover:underline mx-1">利用規約</a>・
          <a href="/privacy" className="text-sky-500 hover:underline mx-1">プライバシーポリシー</a>・
          <a href="/legal" className="text-sky-500 hover:underline mx-1">特定商取引法に基づく表記</a>
          をご確認ください。
        </p>
      </div>

    </MainLayout>
  );
}
