"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { PlanMediaGallery } from "@/components/plan-media-gallery";
import { HIGHLIGHT_STYLES } from "@/components/floor-plan-figure";
import { useInterestUnits } from "@/hooks/use-interest-units";
import { formatArea, formatPrice, STATUS_LABEL, unitLabel } from "@/lib/format";
import { Building, Floor, Unit, UnitStatus } from "@/lib/types";

type PlanUnit = Pick<
  Unit,
  | "id"
  | "building"
  | "floor"
  | "unitNo"
  | "exclusiveArea"
  | "exclusiveAreaUnit"
  | "price"
  | "status"
>;

type PlanPin = {
  id: string;
  building: Building;
  unitNo: string;
  status?: Exclude<UnitStatus, "hidden">;
  href?: string;
};

export function PlanMultiSelect({
  floor,
  listBuilding,
  units,
  initialIds = [],
  resultCount,
}: {
  floor: Floor;
  listBuilding: Building | "";
  units: PlanUnit[];
  /** @deprecated 도면 갤러리로 대체 */
  floorPins?: PlanPin[];
  initialIds?: string[];
  resultCount?: number;
}) {
  const interest = useInterestUnits();
  const [seeded, setSeeded] = useState(false);

  // URL로 들어온 호실을 관심 목록에 1회 반영
  useEffect(() => {
    if (!interest.ready || seeded) return;
    setSeeded(true);
    if (initialIds.length === 0) return;
    const id = initialIds[0];
    if (!id || interest.ids.includes(id)) return;
    if (interest.ids.length < interest.max) interest.toggle(id);
  }, [interest, initialIds, seeded]);

  const byId = useMemo(() => new Map(units.map((u) => [u.id, u])), [units]);

  const floorSelected = interest.ids
    .map((id) => byId.get(id))
    .filter((u): u is PlanUnit => u != null && u.floor === floor);

  const otherFloorCount = interest.ids.length - floorSelected.length;

  const onToggle = (id: string) => {
    const res = interest.toggle(id);
    if (res.limited) {
      window.alert(`관심 호실은 최대 ${interest.max}개까지 선택할 수 있습니다.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-brand-deep sm:text-xl">
              관심 호실 선택 · 위치 표시
            </h2>
            <p className="mt-1 text-sm text-muted">
              최대 {interest.max}호실까지 선택하면 상단에{" "}
              <span className="font-medium text-brand">①②③ 번호</span>로 표시됩니다. 아래 A/B동
              층별 도면·영상에서 배치를 확인하세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/interest"
              className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-deep"
            >
              내 선택 목록 ({interest.count}/{interest.max})
            </Link>
            {interest.count > 0 ? (
              <button
                type="button"
                onClick={interest.clear}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-brand hover:text-brand"
              >
                전체 해제
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {interest.count === 0 ? (
            <p className="text-sm text-muted">아래에서 호실을 선택해 주세요. (2~3호실 권장)</p>
          ) : (
            interest.ids.map((id, i) => {
              const u = byId.get(id);
              const style = HIGHLIGHT_STYLES[i] ?? HIGHLIGHT_STYLES[0];
              if (!u) {
                return (
                  <span
                    key={id}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-white ${style.bg}`}
                  >
                    <span className="font-black">{i + 1}</span>
                    {id}
                    <button type="button" onClick={() => onToggle(id)} aria-label="제거">
                      ×
                    </button>
                  </span>
                );
              }
              const onThisFloor = u.floor === floor;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onToggle(u.id)}
                  className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-medium text-white ${style.bg} ${style.ring} ${
                    onThisFloor ? "" : "opacity-60"
                  }`}
                  title={onThisFloor ? "클릭하여 선택 해제" : `${u.floor} 호실 — 해당 층 도면에서 표시`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-black">
                    {i + 1}
                  </span>
                  {unitLabel(u.building, u.unitNo)}
                  <span className="text-[10px] opacity-80">{u.floor}</span>
                  <span aria-hidden>×</span>
                </button>
              );
            })
          )}
        </div>
        {otherFloorCount > 0 ? (
          <p className="mt-3 text-xs text-muted">
            다른 층 선택 {otherFloorCount}호실은 해당 층 탭에서 마커로 확인할 수 있습니다.
          </p>
        ) : null}
      </div>

      <PlanMediaGallery floor={floor} building={listBuilding} />

      <div>
        <h2 className="font-display text-2xl text-brand-deep">{floor} 호실 목록</h2>
        <p className="mt-1 text-sm text-muted">
          체크하면 관심 호실에 추가됩니다. 위 설계도면(층·동)과 영상에서 배치를 확인하세요.
          {typeof resultCount === "number" ? (
            <>
              {" "}
              · 검색 결과 <span className="font-medium text-brand">{resultCount}</span>실
            </>
          ) : null}
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <th className="w-14 px-3 py-3">선택</th>
                <th className="px-3 py-3">호실</th>
                <th className="px-3 py-3">전용면적</th>
                <th className="px-3 py-3">분양가</th>
                <th className="px-3 py-3">상태</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {units.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted">
                    조건에 맞는 호실이 없습니다. 검색어·필터를 바꿔 보세요.
                  </td>
                </tr>
              ) : (
                (["A", "B"] as Building[]).map((b) => {
                  const rows = units.filter((u) => u.building === b);
                  if (rows.length === 0) return null;
                  const focus = listBuilding !== "" && b === listBuilding;
                  return (
                    <Fragment key={b}>
                      <tr className="border-t border-line bg-background/80">
                        <td colSpan={6} className="px-3 py-2 text-xs font-semibold text-brand">
                          {b}동{focus ? " · 포커스" : ""}
                        </td>
                      </tr>
                      {rows.map((u) => {
                        const checked = interest.ids.includes(u.id);
                        const order = checked ? interest.ids.indexOf(u.id) + 1 : 0;
                        const atLimit = !checked && interest.atLimit;
                        return (
                          <tr
                            key={u.id}
                            className={`border-t border-line ${checked ? "bg-[#fff8e8]" : ""}`}
                          >
                            <td className="px-3 py-3">
                              <label className="inline-flex cursor-pointer items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-[#0b3a5b]"
                                  checked={checked}
                                  disabled={atLimit}
                                  onChange={() => onToggle(u.id)}
                                  aria-label={`${unitLabel(u.building, u.unitNo)} 관심 선택`}
                                />
                                {checked ? (
                                  <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-white ${
                                      HIGHLIGHT_STYLES[order - 1]?.bg ?? HIGHLIGHT_STYLES[0].bg
                                    }`}
                                  >
                                    {order}
                                  </span>
                                ) : null}
                              </label>
                            </td>
                            <td className="px-3 py-3 font-medium">
                              {unitLabel(u.building, u.unitNo)}
                            </td>
                            <td className="px-3 py-3">
                              {formatArea(u.exclusiveArea, u.exclusiveAreaUnit)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">{formatPrice(u.price)}</td>
                            <td className="px-3 py-3">{STATUS_LABEL[u.status]}</td>
                            <td className="px-3 py-3">
                              <Link href={`/units/${u.id}#floor-plan`} className="text-brand underline">
                                상세
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
