import { Building, Floor } from "@/lib/types";
import { PLAN_MEDIA_GALLERY } from "@/lib/plan-media-gallery";

export type FloorPlanImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  videoSrc?: string;
};

function mdForFloor(floor: Floor): FloorPlanImage {
  const g = PLAN_MEDIA_GALLERY.find((x) => x.floor === floor) ?? PLAN_MEDIA_GALLERY[2];
  return {
    src: g.imageSrc,
    width: g.width,
    height: g.height,
    alt: g.alt,
    videoSrc: g.videoSrc,
  };
}

/** 층별 MD Plan (A·B동 동일 이미지 — 한 장에 양동 표기) */
export const FLOOR_PLAN_BY_BUILDING: Record<
  Floor,
  Record<Building, FloorPlanImage>
> = {
  B1: { A: mdForFloor("B1"), B: mdForFloor("B1") },
  "1F": { A: mdForFloor("1F"), B: mdForFloor("1F") },
  "2F": { A: mdForFloor("2F"), B: mdForFloor("2F") },
};

export const FLOOR_PLAN_IMAGES: Record<Floor, FloorPlanImage> = {
  B1: mdForFloor("B1"),
  "1F": mdForFloor("1F"),
  "2F": mdForFloor("2F"),
};

export const MD_PLAN_IMAGE = FLOOR_PLAN_IMAGES["2F"];

/** 층 필터 기준 MD Plan 1장 (A·B 포함) */
export function plansForFloor(
  floor: Floor,
  _building?: Building | "",
): { building: Building; plan: FloorPlanImage }[] {
  return [{ building: "A", plan: mdForFloor(floor) }];
}

export const DESIGN_PDF_HREF = "/docs/songdo-commercial-plans.pdf";

export type MoodImage = {
  src: string;
  alt: string;
  label: string;
};

export const FLOOR_MOOD_IMAGES: Record<
  Floor,
  { title: string; subtitle: string; images: MoodImage[] }
> = {
  "2F": {
    title: "병원 · 학원 이미지",
    subtitle: "교육·서비스 중심 층의 추천 업종 분위기",
    images: [
      {
        src: "/images/mood/hospital.jpg",
        alt: "근린 병원·클리닉 분위기",
        label: "병원 · 클리닉",
      },
      {
        src: "/images/mood/academy.jpg",
        alt: "학원·교육공간 분위기",
        label: "학원 · 교육",
      },
    ],
  },
  "1F": {
    title: "앵커 · 리테일 이미지",
    subtitle: "가시성·노출도 높은 1층 리테일 분위기",
    images: [
      {
        src: "/images/mood/retail.jpg",
        alt: "스트리트몰 리테일 분위기",
        label: "앵커 · 리테일",
      },
    ],
  },
  B1: {
    title: "헬스장 등 이미지",
    subtitle: "목적방문·체류형 대형 공간 분위기",
    images: [
      {
        src: "/images/mood/gym.jpg",
        alt: "헬스장·체류형 시설 분위기",
        label: "헬스 · 체류형",
      },
    ],
  },
};
