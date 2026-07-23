import Link from "next/link";
import { FAQ_CATEGORY_LABEL } from "@/lib/format";
import { store } from "@/lib/store";

export default async function FaqPage() {
  const faqs = (await store.getFaqs())
    .filter((f) => f.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">FAQ</h1>
      <p className="mt-2 text-muted">질문과 답변은 운영 중에도 업데이트될 수 있습니다.</p>

      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.id} className="border border-line bg-surface">
            <summary className="cursor-pointer px-4 py-3">
              <span className="mr-2 text-xs text-accent">
                {FAQ_CATEGORY_LABEL[f.category]}
              </span>
              <span className="font-medium text-brand">{f.question}</span>
            </summary>
            <div className="border-t border-line px-4 py-3 text-sm text-muted whitespace-pre-wrap">
              {f.answer.trim()
                ? f.answer
                : "답변이 아직 등록되지 않았습니다. 관리자 FAQ에서 입력하거나 상담으로 문의해 주세요."}
            </div>
          </details>
        ))}
      </div>

      <Link href="/contact" className="mt-8 inline-block bg-brand px-4 py-2 text-sm text-white">
        상담 신청
      </Link>
    </div>
  );
}
