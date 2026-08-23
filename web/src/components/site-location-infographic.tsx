import Image from "next/image";
import {
  SITE_LOCATION,
  googleMapUrl,
  kakaoMapUrl,
  naverMapUrl,
} from "@/lib/site-location";

/** 대상지 상권 반경(500m/1km) 지도 — 지역도 자세히보기 패널에서 사용 */
const INFOGRAPHIC = {
  src: "/images/site-location-radius-map.svg",
  width: 1400,
  height: 1080,
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
          alt="대상지 상권 500m·1km 반경 지도"
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
