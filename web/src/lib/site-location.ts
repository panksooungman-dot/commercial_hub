/** 송도 하늘채 아이비원 — 컨벤시아대로42번길 21 */
export const SITE_LOCATION = {
  address: "인천광역시 연수구 컨벤시아대로42번길 21",
  shortAddress: "연수구 컨벤시아대로42번길 21",
  name: "송도 하늘채 아이비원",
  sublabel: "단지 내 상가",
  lat: 37.399274,
  lng: 126.650016,
  zoom: 14,
} as const;

export type NearbyKind = "school" | "park" | "transit" | "residential" | "academy";

export type NearbyPlace = {
  name: string;
  detail?: string;
  lat: number;
  lng: number;
  kind: NearbyKind;
  /** 지도에 항상 라벨 표시 */
  showLabel?: boolean;
};

/** 아이비 학원가·상권 존 */
export const ACADEMY_ZONE = {
  center: [37.3999, 126.6502] as [number, number],
  radiusM: 450,
  label: "송도 아이비 학원가",
  sublabel: "주거밀착 · 학원상권",
};

/**
 * 사업지 주변 주요 시설
 * 좌표는 공개 지도 기준 개략값이며, 홍보용 표시용입니다.
 */
export const NEARBY_PLACES: NearbyPlace[] = [
  // —— 학교 ——
  {
    name: "채드윅송도국제학교",
    detail: "CHADWICK INTERNATIONAL",
    lat: 37.40112,
    lng: 126.64782,
    kind: "school",
    showLabel: true,
  },
  {
    name: "인천포스코고등학교",
    lat: 37.40186,
    lng: 126.65422,
    kind: "school",
    showLabel: true,
  },
  {
    name: "명선초등학교",
    lat: 37.40308,
    lng: 126.65142,
    kind: "school",
  },
  {
    name: "신송중학교",
    lat: 37.40255,
    lng: 126.64805,
    kind: "school",
  },
  {
    name: "연송고등학교",
    lat: 37.4021,
    lng: 126.64855,
    kind: "school",
  },
  {
    name: "신정초등학교",
    lat: 37.3984,
    lng: 126.6482,
    kind: "school",
  },

  // —— 공원·교통 ——
  {
    name: "송도 센트럴파크",
    detail: "여가·문화 상권",
    lat: 37.39248,
    lng: 126.63452,
    kind: "park",
    showLabel: true,
  },
  {
    name: "센트럴파크역",
    detail: "인천1호선",
    lat: 37.39328,
    lng: 126.63401,
    kind: "transit",
    showLabel: true,
  },
  {
    name: "국제업무지구역",
    detail: "인천1호선",
    lat: 37.39995,
    lng: 126.63055,
    kind: "transit",
    showLabel: true,
  },

  // —— 배후 주거 (인포그래픽 주요 단지) ——
  {
    name: "더샵 퍼스트파크",
    detail: "13~15블럭 · 약 2,597세대",
    lat: 37.3968,
    lng: 126.6435,
    kind: "residential",
    showLabel: true,
  },
  {
    name: "더샵 마스터뷰",
    detail: "21~23블록 · 약 1,937세대",
    lat: 37.3982,
    lng: 126.6412,
    kind: "residential",
    showLabel: true,
  },
  {
    name: "더샵 그린워크",
    detail: "1~3차 · 약 2,184세대",
    lat: 37.4035,
    lng: 126.6408,
    kind: "residential",
    showLabel: true,
  },
  {
    name: "더샵 그린에비뉴",
    detail: "7·8단지 · 약 1,014세대",
    lat: 37.4015,
    lng: 126.6528,
    kind: "residential",
  },
  {
    name: "더샵 하버뷰",
    detail: "13~15단지 · 약 1,607세대",
    lat: 37.3996,
    lng: 126.6468,
    kind: "residential",
    showLabel: true,
  },
  {
    name: "푸르지오 하버뷰",
    detail: "593세대",
    lat: 37.39762,
    lng: 126.64482,
    kind: "residential",
  },
  {
    name: "자이 하버뷰",
    detail: "1·2단지 · 약 1,069세대",
    lat: 37.3964,
    lng: 126.6455,
    kind: "residential",
  },
  {
    name: "더샵 센트럴파크",
    detail: "1·2차 · 약 1,361세대",
    lat: 37.39582,
    lng: 126.63742,
    kind: "residential",
    showLabel: true,
  },
  {
    name: "센트럴파크 푸르지오",
    detail: "551세대",
    lat: 37.3948,
    lng: 126.6398,
    kind: "residential",
  },
  {
    name: "풍림아이원",
    detail: "1~3단지 · 약 2,486세대",
    lat: 37.3972,
    lng: 126.6558,
    kind: "residential",
    showLabel: true,
  },
  {
    name: "힐스테이트 송도",
    detail: "3~6단지",
    lat: 37.3955,
    lng: 126.6525,
    kind: "residential",
  },
  {
    name: "아트윈 푸르지오",
    detail: "999세대",
    lat: 37.3942,
    lng: 126.6415,
    kind: "residential",
  },
];

export const MAP_LEGEND: { kind: NearbyKind; label: string; color: string }[] = [
  { kind: "academy", label: "학원가·상권", color: "#e85d5d" },
  { kind: "school", label: "학교·교육", color: "#3d6a9e" },
  { kind: "residential", label: "배후 주거", color: "#8a9aaa" },
  { kind: "park", label: "공원·여가", color: "#5a9e58" },
  { kind: "transit", label: "교통", color: "#0b3a5b" },
];

export const LOCATION_HIGHLIGHTS = [
  {
    title: "송도 최고수준 학원가",
    body: "교육 시설 밀집과 학생 중심 소비수요가 풍부한 아이비 학원가. 채드윅송도국제학교·포스코고 등 수도권 최고 스쿨존과 맞닿아 있습니다.",
  },
  {
    title: "고소득 배후수요 기반 소비 상권",
    body: "인근 고소득 대단지 거주민의 높은 소득·소비력이 상권을 지탱합니다. 주거밀집 배후와 학원상권이 한 자리에서 겹칩니다.",
  },
  {
    title: "센트럴파크 연계 여가·문화 상권",
    body: "센트럴파크·아트센터 등 외부 방문객 유입으로 체류·여가 수요까지 확보합니다. 상주 수요와 방문 수요가 함께 흐르는 입지입니다.",
  },
] as const;

export function naverMapUrl() {
  return `https://map.naver.com/v5/search/${encodeURIComponent(SITE_LOCATION.address)}`;
}

export function kakaoMapUrl(lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(SITE_LOCATION.name)},${lat},${lng}`;
}

export function googleMapUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
