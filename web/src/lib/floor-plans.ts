import { Floor } from "@/lib/types";

export const FLOOR_PLAN_IMAGES: Record<
  Floor,
  { src: string; width: number; height: number; alt: string }
> = {
  "2F": {
    src: "/images/plans/md-2f.jpg",
    width: 1024,
    height: 795,
    alt: "MD Plan 2F — 교육·서비스 층 평면도 (A동·B동)",
  },
  "1F": {
    src: "/images/plans/md-1f.jpg",
    width: 1024,
    height: 843,
    alt: "MD Plan 1F — 앵커·리테일 층 평면도 (A동·B동)",
  },
  B1: {
    src: "/images/plans/md-b1.jpg",
    width: 1024,
    height: 941,
    alt: "MD Plan B1 — 목적방문·체류형 층 평면도 (A동·B동)",
  },
};

export type MoodImage = {
  src: string;
  alt: string;
  label: string;
};

/** 리플렛 MD 플레이스홀더(병원/학원·리테일·헬스장) 대체 이미지 */
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
