import { MainLayout } from "@/components/MainLayout";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "第1条（適用）",
    body: `本利用規約（以下「本規約」）は、鹿之賦宏美（以下「当方」）が提供するサービス「ReceiptSnap」（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。`,
  },
  {
    title: "第2条（利用登録）",
    body: `本サービスは、登録不要で基本機能をご利用いただけます。有料プランをご利用の場合は、当方の定める方法によりお申し込みいただきます。申し込みの承認をもって利用登録が完了します。`,
  },
  {
    title: "第3条（禁止事項）",
    body: `ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。\n\n・法令または公序良俗に違反する行為\n・犯罪行為に関連する行為\n・当方のサーバーまたはネットワークの機能を破壊・妨害する行為\n・当方のサービスの運営を妨害するおそれのある行為\n・他のユーザーに関する個人情報等を収集または蓄積する行為\n・不正アクセスをし、またはこれを試みる行為\n・他のユーザーに成りすます行為\n・当方のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為\n・その他、当方が不適切と判断する行為`,
  },
  {
    title: "第4条（本サービスの提供の停止等）",
    body: `当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。\n\n・本サービスにかかるコンピュータシステムの保守点検または更新を行う場合\n・地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合\n・コンピュータまたは通信回線等が事故により停止した場合\n・その他、当方が本サービスの提供が困難と判断した場合`,
  },
  {
    title: "第5条（著作権）",
    body: `ユーザーが本サービスにアップロードした書類・画像等のデータの著作権は、ユーザーに帰属します。当方は、サービス提供に必要な範囲でのみこれらのデータを利用します。`,
  },
  {
    title: "第6条（保証の否認および免責事項）",
    body: `当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。\n\n当方は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当方とユーザーとの間の契約（本規約を含みます）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。`,
  },
  {
    title: "第7条（サービス内容の変更等）",
    body: `当方は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。`,
  },
  {
    title: "第8条（利用規約の変更）",
    body: `当方は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。\n\n・本規約の変更がユーザーの一般の利益に適合するとき\n・本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき`,
  },
  {
    title: "第9条（個人情報の取扱い）",
    body: `当方によるユーザーの個人情報の取扱いについては、別途定めるプライバシーポリシーに従うものとし、ユーザーはこのプライバシーポリシーに同意するものとします。`,
  },
  {
    title: "第10条（準拠法・裁判管轄）",
    body: `本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄とします。`,
  },
];

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-2 text-sm text-sky-500 font-bold mb-4">
            <FileText className="w-4 h-4" />
            <span>利用規約</span>
          </div>
          <h1 className="text-3xl font-black text-brand-900 tracking-tight mb-2">
            利用規約
          </h1>
          <p className="text-sm text-brand-500/60">
            本サービスをご利用の前に、以下の利用規約をよくお読みください。
          </p>
        </div>

        {/* 本文 */}
        <div className="space-y-6">
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
