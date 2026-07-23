import Link from "next/link";
import { AerialPlan, OverviewTable } from "@/components/overview-materials";
import { store } from "@/lib/store";

export default async function AboutPage() {
  const project = await store.getProject();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-2">
        <h1 className="font-display text-4xl text-brand-deep">사업개요</h1>
        <p className="mt-3 max-w-3xl text-muted">
          {project.usageLabel}로 구성된 주상복합 단지의 상업시설입니다.
        </p>
      </div>

      <OverviewTable project={project} />
      <AerialPlan project={project} />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl text-brand-deep">잔여 호실(근생)</h2>
        <p className="mt-2 text-sm text-muted">
          전체 {project.commercialUnitsTotal}호실 중 분양 가능 {project.commercialUnitsForSale}실
        </p>
        <div className="mt-4 overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <th className="px-4 py-3">구분</th>
                <th className="px-4 py-3">점포 수</th>
                <th className="px-4 py-3">전용 PY</th>
                <th className="px-4 py-3">계약 PY</th>
                <th className="px-4 py-3">전용률</th>
              </tr>
            </thead>
            <tbody>
              {project.floorSummaries.map((f) => (
                <tr key={f.floor} className="border-t border-line">
                  <td className="px-4 py-3">{f.floor}</td>
                  <td className="px-4 py-3">{f.shopCount}</td>
                  <td className="px-4 py-3">{f.exclusiveAreaPy.toLocaleString()}</td>
                  <td className="px-4 py-3">{f.contractAreaPy.toLocaleString()}</td>
                  <td className="px-4 py-3">{f.exclusiveRatioPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/units" className="bg-brand px-4 py-2 text-sm text-white">
            호실 보기
          </Link>
          <Link href="/contact" className="border border-line px-4 py-2 text-sm">
            상담 신청
          </Link>
        </div>
      </div>
    </div>
  );
}
