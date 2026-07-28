import Image from "next/image";
import Link from "next/link";

const PREMIUM8 = [
  {
    src: "/images/mood/academy.jpg",
    title: "수도권 대표 학원가",
    desc: "송도 1공구 학원가 거리",
    alt: "송도 학원가 교육 상권 분위기",
  },
  {
    src: "/images/aerial-plan.jpg",
    title: "초밀집 배후수요",
    desc: "단지 인근 약 1만 5천여 세대",
    alt: "송도 하늘채 아이비원 단지 조감도",
  },
  {
    src: "/images/marketing/facade-street.png",
    title: "그랜드 스트리트몰",
    desc: "약 140m, 3개 층 대형 상업시설",
    alt: "그랜드 스트리트몰 상업시설 외관",
  },
  {
    src: "/images/section-kolon-pride.jpg",
    title: "코오롱 혁신설계",
    desc: "코오롱글로벌의 앞선 시공력",
    alt: "코오롱글로벌 건축 브랜드",
  },
  {
    src: "/images/marketing/lifestyle-premium.png",
    title: "획기적 대형호재",
    desc: "송도 GTX·KTX, K바이오 랩허브",
    alt: "송도 교통·입지 프리미엄",
  },
  {
    src: "/images/hero-exterior.jpg",
    title: "연이은 기업입주",
    desc: "셀트리온, 삼성바이오로직스 등",
    alt: "송도 프리미엄 주상복합 스카이라인",
  },
  {
    src: "/images/marketing/lifestyle-garden.png",
    title: "365일 상권",
    desc: "아파트 입주민의 고정수요",
    alt: "단지 내 라이프·근린생활시설",
  },
  {
    src: "/images/mood/retail.jpg",
    title: "규제 덜한 수익형 상가",
    desc: "높은 대출 한도, 수익형 선호",
    alt: "스트리트 리테일 상가 분위기",
  },
] as const;

/** 브랜드·시공 — 스토리 이후 한 번만 */
export function BrandStorySection() {
  return (
    <section className="bg-[#eceef1]">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs tracking-[0.2em] text-muted uppercase">Kolon Global</p>
        <h2 className="mt-2 text-center font-display text-2xl text-brand-deep md:text-3xl">
          코오롱이 짓는 하늘채의 이름
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted md:text-base">
          설계와 시공의 디테일이 곧 상가의 품격이 됩니다. 송도에서 선보이는 아이비스퀘어는
          코오롱글로벌이 쌓아 온 건축 미학 위에 서 있습니다.
        </p>

        <figure className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,40,60,0.08)]">
          <Image
            src="/images/section-kolon-pride.jpg"
            alt="코오롱글로벌 건축 포트폴리오와 아이비스퀘어 소개"
            width={1536}
            height={785}
            quality={90}
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="h-auto w-full"
          />
        </figure>
      </div>
    </section>
  );
}

/**
 * 입지 → 단지 라이프 → 스트리트 파사드까지 한 줄기 스토리
 * (학세권·교통 / 헬시가든·근생 / 외관 비주얼 — 중복 헤드라인 없이)
 */
