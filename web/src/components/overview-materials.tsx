import Image from "next/image";
import { Project } from "@/lib/types";

function overviewRows(project: Project): [string, string][] {
  return [
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

export function LocationMapSection() {
  return (
    <div className="relative w-full overflow-hidden bg-[#f7f9fb]">
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-16">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Location</p>
        <h2 className="mt-1 font-display text-2xl text-brand-deep md:text-3xl">
          송도의 &lsquo;대치동&rsquo;, 1공구 중심 상권
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
          채드윅송도국제학교·인천포스코고등학교 등 학원가와 고소득 배후주거, 센트럴파크가
          한자리에서 만나는 입지입니다. 도보 생활권 안에 상주 수요와 방문 수요가 함께 겹칩니다.
        </p>
        <div className="relative mt-6 aspect-[1035/615] w-full overflow-hidden rounded-2xl border border-line bg-[#dfe6ec]">
          <Image
            src="/images/site-location-map.jpg"
            alt="송도 1공구 입지 및 배후 상권 지도"
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            quality={90}
            className="object-contain object-center"
          />
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
