import Link from "next/link";
import { FloorPlanFigure } from "@/components/floor-plan-figure";
import { formatArea, unitLabel } from "@/lib/format";
import { getPublicUnits, store } from "@/lib/store";
import { Building, Floor } from "@/lib/types";

type Search = Promise<{ floor?: string; building?: string; unit?: string }>;

export default async function PlanPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const floor = (sp.floor as Floor) || "2F";
  const building = (sp.building as Building) || "A";
  const project = await store.getProject();
  const all = await getPublicUnits();
  const units = all.filter((u) => u.floor === floor && u.building === building);
  const md = project.floorSummaries.find((f) => f.floor === floor);
  const highlightUnit = sp.unit
    ? units.find((u) => u.unitNo === sp.unit || u.id.endsWith(`-${sp.unit}`))
    : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">도면 · MD Plan</h1>
      <p className="mt-2 text-muted">층·동을 선택해 평면도·MD 컨셉·호실 목록을 확인하세요.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["2F", "1F", "B1"] as Floor[]).map((f) => (
          <Link
            key={f}
            href={`/plan?floor=${f}&building=${building}`}
            className={`rounded-full px-4 py-2 text-sm ${floor === f ? "bg-brand text-white" : "border border-line bg-surface"}`}
          >
            {f}
          </Link>
        ))}
        {(["A", "B"] as const).map((b) => (
          <Link
            key={b}
            href={`/plan?floor=${floor}&building=${b}`}
            className={`rounded-full px-4 py-2 text-sm ${building === b ? "bg-brand text-white" : "border border-line bg-surface"}`}
          >
            {b}동
          </Link>
        ))}
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
        <FloorPlanFigure
          floor={floor}
          highlight={
            highlightUnit
              ? {
                  building: highlightUnit.building,
                  unitNo: highlightUnit.unitNo,
                  siblings: units.map((u) => u.unitNo),
                }
              : undefined
          }
        />
      </div>

      <h2 className="mt-10 font-display text-2xl text-brand-deep">
        {building}동 {floor} 호실
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-background text-muted">
            <tr>
              <th className="px-3 py-3">호실</th>
              <th className="px-3 py-3">전용면적</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr
                key={u.id}
                className={`border-t border-line ${
                  highlightUnit?.id === u.id ? "bg-[#fff8e8]" : ""
                }`}
              >
                <td className="px-3 py-3 font-medium">{unitLabel(u.building, u.unitNo)}</td>
                <td className="px-3 py-3">{formatArea(u.exclusiveArea, u.exclusiveAreaUnit)}</td>
                <td className="px-3 py-3">
                  <Link href={`/units/${u.id}#floor-plan`} className="text-brand underline">
                    상세
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
