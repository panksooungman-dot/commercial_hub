import Link from "next/link";
import { PlanMultiSelect } from "@/components/plan-multi-select";
import { UnitsFilter } from "@/components/units-filter";
import { getPublicUnits, store } from "@/lib/store";
import { Building, Floor, UnitStatus } from "@/lib/types";

type Search = Promise<{
  floor?: string;
  building?: string;
  unit?: string;
  status?: string;
  q?: string;
}>;

export default async function PlanPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const floor = (sp.floor as Floor) || "2F";
  const building = (sp.building as Building) || "";
  const statusFilter = (sp.status as Exclude<UnitStatus, "hidden"> | undefined) || "";
  const q = (sp.q || "").trim().toLowerCase();
  const project = await store.getProject();
  const all = await getPublicUnits();

  let floorUnits = all.filter((u) => u.floor === floor);
  if (building === "A" || building === "B") {
    floorUnits = floorUnits.filter((u) => u.building === building);
  }
  if (statusFilter) floorUnits = floorUnits.filter((u) => u.status === statusFilter);
  if (q) {
    floorUnits = floorUnits.filter(
      (u) =>
        u.unitNo.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.recommendedBusiness.toLowerCase().includes(q),
    );
  }

  const initialUnit = sp.unit
    ? all
        .filter((u) => u.floor === floor)
        .find(
          (u) =>
            (!building || u.building === building) &&
            (u.unitNo === sp.unit ||
              u.id.endsWith(`-${sp.unit}`) ||
              u.unitNo === `B-${sp.unit}` ||
              u.unitNo.replace(/^B-/, "") === sp.unit),
        ) ??
      all
        .filter((u) => u.floor === floor)
        .find(
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

  const pickerUnits = floorUnits.map((u) => ({
    id: u.id,
    building: u.building,
    floor: u.floor,
    unitNo: u.unitNo,
    exclusiveArea: u.exclusiveArea,
    exclusiveAreaUnit: u.exclusiveAreaUnit,
    price: u.price,
    status: u.status,
  }));

  const listBuilding: Building | "" = building === "A" || building === "B" ? building : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">호실·도면</h1>
      <p className="mt-2 text-muted">
        PDF 기준 {project.commercialUnitsForSale}실 · MD Plan(B1·1F·2F, A·B동)과 안내 영상으로 배치를
        확인하고 관심 호실을 최대 3개까지 선택할 수 있습니다.{" "}
        <Link href="/interest" className="text-brand underline">
          내 선택 목록
        </Link>
      </p>

      <div className="mt-6">
        <UnitsFilter
          floor={floor}
          building={building}
          q={sp.q || ""}
          status={statusFilter}
          basePath="/plan"
        />
      </div>

      <div className="mt-6">
        <PlanMultiSelect
          floor={floor}
          listBuilding={listBuilding}
          units={pickerUnits}
          floorPins={floorPins}
          initialIds={initialUnit ? [initialUnit.id] : []}
          resultCount={floorUnits.length}
        />
      </div>
    </div>
  );
}
