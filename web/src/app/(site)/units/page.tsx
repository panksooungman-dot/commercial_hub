import Link from "next/link";
import { FloorPlanFigure } from "@/components/floor-plan-figure";
import { UnitsFilter } from "@/components/units-filter";
import { formatArea, formatPrice, STATUS_LABEL, unitLabel } from "@/lib/format";
import { getPublicUnits, store } from "@/lib/store";
import { Floor, Building, UnitStatus } from "@/lib/types";

type Search = Promise<{ floor?: string; building?: string; q?: string; status?: string }>;

export default async function UnitsPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const project = await store.getProject();
  const allPublic = await getPublicUnits();
  let units = allPublic;

  if (sp.floor) units = units.filter((u) => u.floor === sp.floor);
  if (sp.building) units = units.filter((u) => u.building === sp.building);
  if (sp.status && sp.status !== "all") {
    units = units.filter((u) => u.status === sp.status);
  }
  if (sp.q) {
    const q = sp.q.toLowerCase();
    units = units.filter(
      (u) =>
        u.unitNo.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.recommendedBusiness.toLowerCase().includes(q),
    );
  }

  const activeFloor = ((sp.floor as Floor) || "2F") as Floor;
  const floorMd = project.floorSummaries.find((f) => f.floor === activeFloor);
  const floorPins = allPublic
    .filter((u) => u.floor === activeFloor)
    .map((u) => ({
      id: u.id,
      building: u.building,
      unitNo: u.unitNo,
      status: u.status as Exclude<UnitStatus, "hidden">,
      href: `/units/${u.id}#floor-plan`,
    }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">호실 보기</h1>
      <p className="mt-2 text-muted">
        PDF 기준 {project.commercialUnitsForSale}실 · 분양가·상태는 관리자에서 수정할 수 있습니다.
      </p>

      <div className="mt-6">
        <UnitsFilter
          floor={(sp.floor as Floor) || ""}
          building={(sp.building as Building) || ""}
          q={sp.q || ""}
          status={sp.status || ""}
        />
      </div>

      {floorMd ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          <span className="font-medium text-brand">{floorMd.floor}</span> — {floorMd.mdConcept}
          <Link href={`/plan?floor=${activeFloor}`} className="ml-2 text-brand underline">
            도면 크게 보기
          </Link>
        </div>
      ) : null}

      <div className="mt-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {(["2F", "1F", "B1"] as Floor[]).map((f) => (
            <Link
              key={f}
              href={sp.building ? `/units?floor=${f}&building=${sp.building}` : `/units?floor=${f}`}
              className={`rounded-full px-3 py-1.5 text-sm ${
                activeFloor === f ? "bg-brand text-white" : "border border-line bg-surface"
              }`}
            >
              {f} 도면
            </Link>
          ))}
        </div>
        <FloorPlanFigure floor={activeFloor} pins={floorPins} />
      </div>

      <p className="mt-8 text-sm text-muted">검색 결과 {units.length}실</p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-background text-muted">
            <tr>
              <th className="px-3 py-3">호실</th>
              <th className="px-3 py-3">층</th>
              <th className="px-3 py-3">전용</th>
              <th className="px-3 py-3">분양가</th>
              <th className="px-3 py-3">상태</th>
              <th className="px-3 py-3">권장업종</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-3 py-3 font-medium">{unitLabel(u.building, u.unitNo)}</td>
                <td className="px-3 py-3">{u.floor}</td>
                <td className="px-3 py-3">{formatArea(u.exclusiveArea, u.exclusiveAreaUnit)}</td>
                <td className="px-3 py-3">{formatPrice(u.price)}</td>
                <td className="px-3 py-3">{STATUS_LABEL[u.status]}</td>
                <td className="px-3 py-3">{u.recommendedBusiness || "—"}</td>
                <td className="px-3 py-3">
                  <Link
                    href={`/units/${u.id}#floor-plan`}
                    className="text-brand underline-offset-2 hover:underline"
                  >
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
