import { MainLayout } from "@/components/MainLayout";
import { Shield } from "lucide-react";

const ITEMS = [
  { label: "販売事業者名", value: "鹿之賦宏美" },
  { label: "所在地", value: "〒150-0043\n東京都渋谷区道玄坂1丁目10番8号\n渋谷道玄坂東急ビル2F−C" },
  { label: "メールアドレス", value: "livestock.infomation@gmail.com" },
  { label: "販売URL", value: "https://receiptsnap.vercel.app" },
  {
    label: "販売価格",
    value: "各サービスページに表示された金額（税込）\n・シンプル出力（決算書のみ）：¥500 / 回\n・税務調査対応（決算書＋証憑一覧）：¥1,000 / 回\n・7年保存プラン：¥2,500 / 年\n・7年保存＋AIプラン：¥5,000 / 年",
  },
  {
    label: "支払い方法",
    value: "クレジットカード（VISA・Mastercard・JCB・American Express）\n※ ロボットペイメント株式会社の決済システムを利用",
  },
  {
    label: "支払い時期",
    value: "都度課金（PDF出力）：サービス利用時に即時決済\n年額プラン：契約時に一括決済、翌年同日に自動更新",
  },
  {
    label: "サービス提供時期",
    value: "決済完了後、即時ご利用いただけます。",
  },
  {
    label: "返品・キャンセルについて",
    value: "デジタルコンテンツの性質上、PDF出力の都度課金は原則として返金・キャンセルを承っておりません。\n年額プランはサービス開始前（決済完了から24時間以内）であれば全額返金いたします。サービス開始後の返金・日割り計算はいたしかねます。\nご不明な点はメールにてお問い合わせください。",
  },
  {
    label: "動作環境",
    value: "最新版のChrome・Safari・Firefox・Edgeを推奨します。\nスマートフォン（iOS・Android）のブラウザでもご利用いただけます。",
  },
];

export default function LegalPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-2 text-sm text-sky-500 font-bold mb-4">
            <Shield className="w-4 h-4" />
            <span>特定商取引法に基づく表記</span>
          </div>
          <h1 className="text-3xl font-black text-brand-900 tracking-tight mb-2">
            特定商取引法に基づく表記
          </h1>
          <p className="text-sm text-brand-500/60">
            特定商取引に関する法律第11条に基づき、以下の事項を表示します。
          </p>
        </div>

        {/* テーブル */}
        <div className="card-glass rounded-3xl overflow-hidden animate-fade-up" style={{ animationDelay: "80ms" }}>
          <table className="w-full">
            <tbody>
              {ITEMS.map(({ label, value }, i) => (
                <tr
                  key={label}
                  className={i % 2 === 0 ? "bg-white/40" : "bg-sky-50/30"}
                >
                  <th className="text-left text-xs font-bold text-brand-700 px-6 py-4 align-top w-40 border-r border-sky-100/60 whitespace-nowrap">
                    {label}
                  </th>
                  <td className="text-sm text-brand-800 px-6 py-4 leading-relaxed whitespace-pre-line">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-brand-400/50 mt-8 text-center animate-fade-up" style={{ animationDelay: "160ms" }}>
          最終更新日：{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </MainLayout>
  );
}
