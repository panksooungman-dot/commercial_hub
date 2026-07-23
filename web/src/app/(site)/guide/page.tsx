import Link from "next/link";
import { store } from "@/lib/store";

export default async function GuidePage() {
  const project = await store.getProject();
  const hasSchedule = project.salesSchedule.length > 0;
  const hasTerms = Boolean(project.salesTerms.trim());
  const hasNotices = Boolean(project.notices.trim());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">분양안내</h1>
      <p className="mt-2 text-muted">
        일정·조건·유의사항은 관리자 페이지에서 수정·공개합니다.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-brand">분양 일정</h2>
        {hasSchedule ? (
          <ol className="mt-4 space-y-3">
            {[...project.salesSchedule]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((s) => (
                <li key={s.id} className="border border-line bg-surface p-4">
                  <p className="text-sm text-accent">{s.dateLabel}</p>
                  <p className="font-medium text-brand">{s.title}</p>
                  {s.description ? <p className="mt-1 text-sm text-muted">{s.description}</p> : null}
                </li>
              ))}
          </ol>
        ) : (
          <p className="mt-3 rounded-sm border border-dashed border-line bg-surface p-4 text-sm text-muted">
            아직 등록된 일정이 없습니다. 관리자 → 프로젝트 설정에서 추가하세요.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-brand">분양 조건</h2>
        {hasTerms ? (
          <pre className="mt-3 whitespace-pre-wrap border border-line bg-surface p-4 text-sm leading-relaxed text-foreground">
            {project.salesTerms}
          </pre>
        ) : (
          <p className="mt-3 rounded-sm border border-dashed border-line bg-surface p-4 text-sm text-muted">
            분양 조건 본문이 비어 있습니다. 관리자에서 입력하면 이 영역에 표시됩니다.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-brand">유의사항</h2>
        {hasNotices ? (
          <pre className="mt-3 whitespace-pre-wrap border border-line bg-surface p-4 text-sm leading-relaxed">
            {project.notices}
          </pre>
        ) : (
          <p className="mt-3 rounded-sm border border-dashed border-line bg-surface p-4 text-sm text-muted">
            유의사항이 비어 있습니다. 관리자에서 입력하세요.
          </p>
        )}
      </section>

      <section className="mt-10 border border-line bg-surface p-5">
        <h2 className="font-display text-xl text-brand">현재 공개된 요약</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          <li>· 분양 가능 {project.commercialUnitsForSale}실 (전체 {project.commercialUnitsTotal}실)</li>
          <li>· 전용률(잔여 합계) {project.exclusiveRatioRemainingPct}%</li>
          <li>· 근생 주차 {project.parkingCommercial}대</li>
        </ul>
      </section>

      <div className="mt-8 flex gap-3">
        <Link href="/faq" className="border border-line px-4 py-2 text-sm">
          FAQ
        </Link>
        <Link href="/contact" className="bg-brand px-4 py-2 text-sm text-white">
          상담 신청
        </Link>
      </div>
    </div>
  );
}
