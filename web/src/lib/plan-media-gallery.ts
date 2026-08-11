export type PlanGalleryItem = {
  id: string;
  title: string;
  /** 도면 위 하드코딩 헤드라인 */
  headline: string;
  /** 도면 위 전문 카피 */
  copy: string;
  alt: string;
  imageSrc: string;
  videoSrc?: string;
  floor: "B1" | "1F" | "2F";
  width: number;
  height: number;
};

/**
 * 확인된 MD Plan 도면 (층당 A동·B동 한 장)
 * B1 / 1F / 2F — 카피는 UI에 하드코딩, 이미지에는 문구를 넣지 않음
 */
export const PLAN_MEDIA_GALLERY: PlanGalleryItem[] = [
  {
    id: "b1",
    floor: "B1",
    title: "MD Plan B1 · A·B동",
    headline: "MD Plan B1",
    copy: "엔터테인먼트 ZONE — 교습·운동·공방·스튜디오로 머무름을 만듭니다",
    alt: "MD Plan B1 — 엔터테인먼트·체류형 층 평면도 (A동·B동)",
    imageSrc: "/images/plans/md-b1.jpg",
    videoSrc: "/videos/plans/md-1f.mp4?v=b1swap",
    width: 1024,
    height: 638,
  },
  {
    id: "1f",
    floor: "1F",
    title: "MD Plan 1F · A·B동",
    headline: "MD Plan 1F",
    copy: "앵커·리테일 ZONE — 식음·카페·생활편의가 스트리트와 만납니다",
    alt: "MD Plan 1F — 앵커·리테일 층 평면도 (A동·B동)",
    imageSrc: "/images/plans/md-1f.jpg",
    videoSrc: "/videos/plans/gallery-01.mp4?v=1fswap",
    width: 1024,
    height: 653,
  },
  {
    id: "2f",
    floor: "2F",
    title: "MD Plan 2F · A·B동",
    headline: "MD Plan 2F",
    copy: "교육·케어 ZONE — 학원·메디컬·뷰티·금융이 모이는 생활 밀착층",
    alt: "MD Plan 2F — 교육·케어 층 평면도 (A동·B동)",
    imageSrc: "/images/plans/md-2f.jpg",
    videoSrc: "/videos/plans/md-2f.mp4?v=2f",
    width: 1024,
    height: 622,
  },
];