export function LifestylePremiumSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(165deg,#d9e6f0_0%,#eef3f7_42%,#f4f6f8_100%)]">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#9bb8ce]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-24 h-56 w-56 rounded-full bg-[#c4a35a]/12 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1100px] px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            Why Ivyone
          </p>
          <h2 className="mt-3 font-display text-[1.85rem] leading-tight text-brand-deep sm:text-4xl md:text-[2.55rem]">
            사람이 머무는 자리에는
            <span className="mt-1 block text-brand">매출의 이유가 있습니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            학세권이 매일의 발길을 만들고, 단지 안 라이프가 고정 수요를 키우며,
            스트리트 파사드가 시선을 붙잡습니다. 아이비원은 그 세 가지가 한 단지에서
            이어집니다.
          </p>
        </div>

        <div className="mt-14 space-y-16 md:mt-16 md:space-y-20">
          <article className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <figure className="order-2 overflow-hidden md:order-1">
              <Image
                src="/images/marketing/lifestyle-premium.png"
                alt="학세권·그랜드 스트리트몰·교통 호재"
                width={1024}
                height={689}
                quality={90}
                sizes="(max-width: 768px) 100vw, 540px"
                className="h-auto w-full"
              />
            </figure>
            <div className="order-1 md:order-2">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                01 · Location
              </p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-brand-deep sm:text-[1.7rem]">
                학세권이 모은 발길 위에
                <br />
                교통 호재가 더해집니다
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                수도권 대표 학원가와 맞닿아 학생·학부모의 동선이 끊이지 않습니다.
                송도발 GTX·KTX, 제2공항철도 구상까지 더해지며 상권의 반경은 단지 밖으로
                넓어집니다.
              </p>
            </div>
          </article>

          <article className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                02 · Daily Life
              </p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-brand-deep sm:text-[1.7rem]">
                단지 안에서 끝나는 하루가
                <br />
                상가의 반복 매출이 됩니다
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                헬시가든과 근린생활시설이 입주민의 일상을 단지 안에 붙잡아 둡니다.
                멀리서 사람을 끌어오기보다, 가장 가까운 곳에서 다시 찾게 만드는 상권입니다.
              </p>
            </div>
            <figure className="overflow-hidden">
              <Image
                src="/images/marketing/lifestyle-garden.png"
                alt="헬시가든과 근린생활시설"
                width={1024}
                height={582}
                quality={90}
                sizes="(max-width: 768px) 100vw, 540px"
                className="h-auto w-full"
              />
            </figure>
          </article>
        </div>
      </div>

      {/* 스트리트 외관 — 별도 섹션 없이 스토리의 마침 비주얼 */}
      <div className="mx-auto max-w-[1400px]">
        <figure>
          <Image
            src="/images/marketing/facade-street.png"
            alt="송도 하늘채 아이비원 스트리트형 상업시설 외관"
            width={1024}
            height={444}
            quality={92}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-line/60 bg-white/80 px-4 py-4 text-center sm:px-6">
            <p className="font-display text-lg text-brand-deep sm:text-xl">
              03 · Street — 통유리 파사드가 만드는 연도형 상가
            </p>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              약 140m 그랜드 스트리트몰을 따라 이어지는 노출과 개방감.
              하늘채의 이름 아래, 걸음이 머무는 거리입니다.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** @deprecated Facade는 LifestylePremiumSection에 통합됨 — 호환용 */
export function FacadeStreetSection() {
  return null;
}

/** 업종 분위기 — /area 등에서 필요할 때 사용 (홈에서는 제외해 중복 방지) */
const AREA_FACILITIES = [
  {
    src: "/images/mood/academy.jpg",
    label: "학원가 · 교육",
    title: "매일 이어지는 학원가 반복수요",
    desc: "학생·학부모의 발걸음이 끊이지 않는 송도 학원 클러스터.",
  },
  {
    src: "/images/mood/retail.jpg",
    label: "앵커 · 리테일",
    title: "스트리트에 맞닿은 가시성",
    desc: "대형 스트리트몰 동선과 이어지는 1층 앵커 리테일.",
  },
  {
    src: "/images/mood/hospital.jpg",
    label: "메디컬 · 서비스",
    title: "배후세대의 생활밀착 수요",
    desc: "구매력 있는 배후를 위한 병원·클리닉 근린 수요.",
  },
  {
    src: "/images/mood/gym.jpg",
    label: "체류형 · 헬스",
    title: "머무름이 길어지는 목적형 앵커",
    desc: "한 번 오면 오래 머무는 체류형 업종의 고정 수요.",
  },
] as const;

export function AreaFacilitiesSection() {
  return (
    <section className="bg-[#f7f9fb]">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs tracking-[0.2em] text-muted uppercase">Tenant Mood</p>
        <h2 className="mt-2 text-center font-display text-2xl text-brand-deep md:text-3xl">
          업종이 그려내는 거리의 온도
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted md:text-base">
          교육·리테일·메디컬·체류형 — 층별 MD가 담는 분위기를 미리 느껴 보세요.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {AREA_FACILITIES.map((item) => (
            <figure
              key={item.label}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,40,60,0.08)]"
            >
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 550px"
                  quality={88}
                  className="object-cover"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-semibold tracking-wide text-accent">{item.label}</p>
                <h3 className="mt-1.5 font-display text-lg text-brand-deep">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          ※ 연출 이미지이며 실제 입점 업종·인테리어와 다를 수 있습니다.
        </p>
      </div>
    </section>
  );
}

/** 가치 요약 카드 — 스토리에서 이미 말한 내용을 ‘한눈에’만 */
export function PremiumEightSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          At a Glance
        </p>
        <h2 className="mt-2 text-center font-display text-3xl text-brand-deep md:text-4xl">
          아이비스퀘어 <span className="text-accent">PREMIUM 8</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted md:text-base">
          위에서 이야기한 가치를 여덟 가지로 압축했습니다.
        </p>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PREMIUM8.map((item, i) => (
            <li
              key={item.title}
              className="group overflow-hidden rounded-2xl bg-[#f7f9fb] shadow-[0_8px_28px_rgba(20,40,60,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(20,40,60,0.1)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
                  quality={88}
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 rounded-md bg-brand-deep/85 px-2 py-1 text-[11px] font-bold tracking-wide text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="px-4 py-4 text-left">
                <h3 className="font-display text-[17px] leading-snug text-brand-deep">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/plan"
            className="bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep"
          >
            호실·도면 보기
          </Link>
          <Link
            href="/contact"
            className="border border-brand/25 bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:-translate-y-0.5 hover:border-brand"
          >
            상담 신청
          </Link>
        </div>
      </div>
    </section>
  );
}
