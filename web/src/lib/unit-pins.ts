import { Building, Floor } from "@/lib/types";

type Pin = { x: number; y: number };

/**
 * MD Plan 전체 이미지 기준 핀 좌표(%).
 * A동 = 좌측 패널, B동 = 우측 패널.
 * 리플렛 핑크 호실·파란 라벨 중심 기준. 분양호실 107실 전부 등록.
 */
const MD_PINS: Record<Floor, Record<Building, Record<string, Pin>>> = {
  "1F": {
    A: {
      // 상단 L→R
      "106": { x: 7.6, y: 35.5 },
      "105": { x: 12.8, y: 35.5 },
      "102": { x: 21.8, y: 36.5 },
      "143": { x: 28.5, y: 36.5 },
      "142": { x: 32.5, y: 36.5 },
      "141": { x: 37.2, y: 36.0 },
      "140": { x: 40.2, y: 35.5 },
      // 좌측 외벽 T→B
      "107": { x: 9.5, y: 41.5 },
      "108": { x: 9.5, y: 46.5 },
      "109": { x: 8.5, y: 50.5 },
      "110": { x: 7.8, y: 56.0 },
      "111": { x: 8.0, y: 66.5 },
      "112": { x: 9.0, y: 71.5 },
      "113": { x: 9.0, y: 76.0 },
      "114": { x: 9.0, y: 80.5 },
      "115": { x: 9.0, y: 85.0 },
      "116": { x: 7.2, y: 91.0 },
      // 우측 외벽 T→B
      "139": { x: 40.2, y: 42.5 },
      "138": { x: 40.2, y: 47.5 },
      "137": { x: 40.2, y: 52.5 },
      "135": { x: 40.2, y: 59.0 },
      "134": { x: 40.2, y: 64.0 },
      "130": { x: 40.2, y: 78.5 },
      "122": { x: 40.0, y: 91.5 },
      // 하단(남측) — 리플렛 비핑크지만 분양 데이터에 존재
      "120": { x: 22.0, y: 91.0 },
    },
    B: {
      // 상단 L→R
      "105": { x: 57.2, y: 34.5 },
      "103": { x: 63.5, y: 34.5 },
      "101": { x: 67.5, y: 34.5 },
      "141": { x: 77.0, y: 35.5 },
      "139": { x: 83.5, y: 34.5 },
      "138": { x: 89.2, y: 34.5 },
      // 좌측(중정측) T→B
      "106": { x: 57.5, y: 44.0 },
      "107": { x: 57.5, y: 50.0 },
      "108": { x: 57.5, y: 57.0 },
      "111": { x: 57.5, y: 71.5 },
      "112": { x: 57.5, y: 75.5 },
      "113": { x: 57.5, y: 82.0 },
      "117": { x: 57.5, y: 91.5 },
      // 우측 외벽 T→B
      "132": { x: 88.5, y: 52.5 },
      "131": { x: 88.5, y: 58.5 },
      "130": { x: 88.5, y: 66.5 },
      "129": { x: 88.5, y: 71.5 },
      "128": { x: 88.5, y: 76.5 },
      "127": { x: 88.5, y: 81.5 },
      // 하단 L→R
      "119": { x: 66.0, y: 91.5 },
      "120": { x: 72.0, y: 91.5 },
      "121": { x: 78.0, y: 91.5 },
      "122": { x: 82.5, y: 91.5 },
      "123": { x: 86.0, y: 91.5 },
      "124": { x: 89.2, y: 91.5 },
    },
  },
  "2F": {
    A: {
      // 상단 L→R
      "204": { x: 8.0, y: 31.5 },
      "203": { x: 14.0, y: 31.5 },
      "202": { x: 20.0, y: 31.5 },
      "201": { x: 26.0, y: 31.5 },
      "229": { x: 32.5, y: 31.5 },
      "228": { x: 37.5, y: 31.5 },
      "227": { x: 42.0, y: 31.5 },
      // 좌측 외벽 T→B
      "205": { x: 8.0, y: 38.0 },
      "206": { x: 8.0, y: 44.0 },
      "207": { x: 8.0, y: 50.0 },
      "208": { x: 8.0, y: 56.5 },
      "209": { x: 8.0, y: 66.0 },
      "210": { x: 8.0, y: 73.0 },
      "211": { x: 8.0, y: 80.0 },
      "212": { x: 8.0, y: 88.0 },
      // 우측(중정 우측 윙) T→B
      "226": { x: 42.0, y: 40.0 },
      "224": { x: 42.0, y: 52.0 },
      "218": { x: 42.0, y: 72.0 },
      "217": { x: 42.0, y: 88.0 },
      // 내부·하단
      "215": { x: 18.0, y: 55.0 },
      "213": { x: 14.0, y: 88.0 },
      "216": { x: 32.0, y: 88.0 },
    },
    B: {
      // 상단 L→R
      "204": { x: 57.0, y: 31.5 },
      "203": { x: 63.0, y: 31.5 },
      "202": { x: 69.0, y: 31.5 },
      "201": { x: 75.0, y: 31.5 },
      "229": { x: 81.0, y: 31.5 },
      "228": { x: 86.0, y: 31.5 },
      "227": { x: 91.0, y: 31.5 },
      // 좌측(중정측) T→B
      "205": { x: 57.0, y: 38.0 },
      "206": { x: 57.0, y: 44.0 },
      "207": { x: 57.0, y: 50.0 },
      "208": { x: 57.0, y: 56.5 },
      "209": { x: 57.0, y: 66.0 },
      "210": { x: 57.0, y: 73.0 },
      "211": { x: 57.0, y: 80.0 },
      "212": { x: 57.0, y: 88.0 },
      // 우측 외벽 T→B
      "226": { x: 91.0, y: 38.0 },
      "225": { x: 91.0, y: 44.0 },
      "224": { x: 91.0, y: 52.0 },
      "223": { x: 91.0, y: 58.0 },
      "222": { x: 91.0, y: 64.0 },
      "221": { x: 91.0, y: 72.0 },
      "220": { x: 91.0, y: 78.0 },
      "219": { x: 91.0, y: 83.0 },
      "218": { x: 91.0, y: 88.0 },
      // 내부·하단
      "230": { x: 84.0, y: 50.0 },
      "215": { x: 67.0, y: 55.0 },
      "214": { x: 67.0, y: 65.0 },
      "213": { x: 63.0, y: 88.0 },
      "216": { x: 81.0, y: 88.0 },
    },
  },
  "B1": {
    A: {
      "B-101": { x: 10.5, y: 88.5 },
      "101": { x: 10.5, y: 88.5 },
      "B-102": { x: 10.5, y: 78.5 },
      "102": { x: 10.5, y: 78.5 },
      "B-105": { x: 24.5, y: 80.0 },
      "105": { x: 24.5, y: 80.0 },
    },
    B: {
      "B-106": { x: 62.0, y: 62.0 },
      "106": { x: 62.0, y: 62.0 },
      "B-105": { x: 62.0, y: 74.0 },
      "105": { x: 62.0, y: 74.0 },
      "B-107": { x: 82.0, y: 88.0 },
      "107": { x: 82.0, y: 88.0 },
    },
  },
};

