import Image from "next/image";
import Link from "next/link";
import {
  AreaFacilitiesSection,
  BrandStorySection,
  PremiumEightSection,
} from "@/components/marketing-sections";
import { DesignDrawingsSection } from "@/components/design-drawings-section";
import { AerialPlan, OverviewTable } from "@/components/overview-materials";
import { store, getPublicUnits } from "@/lib/store";

/** 히어로 사진(문구 없음) + HTML 문구 오버레이 */
const HERO = { src: "/images/hero-banner-main.gif", w: 1903, h: 1033 } as const;

export default async function HomePage() {
  const project = await store.getProject();
  const units = await getPublicUnits();
  const available = units.filter((u) => u.status === "available").length;

  return (
    <div>
      <section className="relative overflow-hidden bg-[#e8eef3] text-white">
        <div className="relative mx-auto w-full max-w-[1400px]">
          <div className="relative aspect-[1920/834] min-h-[420px] w-full sm:min-h-[480px]">
            <Image
              src={HERO.src}
              alt={`${project.projectName} 외관`}
              fill
              priority
              quality={92}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-[center_45%]"
            />
            {/* 사진은 살리고, 좌측·하단에만 부드러운 톤 */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(12,28,48,0.62) 0%, rgba(12,28,48,0.28) 38%, rgba(12,28,48,0.08) 62%, transparent 78%), linear-gradient(0deg, rgba(12,28,48,0.45) 0%, transparent 38%)",
              }}
            />

            <div className="absolute inset-0 flex flex-col items-end justify-end px-5 pb-10 pt-24 sm:px-10 sm:pb-12 md:px-14 md:pb-14">
              <div className="max-w-xl">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/units"
                    className="bg-accent px-5 py-3 text-sm font-semibold text-brand-deep transition hover:brightness-105"
                  >
                    {project.heroCtaPrimary || "호실 보기"}
                  </Link>
                  <Link
                    href="/contact"
                    className="border border-white/45 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-[2px] hover:bg-white/18"
                  >
                    {project.heroCtaSecondary || "상담 신청하기"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OverviewTable project={project} />

      <BrandStorySection />
      <PremiumEightSection />
      <AreaFacilitiesSection />

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["분양 가능", `${available || project.commercialUnitsForSale}실`],
            ["규모", project.scaleFloors],
            ["근생 주차", `${project.parkingCommercial}대`],
            ["위치", "송도동 20-4~11"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
              <p className="mt-1 font-display text-2xl text-brand">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <AerialPlan project={project} />

      <DesignDrawingsSection />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-brand-deep">층별 MD</h2>
        <p className="mt-2 text-muted">교육·리테일·체류형 목적에 맞춘 층별 구성</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {project.floorSummaries.map((f) => (
            <Link
              key={f.floor}
              href={`/units?floor=${f.floor}`}
              className="border border-line bg-surface p-5 transition hover:border-brand"
            >
              <p className="text-sm text-accent">
                {f.floor} · {f.shopCount}실
              </p>
              <h3 className="mt-2 font-display text-xl text-brand">{f.recommendedBusinesses}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.mdConcept}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand px-4 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl">관심 호실이 있으신가요?</h2>
            <p className="mt-2 text-white/75">
              분양가·일정은 관리자에서 등록 후 공개됩니다. 우선 상담으로 확인해 주세요.
            </p>
          </div>
          <Link href="/contact" className="bg-accent px-5 py-3 text-sm font-semibold text-brand-deep">
            상담 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}
