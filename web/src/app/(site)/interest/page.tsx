import { InterestUnitsPanel } from "@/components/interest-units-panel";
import { getPublicUnits } from "@/lib/store";

export default async function InterestPage() {
  const units = await getPublicUnits();
  const slim = units.map((u) => ({
    id: u.id,
    building: u.building,
    floor: u.floor,
    unitNo: u.unitNo,
    exclusiveArea: u.exclusiveArea,
    exclusiveAreaUnit: u.exclusiveAreaUnit,
    price: u.price,
    status: u.status,
    recommendedBusiness: u.recommendedBusiness,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">내 선택 호실</h1>
      <p className="mt-2 text-muted">
        의뢰자가 고른 관심 호실(최대 3개)을 한눈에 확인하고, 도면에서 위치를 다시 볼 수 있습니다.
        선택 내용은 이 브라우저에 저장됩니다.
      </p>

      <div className="mt-8">
        <InterestUnitsPanel units={slim} />
      </div>
    </div>
  );
}
