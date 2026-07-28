"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FloorPlanFigure,
  type PlanHighlight,
} from "@/components/floor-plan-figure";
import { DESIGN_PDF_HREF } from "@/lib/floor-plans";
import { PLAN_MEDIA_GALLERY, type PlanGalleryItem } from "@/lib/plan-media-gallery";
import { Building, Floor, UnitStatus } from "@/lib/types";

const FLOOR_LABEL: Record<Floor, string> = {
  B1: "지하1층 · A·B동",
  "1F": "지상1층 · A·B동",
  "2F": "지상2층 · A·B동",
};

type PlanPin = {
  id: string;
  building: Building;
  unitNo: string;
  status?: Exclude<UnitStatus, "hidden">;
  href?: string;
};

export function PlanMediaGallery({
  floor,
  building = "",
  pins = [],
  highlights = [],
}: {
  floor: Floor;
  building?: Building | "";
  /** 해당 층 A·B 전체 핀 */
  pins?: PlanPin[];
  /** 선택 호실 강조(최대 3) */
  highlights?: PlanHighlight[];
}) {
  const router = useRouter();
  const [activeFloor, setActiveFloor] = useState<Floor>(floor);

  useEffect(() => {
    setActiveFloor(floor);
  }, [floor]);

  const current =
    PLAN_MEDIA_GALLERY.find((g) => g.floor === activeFloor) ?? PLAN_MEDIA_GALLERY[2];

  function select(item: PlanGalleryItem) {
    setActiveFloor(item.floor);
    const params = new URLSearchParams();
    params.set("floor", item.floor);
    if (building === "A" || building === "B") params.set("building", building);
    router.push(`/plan?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-brand-deep sm:text-2xl">MD Plan · 층별 도면</h2>
          <p className="mt-1 text-sm text-muted">
            각 도면에 A동·B동이 함께 표시됩니다. 층을 선택하면 아래 호실 목록도 맞춰집니다.
          </p>
        </div>
        <Link
          href={DESIGN_PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs text-brand underline"
        >
          설계도면 PDF 보기
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {PLAN_MEDIA_GALLERY.map((g) => {
          const active = g.floor === current.floor;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => select(g)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                active
                  ? "bg-brand-deep text-white"
                  : "border border-line bg-surface text-muted hover:border-brand"
              }`}
            >
              {g.title}
              <span className="opacity-80"> · {FLOOR_LABEL[g.floor].split(" · ")[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="border-b border-line px-4 py-4 sm:px-5 sm:py-5">
            <p className="font-display text-2xl tracking-tight text-brand-deep sm:text-3xl">
              {current.headline}
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {current.copy}
            </p>
          </div>
          <div className="px-2 pb-2 sm:px-3 sm:pb-3">
            <FloorPlanFigure
              floor={current.floor}
              showMood={false}
              showPins
              compact
              pins={pins}
              highlights={highlights}
              className="!scroll-mt-0 space-y-3"
            />
          </div>
        </div>

        {current.videoSrc ? (
          <figure className="overflow-hidden rounded-2xl border border-line bg-white">
            <video
              key={current.videoSrc}
              src={current.videoSrc}
              controls
              playsInline
              preload="metadata"
              className="h-auto w-full bg-transparent object-contain"
            >
              브라우저가 영상을 지원하지 않습니다.
            </video>
            <figcaption className="border-t border-line px-4 py-2 text-xs text-muted">
              {current.title} · 도면 안내 영상
            </figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}