/** 미등록 호실 폴백 — A 좌 / B 우 */
const MD_PANELS: Record<Floor, Record<Building, { left: number; top: number; width: number; height: number }>> = {
  "1F": {
    A: { left: 7.0, top: 33.0, width: 36.0, height: 58.0 },
    B: { left: 55.0, top: 33.0, width: 37.0, height: 58.0 },
  },
  "2F": {
    A: { left: 7.0, top: 30.0, width: 36.0, height: 60.0 },
    B: { left: 55.0, top: 30.0, width: 37.0, height: 60.0 },
  },
  "B1": {
    A: { left: 7.0, top: 28.0, width: 36.0, height: 62.0 },
    B: { left: 55.0, top: 28.0, width: 37.0, height: 62.0 },
  },
};

export function normalizeUnitNo(unitNo: string): string {
  return unitNo.replace(/^B-/i, "").replace(/^[ABab]-/, "");
}

function lookupMdPin(building: Building, floor: Floor, unitNo: string): Pin | null {
  const map = MD_PINS[floor]?.[building];
  if (!map) return null;
  if (map[unitNo]) return map[unitNo];
  const bare = normalizeUnitNo(unitNo);
  if (map[bare]) return map[bare];
  if (floor === "B1") {
    const withPrefix = unitNo.startsWith("B-") ? unitNo : `B-${bare}`;
    if (map[withPrefix]) return map[withPrefix];
  }
  return null;
}

export function estimateUnitPin(
  building: Building,
  unitNo: string,
  siblings: string[] = [],
  floor: Floor = "1F",
): Pin {
  const hit = lookupMdPin(building, floor, unitNo);
  if (hit) return hit;

  const sorted = [...siblings].map(normalizeUnitNo).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  const want = normalizeUnitNo(unitNo);
  const idx = Math.max(0, sorted.indexOf(want));
  const n = Math.max(1, sorted.length);
  const cols = Math.min(4, Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);
  const row = Math.floor(idx / cols);
  const col = idx % cols;
  const panel = MD_PANELS[floor]?.[building] ?? MD_PANELS["1F"].A;
  return {
    x: Math.round((panel.left + ((col + 0.5) / cols) * panel.width) * 10) / 10,
    y: Math.round((panel.top + ((row + 0.5) / rows) * panel.height) * 10) / 10,
  };
}

/** 해당 층·동에 MD 핀 좌표가 등록돼 있는지 */
export function hasMdPin(building: Building, floor: Floor, unitNo: string): boolean {
  return lookupMdPin(building, floor, unitNo) != null;
}

/** 분양호실 기준 미매핑 목록 (층-동-호실) */
export function listUnmappedSaleUnits(
  units: { building: Building; floor: Floor; unitNo: string; status?: string }[],
): string[] {
  return units
    .filter((u) => u.status !== "hidden")
    .filter((u) => !hasMdPin(u.building, u.floor, u.unitNo))
    .map((u) => `${u.floor}-${u.building}-${u.unitNo}`)
    .sort();
}

export function floorBuildingKey(floor: Floor, building: Building) {
  return `${floor}-${building}`;
}

/** 분석/검증용: 등록된 핀 키 수 */
export function mdPinCoverage() {
  const out: Record<string, number> = {};
  for (const floor of Object.keys(MD_PINS) as Floor[]) {
    for (const b of Object.keys(MD_PINS[floor]) as Building[]) {
      const keys = Object.keys(MD_PINS[floor][b]).filter((k) => !k.startsWith("B-") || floor === "B1");
      // count unique bare numbers
      const bare = new Set(
        Object.keys(MD_PINS[floor][b]).map((k) => (floor === "B1" ? k.replace(/^B-/, "") : k)),
      );
      out[`${floor}-${b}`] = bare.size;
    }
  }
  return out;
}
