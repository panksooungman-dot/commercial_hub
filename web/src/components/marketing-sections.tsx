import Image from "next/image";
import Link from "next/link";

const PREMIUM6 = [
  {
    src: "/images/mood/academy.jpg",
    title: "송도를 대표하는 학원가",
    desc: "송도 1공구 아이비 학원가 거리의 중심",
    alt: "송도 아이비 학원가 교육 상권 분위기",
  },
  {
    src: "/images/marketing/ivysquare-night.png",
    title: "뉴욕풍 랜드마크 디자인",
    desc: "차별화된 외관으로 품격 높은 소비 공간",
    alt: "아이비스퀘어 야간 랜드마크 외관",
  },
  {
    src: "/images/marketing/lifestyle-garden.png",
    title: "고소득 배후수요 초밀집",
    desc: "인근 약 1만 6천여 세대의 풍부한 수요",
    alt: "단지 내 라이프와 배후 주거 수요",
  },
  {
    src: "/images/mood/train.jpg",
    title: "갈수록 빛나는 미래가치",
    desc: "송도 GTX, K-바이오 랩허브 등 개발호재",
    alt: "송도 GTX 고속열차 터널 주행 이미지",
  },
  {
    src: "/images/marketing/facade-street.png",
    title: "시선이 가는 스트리트몰",
    desc: "약 140m, 3개 층 규모의 복합상업시설",
    alt: "약 140m 그랜드 스트리트몰 외관",
  },
  {
    src: "/images/marketing/ivysquare-twilight.jpg",
    title: "365일 활발한 핵심상권",
    desc: "아파트 입주민, 인근 거주자, 방문객 수요",
    alt: "아이비스퀘어 황혼 외관과 핵심 상권",
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
            ‘송도의 대치동’이 품은
            <span className="mt-1 block text-brand">불패 상권의 중심</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            아이비 학원가의 반복 수요, 약 1만 6천여 배후세대, 약 140m 스트리트 파사드.
            아이비스퀘어는 교육이 중심이 되는 자리에서 상가의 이유를 만듭니다.
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
                약 280여 교육 클래스와
                <br />
                7개 명문학교가 만드는 동선
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
                송도 1공구 아이비 학원가 거리. 포스코고 등 명문학교와 학원 클러스터가
                학생·학부모의 발길을 매일 이어 줍니다. GTX·K-바이오 랩허브 호재는 그 반경을
                더 넓힙니다.
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
              03 · Street — 뉴욕풍 스트리트, 시선이 모이는 140m
            </p>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              3개 층 규모의 복합상업시설. 차별화된 외관 특화 디자인으로 주변 상가와 다른
              고급 소비공간을 만듭니다.
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

const COMMUNITY_PLANS = [
  {
    src: "/images/community/community-plan-a-1f.png",
    alt: "A Block 1F 어린이집 평면도",
    width: 435,
    height: 248,
    desc: "영유아 자녀를 안심하고 맡길 수 있는 단지 내 보육시설",
  },
  {
    src: "/images/community/community-plan-a-b1.png",
    alt: "A Block B1 작은도서관·실내놀이터 평면도",
    width: 493,
    height: 245,
    desc: "엄마와 아기가 함께 즐겁고 여유로운 시간을 보낼 수 있는 공간",
  },
  {
    src: "/images/community/community-plan-b-b1.png",
    alt: "B Block B1 주민카페·경로당 평면도",
    width: 430,
    height: 265,
    desc: "친목을 도모하고 문화생활을 즐길 수 있는 어르신들과 주민들의 쉼터",
  },
] as const;

/** 단지 내 커뮤니티 시설 — 스트리트 조감·유아놀이터·헬시가든·근생 평면도 */
export function CommunitySection() {
  return (
    <section className="bg-[#f7f9fb]">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-xs font-semibold tracking-[0.22em] text-brand uppercase">
          Signature Community
        </p>
        <h2 className="mt-3 text-center font-display text-2xl leading-snug text-brand-deep md:text-3xl">
          생활의 가치를 높이는
          <span className="mt-1 block text-brand">커뮤니티를 누리다!</span>
        </h2>

        <figure className="mt-10 overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(20,40,60,0.08)]">
          <Image
            src="/images/community/community-street.jpg"
            alt="단지 내 그랜드 스트리트몰 커뮤니티 조감"
            width={719}
            height={455}
            quality={90}
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="h-auto w-full"
          />
        </figure>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl shadow-[0_8px_28px_rgba(20,40,60,0.06)]">
            <Image
              src="/images/community/community-playground.jpg"
              alt="유아놀이터"
              width={349}
              height={300}
              quality={88}
              sizes="(max-width: 640px) 100vw, 540px"
              className="h-auto w-full"
            />
          </figure>
          <figure className="overflow-hidden rounded-2xl shadow-[0_8px_28px_rgba(20,40,60,0.06)]">
            <Image
              src="/images/community/community-garden.jpg"
              alt="헬시가든 (A블록/B블록)"
              width={349}
              height={300}
              quality={88}
              sizes="(max-width: 640px) 100vw, 540px"
              className="h-auto w-full"
            />
          </figure>
        </div>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted">
          헬시가든은 입주민들의 건강한 생활을 유지해 주는 쾌적한 공간입니다.
        </p>

        <div className="mt-16 text-center md:mt-20">
          <h3 className="font-display text-2xl leading-snug text-brand-deep sm:text-[1.7rem]">
            다양한 여가를 가득히!
            <br />
            일상에 특별함은 넉넉히!
          </h3>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {COMMUNITY_PLANS.map((plan) => (
            <figure
              key={plan.src}
              className="overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_8px_28px_rgba(20,40,60,0.06)]"
            >
              <Image
                src={plan.src}
                alt={plan.alt}
                width={plan.width}
                height={plan.height}
                quality={90}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-auto w-full"
              />
              <figcaption className="px-5 py-4">
                <p className="text-sm leading-relaxed text-muted">{plan.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <figure className="mt-10 overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_8px_28px_rgba(20,40,60,0.06)]">
          <Image
            src="/images/community/community-floor-diagram.png"
            alt="2F·1F·B1 커뮤니티 시설 배치도"
            width={413}
            height={385}
            quality={90}
            sizes="(max-width: 768px) 100vw, 700px"
            className="mx-auto h-auto w-full max-w-xl"
          />
          <figcaption className="border-t border-line/60 px-5 py-4 text-sm leading-relaxed text-muted">
            근린생활시설은 단지 안에서 생활에 필요한 모든 것을 누리는 원스톱 라이프를
            제공합니다.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** 가치 요약 카드 — PPT PREMIUM 6 카피 반영 */
export function PremiumEightSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-sm font-medium text-brand md:text-base">
          송도 하늘채 아이비원{" "}
          <span className="font-semibold text-brand-deep">단지 내 상가</span>
        </p>
        <h2 className="mt-2 text-center font-display text-3xl tracking-wide text-brand-deep md:text-5xl">
          PREMIUM <span className="text-accent">6</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted md:text-base">
          학원가·배후수요·스트리트몰·미래가치까지, 상가의 이유를 여섯 가지로 압축했습니다.
        </p>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2">
          {PREMIUM6.map((item, i) => (
            <li
              key={item.title}
              className="group overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_8px_28px_rgba(20,40,60,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(20,40,60,0.1)]"
            >
              <div className="relative overflow-hidden bg-[#eef2f6]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={500}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  quality={88}
                  className="aspect-[16/10] h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 rounded-md bg-brand-deep/85 px-2 py-1 text-[11px] font-bold tracking-wide text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="px-5 py-4 text-left">
                <h3 className="font-display text-lg leading-snug text-brand-deep md:text-xl">
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
