import Link from "next/link";
import { notFound } from "next/navigation";
import { FloorPlanFigure } from "@/components/floor-plan-figure";
import { InquiryForm } from "@/components/inquiry-form";
import { InterestToggleButton } from "@/components/interest-toggle-button";
import { ScrollToFloorPlan } from "@/components/scroll-to-floor-plan";
import { formatArea, formatFrontLength, formatPrice, STATUS_LABEL, unitLabel } from "@/lib/format";
import { FACADE_LABEL, frontFacadeForUnitId } from "@/lib/front-lengths";
import { store } from "@/lib/store";
import { Floor, UnitStatus } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export default async function UnitDetailPage({ params }: Ctx) {
  const { id } = await params;
  const units = await store.getUnits();
  const unit = units.find((u) => u.id === id && u.status !== "hidden");
  if (!unit) notFound();

  const project = await store.getProject();
  const floorMd = project.floorSummaries.find((f) => f.floor === unit.floor);
  const siblings = units
    .filter((u) => u.floor === unit.floor && u.building === unit.building && u.status !== "hidden")
    .map((u) => u.unitNo);
  const floorPins = units
    .filter((u) => u.floor === unit.floor && u.status !== "hidden")
    .map((u) => ({
      id: u.id,
      building: u.building,
      unitNo: u.unitNo,
      status: u.status as Exclude<UnitStatus, "hidden">,
      href: `/units/${u.id}#floor-plan`,
    }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <ScrollToFloorPlan enabled />

      <Link href="/plan" className="text-sm text-muted hover:text-brand">
        ← 호실·도면
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-brand-deep">
            {unitLabel(unit.building, unit.unitNo)}
          </h1>
          <p className="mt-2 text-muted">
            {unit.floor} · {STATUS_LABEL[unit.status]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <InterestToggleButton unitId={unit.id} />
          <Link
            href={`/contact?building=${unit.building}&floor=${unit.floor}&unit=${unit.unitNo}`}
            className="rounded-full bg-brand px-4 py-2 text-sm text-white"
          >
            이 호실 상담 신청
          </Link>
          <Link
            href="/interest"
            className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-brand hover:text-brand"
          >
            내 선택 목록
          </Link>
        </div>
      </div>

      {/* 상세 진입 시 도면 + 선택 호실 표시를 먼저 노출 */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-2xl text-brand-deep">도면에서 위치 확인</h2>
        <FloorPlanFigure
          floor={unit.floor as Floor}
          building={unit.building}
          pins={floorPins}
          hideDimPins
          showPins
          highlight={{
            building: unit.building,
            unitNo: unit.unitNo,
            siblings,
          }}
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["전용면적", formatArea(unit.exclusiveArea, unit.exclusiveAreaUnit)],
          [
            "정면길이",
            (() => {
              const face = frontFacadeForUnitId(unit.id);
              const len = formatFrontLength(unit.frontLengthMm);
              return face ? `${len} (${FACADE_LABEL[face]})` : len;
            })(),
          ],
          ["계약면적", unit.contractArea != null ? String(unit.contractArea) : "관리자 등록 필요"],
          ["분양가", formatPrice(unit.price)],
          ["권장업종", unit.recommendedBusiness || "—"],
          ["옵션", unit.options || "—"],
          ["위치", project.address],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs text-muted">{k}</p>
            <p className="mt-1 font-medium text-brand">{v}</p>
          </div>
        ))}
      </div>

      {floorMd ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-xl text-brand">층 MD · {unit.floor}</h2>
          <p className="mt-2 text-sm text-muted">{floorMd.mdConcept}</p>
          <Link
            href={`/plan?floor=${unit.floor}&building=${unit.building}&unit=${unit.unitNo}`}
            className="mt-3 inline-block text-sm text-brand underline"
          >
            호실·도면에서 크게 보기
          </Link>
        </div>
      ) : null}

      <div className="mt-10">
        <h2 className="font-display text-2xl text-brand-deep">상담 신청</h2>
        <div className="mt-4">
          <InquiryForm
            defaultBuilding={unit.building}
            defaultFloor={unit.floor}
            defaultUnitNo={unit.unitNo}
          />
        </div>
      </div>
    </div>
  );
}
