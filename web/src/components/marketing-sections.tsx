import Image from "next/image";

const PREMIUM8 = [
  {
    emoji: "🎓",
    title: "수도권 대표 학원가",
    desc: "송도 1공구 학원가 거리",
  },
  {
    emoji: "🏘️",
    title: "초밀집 배후수요",
    desc: "단지 인근 약 1만 5천여 세대",
  },
  {
    emoji: "🏬",
    title: "그랜드 스트리트몰",
    desc: "약 140m, 3개 층 대형 상업시설",
  },
  {
    emoji: "🏗️",
    title: "코오롱 혁신설계",
    desc: "코오롱글로벌의 앞선 시공력",
  },
  {
    emoji: "🚄",
    title: "획기적 대형호재",
    desc: "단지 인근 송도 GTX, K바이오 랩허브",
  },
  {
    emoji: "🏢",
    title: "연이은 기업입주",
    desc: "셀트리온, 삼성바이오로직스 등",
  },
  {
    emoji: "🛒",
    title: "365일 상권",
    desc: "아파트 입주민의 고정수요",
  },
  {
    emoji: "💹",
    title: "규제 덜한 수익형 상가",
    desc: "높은 대출 한도, 수익형 선호 상승",
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
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-16">
        <p className="text-center text-sm font-medium text-[#1a2a4a]">
          송도 유일 압도적 투자 가치
        </p>
        <h2 className="mt-2 text-center font-display text-3xl text-[#1a2a4a] md:text-4xl">
          아이비스퀘어 <span className="text-[#b8954a]">PREMIUM 8</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted">
          학원가·배후수요·스트리트몰부터 교통·기업 호재까지, 스케일이 다른 투자가치
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PREMIUM8.map((item, i) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[#d8c49a]/70 bg-[#fcfbf8] px-4 py-5 text-center"
            >
              <span className="text-3xl leading-none" aria-hidden>
                {item.emoji}
              </span>
              <p className="mt-3 text-xs font-semibold tracking-wide text-[#b8954a]">
                0{i + 1}
              </p>
              <h3 className="mt-1 font-display text-base text-[#1a2a4a] md:text-[17px]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted md:text-sm">({item.desc})</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
