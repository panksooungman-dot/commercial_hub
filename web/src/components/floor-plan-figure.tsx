import Image from "next/image";
import Link from "next/link";
import { FLOOR_MOOD_IMAGES, plansForFloor } from "@/lib/floor-plans";
import { estimateUnitPin } from "@/lib/unit-pins";
import { Building, Floor, UnitStatus } from "@/lib/types";
import { unitLabel } from "@/lib/format";

export type PlanHighlight = {
  building: Building;
  unitNo: string;
  /** 같은 층·동의 호실번호 목록(핀 배치용) */
  siblings?: string[];
  /** 관심 목록에서의 번호(1~3). 없으면 배열 순번 사용 */
  mark?: number;
};

type PlanPin = {
  id: string;
  building: Building;
  unitNo: string;
  status?: Exclude<UnitStatus, "hidden">;
  href?: string;
};

const PIN_DOT: Record<Exclude<UnitStatus, "hidden">, string> = {
  available: "bg-[#d63c3c]",
  reserved: "bg-[#c48520]",
  sold: "bg-[#6a6a6a]",
  move_in: "bg-[#2d6eaa]",
};

/** 선택 호실 구분용 (1·2·3번째) — 색·라벨로 바로 구분 */
export const HIGHLIGHT_STYLES = [
  {
    bg: "bg-[#c45c2a]",
    ping: "bg-[#c45c2a]/40",
    ring: "border-[#c45c2a]",
    hex: "#c45c2a",
    label: "선택 1",
  },
  {
    bg: "bg-[#0b5f8a]",
    ping: "bg-[#0b5f8a]/40",
    ring: "border-[#0b5f8a]",
    hex: "#0b5f8a",
    label: "선택 2",
  },
  {
    bg: "bg-[#5a7a2e]",
    ping: "bg-[#5a7a2e]/40",
    ring: "border-[#5a7a2e]",
    hex: "#5a7a2e",
    label: "선택 3",
  },
] as const;

function pinKey(building: Building, unitNo: string) {
  return `${building}-${unitNo}`;
}

export function FloorPlanFigure({
  floor,
  building = "",
  className = "",
  showMood = true,
  highlight,
  highlights,
  pins = [],
  hideDimPins = false,
  /** 구 MD 좌표 핀 — 3D 도면에는 기본 비표시 */
  showPins = false,
}: {
  floor: Floor;
  /** 동 필터. 비우면 A·B 모두 표시 */
  building?: Building | "";
  className?: string;
  showMood?: boolean;
  /** @deprecated highlights 사용 권장 */
  highlight?: PlanHighlight;
  /** 선택 호실(최대 3) — 도면에 강조 표시 */
  highlights?: PlanHighlight[];
  /** 층 전체 호실 핀 */
  pins?: PlanPin[];
  /** true면 선택 호실만 표시(나머지 작은 핀 숨김) */
  hideDimPins?: boolean;
  showPins?: boolean;
}) {
  const plans = plansForFloor(floor, building);
  const mood = FLOOR_MOOD_IMAGES[floor];
  if (plans.length === 0) return null;

  const selected: PlanHighlight[] = highlights?.length
    ? highlights.slice(0, 3)
    : highlight
      ? [highlight]
      : [];

  const selectedKeys = new Set(selected.map((h) => pinKey(h.building, h.unitNo)));

  return (
    <div id="floor-plan" className={`scroll-mt-24 space-y-6 ${className}`}>
      {selected.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-[#fff8e8] px-4 py-3">
            <p className="text-sm text-brand-deep">
              <span className="font-semibold text-brand">선택 {selected.length}호실</span>
              <span className="text-muted"> — 아래 {floor} 3D 평면도에서 동·호수를 확인하세요.</span>
            </p>
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
              {floor} 평면도
            </span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {selected.map((h, i) => {
              const order = Math.min(3, Math.max(1, h.mark ?? i + 1));
              const style = HIGHLIGHT_STYLES[order - 1] ?? HIGHLIGHT_STYLES[0];
              return (
                <li
                  key={pinKey(h.building, h.unitNo)}
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-semibold text-white ${style.bg} ${style.ring}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-black">
                    {order}
                  </span>
                  {unitLabel(h.building, h.unitNo)}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className={`grid gap-6 ${plans.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {plans.map(({ building: b, plan }) => {
          const selectedPins = showPins
            ? selected
                .filter((h) => h.building === b)
                .map((h, i) => {
                  const pos = estimateUnitPin(h.building, h.unitNo, h.siblings ?? [], floor);
                  const order = Math.min(3, Math.max(1, h.mark ?? i + 1));
                  return {
                    ...h,
                    ...pos,
                    style: HIGHLIGHT_STYLES[order - 1] ?? HIGHLIGHT_STYLES[0],
                    order,
                  };
                })
            : [];

          const overlayPins =
            showPins && !hideDimPins
              ? pins
                  .filter((p) => p.building === b)
                  .map((p) => {
                    const pos = estimateUnitPin(p.building, p.unitNo, [], floor);
                    return { ...p, x: pos.x, y: pos.y };
                  })
                  .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
              : [];

          return (
            <figure key={b} className="rounded-2xl border border-line bg-white">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: `${plan.width} / ${plan.height}` }}
              >
                <Image
                  src={plan.src}
                  alt={plan.alt}
                  fill
                  quality={88}
                  sizes="(max-width: 1152px) 100vw, 550px"
                  className="rounded-t-2xl object-contain object-top"
                  priority={selected.length > 0}
                />

                {overlayPins.map((p) => {
                  const key = pinKey(p.building, p.unitNo);
                  if (selectedKeys.has(key)) return null;
                  const dot = PIN_DOT[p.status ?? "available"];
                  const body = (
                    <span
                      className={`flex h-6 min-w-6 items-center justify-center rounded-full border border-white px-1 text-[9px] font-bold text-white shadow ${dot}`}
                    >
                      {p.unitNo.replace(/^B-/, "")}
                    </span>
                  );
                  return (
                    <div
                      key={p.id}
                      className="absolute z-[5] -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      title={unitLabel(p.building, p.unitNo)}
                    >
                      {p.href ? (
                        <Link href={p.href} className="block hover:scale-110">
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </div>
                  );
                })}

                {selectedPins.map((h) => (
                  <div
                    key={pinKey(h.building, h.unitNo)}
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    aria-label={`${h.style.label} ${unitLabel(h.building, h.unitNo)}`}
                  >
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`absolute -inset-2 animate-ping rounded-full ${h.style.ping}`}
                      />
                      <span
                        className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white text-base font-black text-white shadow-lg ${h.style.bg}`}
                      >
                        {h.order}
                      </span>
                      <span
                        className={`relative mt-1 max-w-[7.5rem] truncate rounded-md px-2 py-0.5 text-center text-[11px] font-bold text-white shadow-md ${h.style.bg}`}
                      >
                        {unitLabel(h.building, h.unitNo)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="border-t border-line px-4 py-2 text-xs text-muted">
                {plan.alt}
                {selected.filter((h) => h.building === b).length > 0
                  ? ` · 선택 호실 포함`
                  : ""}
              </figcaption>
            </figure>
          );
        })}
      </div>

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
