"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FloorPlanFigure, HIGHLIGHT_STYLES } from "@/components/floor-plan-figure";
import { useInterestUnits } from "@/hooks/use-interest-units";
import { formatArea, formatFrontLength, formatPrice, STATUS_LABEL, unitLabel } from "@/lib/format";
import { FACADE_LABEL, frontFacadeForUnitId } from "@/lib/front-lengths";
import { Building, Floor, Unit } from "@/lib/types";

type PublicUnit = Pick<
  Unit,
  | "id"
  | "building"
  | "floor"
  | "unitNo"
  | "exclusiveArea"
  | "exclusiveAreaUnit"
  | "price"
  | "status"
  | "recommendedBusiness"
  | "frontLengthMm"
>;

export function InterestUnitsPanel({ units }: { units: PublicUnit[] }) {
  const interest = useInterestUnits();
  const byId = useMemo(() => new Map(units.map((u) => [u.id, u])), [units]);

  const selected = interest.ids
    .map((id, index) => {
      const u = byId.get(id);
      if (!u) return null;
      return { u, index, style: HIGHLIGHT_STYLES[index] ?? HIGHLIGHT_STYLES[0] };
    })
    .filter(Boolean) as { u: PublicUnit; index: number; style: (typeof HIGHLIGHT_STYLES)[number] }[];

  const byFloor = (["2F", "1F", "B1"] as Floor[]).map((floor) => ({
    floor,
    items: selected.filter((s) => s.u.floor === floor),
  })).filter((g) => g.items.length > 0);

  if (!interest.ready) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-sm text-muted">
        선택 목록을 불러오는 중…
      </div>
    );
  }

  if (selected.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
        <p className="font-display text-xl text-brand-deep">선택한 호실이 없습니다</p>
        <p className="mt-2 text-sm text-muted">
          호실·도면에서 관심 호실을 최대 {interest.max}개까지 선택해 보세요.
        </p>
        <Link
          href="/plan"
          className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
        >
          도면에서 호실 선택하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          선택 <span className="font-semibold text-brand">{selected.length}</span> / {interest.max}호실
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/plan"
            className="rounded-full border border-line px-3.5 py-1.5 text-xs hover:border-brand hover:text-brand"
          >
            도면에서 위치 보기
          </Link>
          <button
            type="button"
            onClick={interest.clear}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted hover:border-brand hover:text-brand"
          >
            전체 해제
          </button>
          <Link
            href={`/contact?units=${encodeURIComponent(selected.map((s) => s.u.id).join(","))}`}
            className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-deep"
          >
            선택 호실 상담 신청
          </Link>
        </div>
      </div>

      {/* 선택 카드 목록 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selected.map(({ u, index, style }) => (
          <article
            key={u.id}
            className={`rounded-2xl border-2 bg-surface p-4 shadow-sm ${style.ring}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white ${style.bg}`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-brand-deep">
                    {unitLabel(u.building, u.unitNo)}
                  </h3>
                  <p className="text-xs text-muted">
                    {u.floor} · {STATUS_LABEL[u.status]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => interest.toggle(u.id)}
                className="text-xs text-muted hover:text-brand"
              >
                제거
              </button>
            </div>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">전용면적</dt>
                <dd className="font-medium">{formatArea(u.exclusiveArea, u.exclusiveAreaUnit)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">정면길이</dt>
                <dd className="font-medium">
                  {(() => {
                    const face = frontFacadeForUnitId(u.id);
                    const len = formatFrontLength(u.frontLengthMm);
                    return face ? `${len} (${FACADE_LABEL[face]})` : len;
                  })()}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">분양가</dt>
                <dd className="font-medium">{formatPrice(u.price)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">권장업종</dt>
                <dd className="font-medium">{u.recommendedBusiness || "—"}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/plan?floor=${u.floor}&building=${u.building}&unit=${encodeURIComponent(u.unitNo)}`}
                className="rounded-full bg-brand-deep px-3 py-1.5 text-xs text-white"
              >
                도면에서 보기
              </Link>
              <Link
                href={`/units/${u.id}#floor-plan`}
                className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-brand"
              >
                상세
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* 층별 MD Plan 마커 */}
      {byFloor.map(({ floor, items }) => (
        <section key={floor} className="space-y-3">
          <h2 className="font-display text-xl text-brand-deep">
            {floor} 도면 위치
            <span className="ml-2 text-sm font-normal text-muted">
              {items.map((i) => unitLabel(i.u.building, i.u.unitNo)).join(" · ")}
            </span>
          </h2>
          <FloorPlanFigure
            floor={floor}
            showMood={false}
            hideDimPins
            highlights={items.map((i) => ({
              building: i.u.building as Building,
              unitNo: i.u.unitNo,
              mark: i.index + 1,
            }))}
          />
        </section>
      ))}
    </div>
  );
}
