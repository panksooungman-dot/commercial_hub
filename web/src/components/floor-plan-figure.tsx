import Image from "next/image";
import { FLOOR_MOOD_IMAGES, FLOOR_PLAN_IMAGES } from "@/lib/floor-plans";
import { estimateUnitPin } from "@/lib/unit-pins";
import { Building, Floor } from "@/lib/types";
import { unitLabel } from "@/lib/format";

type Highlight = {
  building: Building;
  unitNo: string;
  /** 같은 층·동의 호실번호 목록(핀 배치용) */
  siblings: string[];
};

export function FloorPlanFigure({
  floor,
  className = "",
  showMood = true,
  highlight,
}: {
  floor: Floor;
  className?: string;
  showMood?: boolean;
  highlight?: Highlight;
}) {
  const plan = FLOOR_PLAN_IMAGES[floor];
  const mood = FLOOR_MOOD_IMAGES[floor];
  if (!plan) return null;

  const pin =
    highlight &&
    estimateUnitPin(highlight.building, highlight.unitNo, highlight.siblings);

  return (
    <div id="floor-plan" className={`scroll-mt-24 space-y-6 ${className}`}>
      {highlight ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-[#fff8e8] px-4 py-3">
          <p className="text-sm text-brand-deep">
            <span className="font-semibold text-brand">
              {unitLabel(highlight.building, highlight.unitNo)}
            </span>
            <span className="text-muted"> 호실이 도면에 표시됩니다.</span>
          </p>
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
            {floor} 평면도
          </span>
        </div>
      ) : null}

      <figure className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="relative w-full">
          <Image
            src={plan.src}
            alt={plan.alt}
            width={plan.width}
            height={plan.height}
            quality={88}
            sizes="(max-width: 1152px) 100vw, 1100px"
            className="h-auto w-full"
            priority={Boolean(highlight)}
          />

          {highlight && pin ? (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              aria-label={`${unitLabel(highlight.building, highlight.unitNo)} 위치`}
            >
              <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-[#c45c2a]/35" />
              <div className="relative flex flex-col items-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#c45c2a] text-[11px] font-bold text-white shadow-lg">
                  {highlight.unitNo.replace(/^B-/, "")}
                </span>
                <span className="mt-1 whitespace-nowrap rounded-md bg-[#c45c2a] px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                  {unitLabel(highlight.building, highlight.unitNo)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
        <figcaption className="border-t border-line px-4 py-2 text-xs text-muted">
          {plan.alt}
          {highlight
            ? ` · 선택 호실 ${unitLabel(highlight.building, highlight.unitNo)} 표시`
            : " · 리플렛 제안 도면"}
        </figcaption>
      </figure>

      {showMood && mood ? (
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <h3 className="font-display text-lg text-brand-deep sm:text-xl">{mood.title}</h3>
          <p className="mt-1 text-sm text-muted">{mood.subtitle}</p>
          <div
            className={`mt-4 grid gap-4 ${
              mood.images.length > 1 ? "sm:grid-cols-2" : "max-w-2xl"
            }`}
          >
            {mood.images.map((img) => (
              <figure
                key={img.src}
                className="overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={88}
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-3 py-2 text-sm font-medium text-brand">
                  {img.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
