import Link from "next/link";
import { notFound } from "next/navigation";
import { FloorPlanFigure } from "@/components/floor-plan-figure";
import { InquiryForm } from "@/components/inquiry-form";
import { InterestToggleButton } from "@/components/interest-toggle-button";
import { ScrollToFloorPlan } from "@/components/scroll-to-floor-plan";
import { formatAreaM2, formatManwon, STATUS_LABEL, unitLabel } from "@/lib/format";
import { operatingOverlayPins } from "@/lib/operating-pins";
import { store } from "@/lib/store";
import { Floor, UnitStatus } from "@/lib/types";
import { toUnitPopupInfo, type UnitPopupInfo } from "@/lib/unit-popup";
import { buildPinOverlay, estimateUnitPin } from "@/lib/unit-pins";

type Ctx = { params: Promise<{ id: string }> };

export default async function UnitDetailPage({ params }: Ctx) {
  const { id } = await params;
  const units = await store.getUnits();
  const unit = units.find((u) => u.id === id && u.status !== "hidden");
  if (!unit) notFound();

  const [project, operatingPins, pinRecords] = await Promise.all([
    store.getProject(),
    store.getOperatingPins(),
    store.getUnitPins(),
  ]);
  const floorMd = project.floorSummaries.find((f) => f.floor === unit.floor);
  const siblings = units
    .filter((u) => u.floor === unit.floor && u.building === unit.building && u.status !== "hidden")
    .map((u) => u.unitNo);
  const pinOverlay = buildPinOverlay(pinRecords);
  const floorPins = units
    .filter((u) => u.floor === unit.floor && u.status !== "hidden")
    .map((u) => {
      const pos = estimateUnitPin(u.building, u.unitNo, [], u.floor, pinOverlay);
      return {
        id: u.id,
        building: u.building,
        unitNo: u.unitNo,
        status: u.status as Exclude<UnitStatus, "hidden">,
        href: `/units/${u.id}#floor-plan`,
        x: pos.x,
        y: pos.y,
      };
    });
  const popupUnits = units
    .filter((u) => u.floor === unit.floor && u.status !== "hidden")
    .map((u) => toUnitPopupInfo(u));

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
          pins={[
            ...floorPins,
            ...operatingOverlayPins(
              operatingPins,
              unit.floor as Floor,
              "",
              popupUnits.filter((u): u is UnitPopupInfo & { id: string } => Boolean(u.id)),
              pinOverlay,
            ),
          ]}
          popupUnits={popupUnits}
          pinRecords={pinRecords}
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
          [
            "전용면적(㎡)",
            unit.exclusiveArea != null
              ? formatAreaM2(unit.exclusiveArea, unit.exclusiveAreaUnit || "unknown")
              : "확인 중",
          ],
          [
            "공급면적(평)",
            unit.contractArea != null ? `${unit.contractArea.toLocaleString("ko-KR")}평` : "관리자 등록 필요",
          ],
          [
            "계약면적",
            unit.contractArea != null ? `${unit.contractArea.toLocaleString("ko-KR")}평` : "관리자 등록 필요",
          ],
          ["분양가", formatManwon(unit.price)],
          ["보증금", formatManwon(unit.listing?.deposit)],
          ["월 임대료", formatManwon(unit.listing?.monthlyRent)],
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
