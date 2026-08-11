import Image from "next/image";
import {
  SITE_LOCATION,
  googleMapUrl,
  kakaoMapUrl,
  naverMapUrl,
} from "@/lib/site-location";

/** 원본 인포그래픽 전체 — 지도·단지·세대수·하단 포인트 포함 */
const INFOGRAPHIC = {
  src: "/images/site-location-infographic.png",
  width: 629,
  height: 644,
} as const;

/**
 * 입지 인포그래픽
 * SVG 오버레이 마커는 좌표 불일치·이미지 미표시 이슈가 있어
 * 원본 PNG를 그대로 쓰고, 외부 지도 링크만 추가합니다.
 */
export function SiteLocationInfographic() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_32px_rgba(8,38,60,0.06)]">
      <figure className="bg-white">
        <Image
          src={INFOGRAPHIC.src}
          alt="송도 아이비 학원가 랜드마크 상업시설 — 1공구 입지·단지·세대수"
          width={INFOGRAPHIC.width}
          height={INFOGRAPHIC.height}
          quality={95}
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="h-auto w-full"
          priority
        />
      </figure>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-[#f7f9fb] px-5 py-3 md:px-8">
        <p className="text-xs text-muted">{SITE_LOCATION.address}</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={naverMapUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line bg-white px-3 py-1.5 text-xs text-brand hover:bg-[#f0f4f8]"
          >
            네이버 지도
          </a>
          <a
            href={kakaoMapUrl(SITE_LOCATION.lat, SITE_LOCATION.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line bg-white px-3 py-1.5 text-xs text-brand hover:bg-[#f0f4f8]"
          >
            카카오맵
          </a>
          <a
            href={googleMapUrl(SITE_LOCATION.lat, SITE_LOCATION.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line bg-white px-3 py-1.5 text-xs text-brand hover:bg-[#f0f4f8]"
          >
            Google 지도
          </a>
        </div>
      </div>
    </div>
  );
}
