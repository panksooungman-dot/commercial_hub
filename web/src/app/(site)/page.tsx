import Image from "next/image";
import Link from "next/link";
import {
  BrandStorySection,
  LifestylePremiumSection,
  PremiumEightSection,
} from "@/components/marketing-sections";
import { DesignDrawingsSection } from "@/components/design-drawings-section";
import { AerialPlan, LocationMapSection, OverviewTable } from "@/components/overview-materials";
import { SectionDotNav } from "@/components/section-dot-nav";
import { store, getPublicUnits } from "@/lib/store";
import { frontFacadeForUnitId, resolveFrontLength } from "@/lib/front-lengths";

/** 히어로 배경 영상(문구 없음) + HTML 문구 오버레이. poster는 영상 첫 프레임과 동일한 이미지. */
const HERO_VIDEO_SRC = "/videos/hero-banner.mp4";
const HERO_POSTER_SRC = "/images/hero-banner-poster.jpg";

const NAV_SECTIONS = [
  { id: "hero", label: "인트로" },
  { id: "why", label: "왜 여기인가" },
  { id: "overview", label: "사업개요" },
  { id: "brand", label: "브랜드" },
  { id: "premium8", label: "프리미엄" },
  { id: "siteplan", label: "단지조감" },
  { id: "location", label: "입지" },
  { id: "drawings", label: "설계도면" },
  { id: "floormd", label: "층별MD" },
  { id: "cta", label: "상담" },
];

export default async function HomePage() {
  const project = await store.getProject();
  const units = await getPublicUnits();

  return (
    <div>
      <SectionDotNav sections={NAV_SECTIONS} />
      <section id="hero" className="relative overflow-hidden bg-[#e8eef3] text-white">
        <div className="relative mx-auto w-full max-w-[1400px]">
          <div className="relative aspect-[1920/834] min-h-[440px] w-full overflow-hidden sm:min-h-[500px] md:min-h-[560px] lg:min-h-[620px]">
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
            <div className="absolute inset-0 bg-[#04141f]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04141f]/60 via-[#04141f]/15 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-5 pt-24 pb-10 sm:px-10 sm:pb-12 md:px-14 md:pb-14">
              <div className="max-w-xl sm:max-w-2xl">
                <p className="animate-hero-fade-up text-xs font-semibold tracking-[0.22em] text-accent uppercase sm:text-sm">
                  {project.projectName}
                </p>
                <h1 className="animate-hero-fade-up mt-3 font-display text-[2.1rem] leading-[1.22] font-bold text-white [animation-delay:80ms] [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-[2.75rem] sm:leading-[1.18] md:text-5xl lg:text-[3.5rem] lg:leading-[1.14]">
                  <span className="block">걸음이 모이는 거리,</span>
                  <span className="block text-accent">비즈니스가 자랍니다</span>
                </h1>
                <p className="animate-hero-fade-up mt-4 max-w-md text-sm leading-relaxed text-white/85 [animation-delay:200ms] sm:mt-5 sm:max-w-lg sm:text-base md:text-lg">
                  학세권·스트리트몰·단지 고정수요가 한곳에서 만나는 상업시설.
                  아이비스퀘어에서 다음 투자의 자리를 골라보세요.
                </p>
                <div className="animate-hero-fade-up mt-7 flex flex-wrap gap-3 [animation-delay:400ms] sm:mt-9">
                  <Link
                    href="/plan"
                    className="bg-accent px-6 py-3.5 text-sm font-semibold text-brand-deep transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#d6b96e] hover:shadow-[0_12px_28px_-10px_rgba(196,163,90,0.65)] sm:px-7 sm:py-4 sm:text-base"
                  >
                    {project.heroCtaPrimary || "호실·도면 보기"}
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

      {/* 1. 왜 여기인가 → 2. 사업 팩트 → 3. 시공 브랜드 → 4. 가치 요약 */}
      <div id="why">
        <LifestylePremiumSection />
      </div>
      <div id="overview">
        <OverviewTable project={project} />
      </div>
      <div id="brand">
        <BrandStorySection />
      </div>
      <div id="premium8">
        <PremiumEightSection />
      </div>

      <div id="siteplan">
        <AerialPlan project={project} />
      </div>
      <div id="location">
        <LocationMapSection />
      </div>

      <div id="drawings">
        <DesignDrawingsSection
          units={units
            .filter((u) => u.status !== "hidden")
            .map((u) => ({
              id: u.id,
              building: u.building,
              floor: u.floor,
              unitNo: u.unitNo,
              status: u.status as "available" | "for_lease" | "reserved" | "sold" | "move_in",
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
      </div>

      <section id="floormd" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Floor MD</p>
        <h2 className="mt-2 font-display text-3xl text-brand-deep">층마다 다른 목적, 다른 기회</h2>
        <p className="mt-2 max-w-2xl text-muted">
          2층은 교육·서비스, 1층은 앵커 리테일, B1은 체류형 목적 상권.
          업종에 맞는 층을 먼저 고르고 호실을 비교해 보세요.
        </p>
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

      <section id="cta" className="bg-brand px-4 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl">다음 단계는 호실을 고르는 일</h2>
            <p className="mt-2 max-w-xl text-white/75">
              도면에서 위치와 면적을 확인한 뒤, 관심 호실로 상담을 이어가 주세요.
              분양가·일정은 상담 시 안내드립니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/plan" className="bg-accent px-5 py-3 text-sm font-semibold text-brand-deep">
              호실·도면 보기
            </Link>
            <Link
              href="/contact"
              className="border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:border-white"
            >
              상담 신청
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
