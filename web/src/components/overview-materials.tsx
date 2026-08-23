import Image from "next/image";
import { SiteLocationMap } from "@/components/site-location-map";
import { LOCATION_HIGHLIGHTS } from "@/lib/site-location";
import { Project } from "@/lib/types";

const FLOOR_LABEL: Record<string, string> = {
  "2F": "2층",
  "1F": "1층",
  B1: "지하1층",
};

function overviewRows(project: Project): [string, string][] {
  return [
    ["단지명", project.projectName],
    ["위치", project.address],
    ["지역/지구", project.zoningDistrict],
    [
      "용도",
      project.usageLabel ||
        `공동주택(${project.housingUnits}세대) 및 근린생활시설(${project.commercialUnitsTotal}호실)`,
    ],
    ["규모", project.scaleFloors],
    [
      "대지면적",
      `${project.siteAreaM2.toLocaleString("ko-KR", { minimumFractionDigits: 2 })}㎡ (${project.siteAreaPy.toLocaleString("ko-KR")}py)`,
    ],
    [
      "연면적",
      `${project.totalFloorAreaM2.toLocaleString("ko-KR", { minimumFractionDigits: 2 })}㎡ (${project.totalFloorAreaPy.toLocaleString("ko-KR")}py)`,
    ],
    [
      "주차 대수",
      `${project.parkingTotal}대(공동주택 ${project.parkingResidential}대, 근생 ${project.parkingCommercial}대)`,
    ],
  ];
}

/** 사업개요 표 — 메인 배너 직하 배치용 */
export function OverviewTable({ project }: { project: Project }) {
  const rows = overviewRows(project);

  return (
    <div className="bg-[#f7f9fb]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="overflow-hidden border border-[#4a90c4] bg-white shadow-[0_1px_0_rgba(74,144,196,0.25)]">
          <div className="bg-[#4a90c4] px-4 py-3 text-center">
            <h2 className="font-display text-lg tracking-[0.35em] text-white md:text-xl">
              사 업 개 요
            </h2>
          </div>
          <table className="w-full border-collapse text-sm text-[#4a5568] md:text-[15px]">
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label} className="border-t border-[#4a90c4]/60">
                  <th className="w-[28%] border-r border-[#4a90c4]/60 bg-[#f8fbfe] px-3 py-3.5 text-center font-medium tracking-[0.2em] text-[#5a6a7a] md:w-40 md:px-4">
                    {label}
                  </th>
                  <td className="px-4 py-3.5 leading-relaxed text-[#3d4a57]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          ※ 수치·표기는 제공 자료 기준이며, 최종 계약·인허가 서류와 다를 수 있습니다.
        </p>

        {project.floorSummaries.length > 0 ? (
          <div className="mt-8 overflow-hidden border border-[#4a90c4] bg-white shadow-[0_1px_0_rgba(74,144,196,0.25)]">
            <div className="bg-[#4a90c4] px-4 py-3 text-center">
              <h2 className="font-display text-lg tracking-[0.35em] text-white md:text-xl">
                잔여호실(근생)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-center text-sm text-[#4a5568] md:text-[15px]">
                <thead>
                  <tr className="border-t border-[#4a90c4]/60 bg-[#f8fbfe]">
                    <th className="border-r border-[#4a90c4]/60 px-3 py-3 font-medium tracking-[0.1em] text-[#5a6a7a]">
                      구분
                    </th>
                    <th className="border-r border-[#4a90c4]/60 px-3 py-3 font-medium tracking-[0.1em] text-[#5a6a7a]">
                      점포 수
                    </th>
                    <th className="border-r border-[#4a90c4]/60 px-3 py-3 font-medium tracking-[0.1em] text-[#5a6a7a]">
                      전용(PY)
                    </th>
                    <th className="border-r border-[#4a90c4]/60 px-3 py-3 font-medium tracking-[0.1em] text-[#5a6a7a]">
                      계약(PY)
                    </th>
                    <th className="px-3 py-3 font-medium tracking-[0.1em] text-[#5a6a7a]">전용률(%)</th>
                  </tr>
                </thead>
                <tbody>
                  {project.floorSummaries.map((f) => (
                    <tr key={f.floor} className="border-t border-[#4a90c4]/60">
                      <td className="border-r border-[#4a90c4]/60 px-3 py-3 font-semibold text-[#3d4a57]">
                        {FLOOR_LABEL[f.floor] ?? f.floor}
                      </td>
                      <td className="border-r border-[#4a90c4]/60 px-3 py-3 text-[#3d4a57]">{f.shopCount}</td>
                      <td className="border-r border-[#4a90c4]/60 px-3 py-3 text-[#3d4a57]">
                        {f.exclusiveAreaPy.toLocaleString("ko-KR")}
                      </td>
                      <td className="border-r border-[#4a90c4]/60 px-3 py-3 text-[#3d4a57]">
                        {f.contractAreaPy.toLocaleString("ko-KR")}
                      </td>
                      <td className="px-3 py-3 text-[#3d4a57]">{f.exclusiveRatioPct.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AerialPlan({ project }: { project: Project }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#dfe6ec]">
      <div className="mx-auto max-w-[1100px] px-4 pt-8 md:pt-10">
        <div className="relative aspect-[1160/825] w-full overflow-hidden bg-[#d5dde5]">
          <Image
            src="/images/aerial-plan.jpg"
            alt={`${project.projectName} 단지 조감`}
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            quality={90}
            className="object-contain object-center"
          />
        </div>
        <div className="pb-8 pt-4">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Site Plan</p>
          <h2 className="mt-1 font-display text-2xl text-brand-deep md:text-3xl">단지 배치를 한눈에</h2>
          <p className="mt-1 text-sm text-muted">
            A·B동 위치와 중앙 보행축, 옥상 녹화를 확인하고 상가 동선을 그려 보세요.
          </p>
        </div>
      </div>
    </div>
  );
}

/** 입지 — Leaflet 실지도 */
export function LocationMapSection() {
  return (
    <div className="relative w-full overflow-hidden bg-[#f7f9fb]">
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-16">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Location</p>
        <h2 className="mt-1 font-display text-2xl text-brand-deep md:text-3xl">
          송도의 &lsquo;대치동&rsquo;, 1공구 중심 상권
        </h2>
        <p className="mt-1 text-sm font-medium text-brand md:text-base">
          송도 아이비 학원가 랜드마크 상업시설 · THE CENTER OF EDUCATION
        </p>
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
          고소득층 초밀집 수요와 메인 학원가로 이어지는 중심자리. 독보적인 외관 특화
          디자인으로 차별화된 랜드마크 상업시설입니다.
        </p>
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_32px_rgba(8,38,60,0.08)]">
          <SiteLocationMap />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {LOCATION_HIGHLIGHTS.map((item, index) => (
            <div key={item.title} className="border-t-2 border-brand pt-4">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">0{index + 1}</p>
              <h3 className="mt-2 font-display text-lg text-brand-deep md:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** About 등에서 조감 + 표를 함께 쓸 때 */
export function OverviewMaterials({ project }: { project: Project }) {
  return (
    <section className="bg-[#f7f9fb]">
      <AerialPlan project={project} />
      <OverviewTable project={project} />
    </section>
  );
}
