import Link from "next/link";
import { PlanMultiSelect } from "@/components/plan-multi-select";
import { PUBLIC_STATUS_FILTERS } from "@/lib/format";
import { getPublicUnits, store } from "@/lib/store";
import { Building, Floor, UnitStatus } from "@/lib/types";

type Search = Promise<{ floor?: string; building?: string; unit?: string; status?: string }>;

export default async function PlanPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const floor = (sp.floor as Floor) || "2F";
  const building = (sp.building as Building) || "A";
  const statusFilter = (sp.status as Exclude<UnitStatus, "hidden"> | undefined) || "";
  const project = await store.getProject();
  const all = await getPublicUnits();

  let floorUnits = all.filter((u) => u.floor === floor);
  if (statusFilter) floorUnits = floorUnits.filter((u) => u.status === statusFilter);

  const md = project.floorSummaries.find((f) => f.floor === floor);

  const initialUnit = sp.unit
    ? floorUnits.find(
        (u) =>
          u.building === building &&
          (u.unitNo === sp.unit ||
            u.id.endsWith(`-${sp.unit}`) ||
            u.unitNo === `B-${sp.unit}` ||
            u.unitNo.replace(/^B-/, "") === sp.unit),
      ) ??
      floorUnits.find(
        (u) =>
          u.unitNo === sp.unit ||
          u.id.endsWith(`-${sp.unit}`) ||
          u.unitNo === `B-${sp.unit}` ||
          u.unitNo.replace(/^B-/, "") === sp.unit,
      )
    : undefined;

  const floorPins = all
    .filter((u) => u.floor === floor)
    .map((u) => ({
      id: u.id,
      building: u.building,
      unitNo: u.unitNo,
      status: u.status as Exclude<UnitStatus, "hidden">,
      href: `/units/${u.id}#floor-plan`,
    }));

  const statusQuery = (key: string) => {
    const q = new URLSearchParams({ floor, building });
    if (key && key !== "all") q.set("status", key);
    return `/plan?${q.toString()}`;
  };

  const pickerUnits = floorUnits.map((u) => ({
    id: u.id,
    building: u.building,
    floor: u.floor,
    unitNo: u.unitNo,
    exclusiveArea: u.exclusiveArea,
    exclusiveAreaUnit: u.exclusiveAreaUnit,
    status: u.status,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">도면 · MD Plan</h1>
      <p className="mt-2 text-muted">
        층·동을 고른 뒤 관심 호실을 최대 3개까지 선택하면 도면에 ①②③ 마커로 위치가 표시됩니다.{" "}
        <Link href="/interest" className="text-brand underline">
          내 선택 목록
        </Link>
        에서 다시 확인할 수 있습니다.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["2F", "1F", "B1"] as Floor[]).map((f) => (
          <Link
            key={f}
            href={`/plan?floor=${f}&building=${building}${statusFilter ? `&status=${statusFilter}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm ${floor === f ? "bg-brand text-white" : "border border-line bg-surface"}`}
          >
            {f}
          </Link>
        ))}
        {(["A", "B"] as const).map((b) => (
          <Link
            key={b}
            href={`/plan?floor=${floor}&building=${b}${statusFilter ? `&status=${statusFilter}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm ${building === b ? "bg-brand text-white" : "border border-line bg-surface"}`}
          >
            {b}동
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted">분양 상태</span>
        {PUBLIC_STATUS_FILTERS.map((t) => {
          const active = t.key === "all" ? !statusFilter : statusFilter === t.key;
          return (
            <Link
              key={t.key}
              href={statusQuery(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm ${
                active
                  ? "bg-brand-deep text-white"
                  : "border border-line bg-surface text-muted hover:border-brand"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {md ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-xl text-brand">
            MD Plan {floor} · {md.recommendedBusinesses}
          </h2>
          <p className="mt-2 text-sm text-muted">{md.mdConcept}</p>
        </div>
      ) : null}

      <div className="mt-6">
        <PlanMultiSelect
          floor={floor}
          listBuilding={building}
          units={pickerUnits}
          floorPins={floorPins}
          initialIds={initialUnit ? [initialUnit.id] : []}
        />
      </div>
    </div>
  );
}
