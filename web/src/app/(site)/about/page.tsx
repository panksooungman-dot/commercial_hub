import Image from "next/image";
import Link from "next/link";
import { AerialPlan, OverviewTable } from "@/components/overview-materials";
import { store } from "@/lib/store";

export default async function AboutPage() {
  const project = await store.getProject();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-2 sm:pt-12">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#0b1622] text-white">
          <Image
            src="/images/about-header.jpg"
            alt={`${project.projectName} 외관 야경`}
            fill
            priority
            quality={90}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04141f]/80 via-[#04141f]/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase sm:text-sm">
              {project.projectName}
            </p>
            <h1 className="mt-2 font-display text-2xl text-white sm:text-3xl md:text-4xl">
              사업개요
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-muted">
          {project.projectName} — {project.usageLabel}. 규모·면적·주차 등 핵심 수치를
          한곳에서 확인하세요.
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
          <Link href="/plan" className="bg-brand px-4 py-2 text-sm text-white">
            호실·도면
          </Link>
          <Link href="/contact" className="border border-line px-4 py-2 text-sm">
            상담 신청
          </Link>
        </div>
      </div>
    </div>
  );
}
