import Image from "next/image";
import Link from "next/link";
import {
  AreaFacilitiesSection,
  BrandStorySection,
  FacadeStreetSection,
  LifestylePremiumSection,
  PremiumEightSection,
} from "@/components/marketing-sections";
import { DesignDrawingsSection } from "@/components/design-drawings-section";
import { AerialPlan, OverviewTable } from "@/components/overview-materials";
import { store, getPublicUnits } from "@/lib/store";
import { frontFacadeForUnitId, resolveFrontLength } from "@/lib/front-lengths";

/** 히어로 배경 영상(문구 없음) + HTML 문구 오버레이. poster는 영상 첫 프레임과 동일한 이미지. */
const HERO_VIDEO_SRC = "/videos/hero-banner.mp4";
const HERO_POSTER_SRC = "/images/hero-banner-poster.jpg";

export default async function HomePage() {
  const project = await store.getProject();
  const units = await getPublicUnits();
  const available = units.filter((u) => u.status === "available").length;

  return (
    <div>
      <section className="relative overflow-hidden bg-[#e8eef3] text-white">
        <div className="relative mx-auto w-full max-w-[1400px]">
          <div className="relative aspect-[1920/834] min-h-[440px] w-full overflow-hidden sm:min-h-[500px] md:min-h-[560px] lg:min-h-[620px]">
            {/* LCP 대상: 최적화된 poster 이미지가 먼저 그려지고, 영상은 로드되는 대로 위에 겹쳐 재생된다. */}
            <Image
              src={HERO_POSTER_SRC}
              alt={`${project.projectName} 외관`}
              fill
              priority
              quality={90}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={HERO_VIDEO_SRC}
              poster={HERO_POSTER_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
            {/* 가독성을 위한 어두운 오버레이(약 45%) + 버튼 영역 하단 보강 그라데이션 */}
            <div className="absolute inset-0 bg-[#04141f]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04141f]/60 via-[#04141f]/15 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-5 pt-24 pb-10 sm:px-10 sm:pb-12 md:px-14 md:pb-14">
              <div className="max-w-xl sm:max-w-2xl">
                <h1 className="animate-hero-fade-up font-display text-[2.1rem] leading-[1.22] font-bold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-[2.75rem] sm:leading-[1.18] md:text-5xl lg:text-[3.5rem] lg:leading-[1.14]">
                  <span className="block">투자가치의 중심,</span>
                  <span className="block text-accent">새로운 비즈니스의 시작</span>
                </h1>
                <p className="animate-hero-fade-up mt-4 max-w-md text-sm leading-relaxed text-white/85 [animation-delay:200ms] sm:mt-5 sm:max-w-lg sm:text-base sm:leading-relaxed md:text-lg">
                  프리미엄 입지와 미래가치를 갖춘 상업시설에서 성공적인 투자와 비즈니스의 새로운 기회를 만나보세요.
                </p>
                <div className="animate-hero-fade-up mt-7 flex flex-wrap gap-3 [animation-delay:400ms] sm:mt-9">
                  <Link
                    href="/plan"
                    className="bg-accent px-6 py-3.5 text-sm font-semibold text-brand-deep transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#d6b96e] hover:shadow-[0_12px_28px_-10px_rgba(196,163,90,0.65)] sm:px-7 sm:py-4 sm:text-base"
                  >
                    {project.heroCtaPrimary || "분양 정보 보기"}
                  </Link>
                  <Link
                    href="/contact"
                    className="border border-accent/60 bg-brand-deep/60 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-[2px] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:bg-brand-deep/85 sm:px-7 sm:py-4 sm:text-base"
                  >
                    {project.heroCtaSecondary || "상담 신청하기"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LifestylePremiumSection />
      <FacadeStreetSection />
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

      <DesignDrawingsSection
        units={units
          .filter((u) => u.status !== "hidden")
          .map((u) => ({
            id: u.id,
            building: u.building,
            floor: u.floor,
            unitNo: u.unitNo,
            status: u.status as "available" | "reserved" | "sold" | "move_in",
            exclusiveArea: u.exclusiveArea,
            exclusiveAreaUnit: u.exclusiveAreaUnit,
            contractArea: u.contractArea,
            frontLengthMm: u.frontLengthMm ?? resolveFrontLength(u.building, u.floor, u.id)?.mm ?? null,
            frontFacade: frontFacadeForUnitId(u.id) ?? resolveFrontLength(u.building, u.floor, u.id)?.facade ?? null,
            price: u.price,
            recommendedBusiness: u.recommendedBusiness,
            options: u.options,
          }))}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-brand-deep">층별 MD</h2>
        <p className="mt-2 text-muted">교육·리테일·체류형 목적에 맞춘 층별 구성</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {project.floorSummaries.map((f) => (
            <Link
              key={f.floor}
              href={`/plan?floor=${f.floor}`}
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
