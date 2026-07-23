import { Building, Floor } from "@/lib/types";

/** 리플렛 MD 페이지(상단 A/B 평면도) 기준 대략적 핀 위치(%) */
export function estimateUnitPin(
  building: Building,
  unitNo: string,
  siblings: string[],
): { x: number; y: number } {
  const sorted = [...siblings].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  const idx = Math.max(0, sorted.indexOf(unitNo));
  const n = Math.max(1, sorted.length);
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const row = Math.floor(idx / cols);
  const col = idx % cols;

  const planTop = 15;
  const planHeight = 32;
  const left = building === "A" ? 7 : 52;
  const width = 40;

  const x = left + ((col + 0.5) / cols) * width;
  const y = planTop + ((row + 0.5) / rows) * planHeight;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export function floorBuildingKey(floor: Floor, building: Building) {
  return `${floor}-${building}`;
}
