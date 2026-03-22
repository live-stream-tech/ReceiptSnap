import { MainLayout } from "@/components/MainLayout";
import { Lock } from "lucide-react";

const SECTIONS = [
  {
    title: "1. 事業者情報",
    body: `事業者名：鹿之賦宏美\n所在地：〒150-0043 東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C\nメールアドレス：livestock.infomation@gmail.com`,
  },
  {
    title: "2. 収集する個人情報",
    body: `本サービスでは、以下の情報を収集することがあります。\n\n・メールアドレス（有料プランのお申し込み時）\n・決済情報（クレジットカード番号等は決済代行会社が管理し、当方は保持しません）\n・アップロードされた書類・画像データ\n・サービスの利用状況（アクセスログ等）`,
  },
  {
    title: "3. 個人情報の利用目的",
    body: `収集した個人情報は、以下の目的で利用します。\n\n・本サービスの提供・運営\n・ユーザーからのお問い合わせへの対応\n・利用規約に違反したユーザーへの対応\n・本サービスの改善・新機能の開発\n・法令に基づく対応`,
  },
  {
    title: "4. 個人情報の第三者提供",
    body: `当方は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。\n\n・ユーザーの同意がある場合\n・法令に基づく場合\n・人の生命・身体・財産の保護のために必要な場合\n・公衆衛生の向上または児童の健全な育成の推進のために特に必要な場合\n・国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合`,
  },
  {
    title: "5. データの保存・セキュリティ",
    body: `無料プランのデータはユーザーのブラウザ（端末）内にのみ保存されます。当方のサーバーには送信されません。\n\n有料の7年保存プランをご利用の場合、データは国内のセキュアなクラウドサーバーに暗号化して保存されます。当方は適切なセキュリティ対策を講じますが、完全なセキュリティを保証するものではありません。`,
  },
  {
    title: "6. Cookieの使用",
    body: `本サービスでは、サービスの改善・利用状況の分析のためにCookieを使用することがあります。ブラウザの設定によりCookieを無効にすることができますが、一部の機能が利用できなくなる場合があります。`,
  },
  {
    title: "7. 個人情報の開示・訂正・削除",
    body: `ユーザーは、当方が保有する自己の個人情報の開示・訂正・削除を求めることができます。ご希望の場合は、下記のメールアドレスまでご連絡ください。\n\nlivestock.infomation@gmail.com\n\n本人確認のうえ、合理的な期間内に対応いたします。`,
  },
  {
    title: "8. プライバシーポリシーの変更",
    body: `当方は、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に掲載した時点から効力を生じるものとします。`,
  },
  {
    title: "9. お問い合わせ",
    body: `本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。\n\nメールアドレス：livestock.infomation@gmail.com`,
  },
];

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-2 text-sm text-sky-500 font-bold mb-4">
            <Lock className="w-4 h-4" />
            <span>プライバシーポリシー</span>
          </div>
          <h1 className="text-3xl font-black text-brand-900 tracking-tight mb-2">
            プライバシーポリシー
          </h1>
          <p className="text-sm text-brand-500/60">
            鹿之賦宏美（以下「当方」）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
          </p>
        </div>

        {/* 本文 */}
        <div className="space-y-5">
          {SECTIONS.map(({ title, body }, i) => (
            <div
              key={title}
              className="card-glass rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <h2 className="text-sm font-black text-brand-900 mb-3">{title}</h2>
              <p className="text-sm text-brand-700/80 leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-brand-400/50 mt-10 text-center animate-fade-up">
          最終更新日：{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </MainLayout>
  );
}
