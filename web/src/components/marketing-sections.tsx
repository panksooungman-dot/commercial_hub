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
    desc: "단지 인근 송도 GTX, K바이오 랩허브",
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
    desc: "높은 대출 한도, 수익형 선호 상승",
    alt: "스트리트 리테일 상가 분위기",
  },
] as const;

export function BrandStorySection() {
  return (
    <section className="bg-[#eceef1]">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs tracking-[0.2em] text-muted uppercase">Kolon Global</p>
        <h2 className="mt-2 text-center font-display text-2xl text-brand-deep md:text-3xl">
          남다른 건축미학의 자부심
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted md:text-base">
          코오롱글로벌이 송도에서 선보이는 새로운 랜드마크, 아이비스퀘어
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
 * 라이프스타일 → 상권 수요로 이어지는 분양 카피 섹션
 * (학세권·스트리트몰·교통 호재 → 헬시가든·근린생활시설)
 */
export function LifestylePremiumSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(165deg,#d9e6f0_0%,#eef3f7_38%,#f7f9fb_100%)]">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#9bb8ce]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-10 h-56 w-56 rounded-full bg-[#c4a35a]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1100px] px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-hero-fade-up text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            Songdo Hanulche Ivyone
          </p>
          <h2 className="animate-hero-fade-up mt-3 font-display text-[1.85rem] leading-tight text-brand-deep [animation-delay:80ms] sm:text-4xl md:text-[2.65rem]">
            삶이 머무는 자리에,
            <span className="mt-1 block text-brand">상권이 자랍니다</span>
          </h2>
          <p className="animate-hero-fade-up mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted [animation-delay:160ms] sm:text-base">
            학세권의 반복 수요, 약 140m 그랜드 스트리트몰의 시선, 송도를 여는 대형 교통 호재.
            아이비원은 단지 안 라이프가 곧 상가의 고정 수요가 되는 구조를 갖췄습니다.
          </p>
        </div>

        <div className="mt-14 space-y-14 md:mt-16 md:space-y-20">
          <article className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <figure className="animate-hero-fade-up order-2 overflow-hidden [animation-delay:200ms] md:order-1">
              <Image
                src="/images/marketing/lifestyle-premium.png"
                alt="송도 하늘채 아이비원 — 학세권·그랜드 스트리트몰·교통 호재"
                width={1024}
                height={689}
                quality={90}
                sizes="(max-width: 768px) 100vw, 540px"
                className="h-auto w-full transition duration-700 ease-out hover:scale-[1.015]"
              />
            </figure>
            <div className="animate-hero-fade-up order-1 [animation-delay:260ms] md:order-2">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Location · Street · Transit
              </p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-brand-deep sm:text-[1.75rem]">
                학세권이 사람을 모으고,
                <br />
                스트리트몰이 시선을 붙잡습니다
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                수도권 대표 학원가와 맞닿은 입지. 학생과 학부모의 발길이 매일 이어지는 동선 위에,
                약 140m 그랜드 스트리트몰이 단지 앞을 관통합니다. 여기에 송도발 GTX·KTX,
                제2공항철도 구상까지 더해지며 송도는 전국을 반나절 생활권으로 묶는 거점으로
                도약합니다.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-deep/85 sm:text-base">
                사람이 모이는 자리에는, 자연스럽게 매출의 기회가 열립니다.
              </p>
            </div>
          </article>

          <article className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="animate-hero-fade-up [animation-delay:200ms]">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Healthy Garden · Daily Retail
              </p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-brand-deep sm:text-[1.75rem]">
                단지 안에서 완성되는
                <br />
                원스톱 라이프
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                헬시가든이 일상의 여유를 채우고, 근린생활시설이 생활 밀착 소비를 받칩니다.
                입주민이 단지 안에서 머무를수록 상가의 고정 수요는 더 단단해집니다.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-deep/85 sm:text-base">
                아이비원 상가는 멀리서 사람을 끌어오는 상권이 아니라,
                가장 가까운 곳에서 반복 구매가 일어나는 상권입니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/plan"
                  className="bg-brand px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-brand-deep"
                >
                  호실·도면 보기
                </Link>
                <Link
                  href="/contact"
                  className="border border-brand/30 bg-white/70 px-5 py-3 text-sm font-semibold text-brand transition duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-white"
                >
                  상담 신청
                </Link>
              </div>
            </div>
            <figure className="animate-hero-fade-up [animation-delay:280ms]">
              <Image
                src="/images/marketing/lifestyle-garden.png"
                alt="헬시가든과 근린생활시설 — 단지 안 원스톱 라이프"
                width={1024}
                height={582}
                quality={90}
                sizes="(max-width: 768px) 100vw, 540px"
                className="h-auto w-full transition duration-700 ease-out hover:scale-[1.015]"
              />
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}

/**
 * 사업개요 직전 — 스트리트형 상가 외관 비주얼
 */
export function FacadeStreetSection() {
  return (
    <section className="bg-[#f0f3f6]">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-4 pt-10 text-center sm:px-6 sm:pt-12 md:pt-14">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            Street Retail · Hanulche Ivyone
          </p>
          <h2 className="mt-3 font-display text-2xl leading-snug text-brand-deep sm:text-3xl md:text-[2.15rem]">
            시선이 머무는 스트리트,
            <span className="mt-1 block">매출이 열리는 파사드</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
            통유리 전면과 정돈된 간판 라인, 대로변을 따라 이어지는 연도형 상가.
            하늘채의 브랜드 아래, 걸음이 곧 기회가 되는 거리입니다.
          </p>
        </div>
        <figure className="mt-8 overflow-hidden sm:mt-10">
          <Image
            src="/images/marketing/facade-street.png"
            alt="송도 하늘채 아이비원 — 스트리트형 상업시설 외관"
            width={1024}
            height={444}
            quality={92}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="h-auto w-full"
          />
        </figure>
      </div>
    </section>
  );
}

const AREA_FACILITIES = [
  {
    src: "/images/mood/academy.jpg",
    label: "학원가 · 교육",
    title: "매일 이어지는 학원가 반복수요",
    desc: "채드윅 국제학교·포스코고·신정초까지, 학생·학부모의 발걸음이 끊이지 않는 송도 학원 클러스터.",
  },
  {
    src: "/images/mood/retail.jpg",
    label: "앵커 · 리테일",
    title: "그랜드 스트리트몰과 맞닿은 노출",
    desc: "약 140m 대형 스트리트몰 동선과 이어지는 1층 앵커 리테일, 가시성 높은 파사드 구성.",
  },
  {
    src: "/images/mood/hospital.jpg",
    label: "메디컬 · 서비스",
    title: "고소득 배후세대의 생활밀착 수요",
    desc: "1공구 랜드마크 아파트 밀집 지역, 구매력 있는 배후 세대를 위한 병원·클리닉 근린 수요.",
  },
  {
    src: "/images/mood/gym.jpg",
    label: "체류형 · 헬스",
    title: "머무는 시간이 길어지는 체류형 앵커",
    desc: "대형 공간을 활용한 헬스장 등 목적방문형 업종으로, 한 번 오면 오래 머무는 고정 수요를 만듭니다.",
  },
] as const;

export function AreaFacilitiesSection() {
  return (
    <section className="bg-[#f7f9fb]">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs tracking-[0.2em] text-muted uppercase">
          Real Area Value
        </p>
        <h2 className="mt-2 text-center font-display text-2xl text-brand-deep md:text-3xl">
          상권은 숫자가 아니라, 매일의 발걸음으로 증명됩니다
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted md:text-base">
          송도 최고 수준의 교육 인프라와 고소득 배후수요가 결합된 핵심 상권,
          아이비스퀘어가 그 중심에 섭니다
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
          ※ 상단 이미지는 상권·업종 분위기를 전달하기 위한 연출 이미지이며, 실제 입점 업종·인테리어와 다를 수 있습니다.
        </p>
      </div>
    </section>
  );
}

export function PremiumEightSection() {
  return (
    <section className="bg-[#f4f6f8]">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Premium Value
        </p>
        <h2 className="mt-2 text-center font-display text-3xl text-brand-deep md:text-4xl">
          아이비스퀘어 <span className="text-accent">PREMIUM 8</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted md:text-base">
          학원가·배후수요·스트리트몰부터 교통·기업 호재까지, 스케일이 다른 투자가치
        </p>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PREMIUM8.map((item, i) => (
            <li
              key={item.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-[0_10px_32px_rgba(20,40,60,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,40,60,0.12)]"
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
                <span className="absolute left-3 top-3 rounded-md bg-brand-deep/85 px-2 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-[1px]">
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
      </div>
    </section>
  );
}
