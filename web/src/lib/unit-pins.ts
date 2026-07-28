import { Building, Floor } from "@/lib/types";

type Pin = { x: number; y: number };

/**
 * MD Plan 합본(A좌·B우) 핀 좌표(%).
 * md-b1/1f/2f.jpg 파란 호실 라벨 중심을 층·동별로 재매핑 (2026-07-28).
 */
const MD_PINS: Record<Floor, Record<Building, Record<string, Pin>>> = {
  "1F": {
    A: {
      "102": { x: 18.3, y: 16.4 },
      "105": { x: 10.4, y: 16.6 },
      "106": { x: 7, y: 16.6 },
      "107": { x: 8.7, y: 28.9 },
      "108": { x: 8.7, y: 32.3 },
      "109": { x: 8.7, y: 38.4 },
      "110": { x: 7, y: 44.3 },
      "111": { x: 6.9, y: 67.9 },
      "112": { x: 9, y: 73.8 },
      "113": { x: 9, y: 77.2 },
      "114": { x: 9, y: 81.1 },
      "115": { x: 9, y: 85.1 },
      "116": { x: 9, y: 89.5 },
      "120": { x: 22, y: 90.5 },
      "122": { x: 40.5, y: 90.1 },
      "130": { x: 40.5, y: 53.1 },
      "134": { x: 40.5, y: 39.3 },
      "135": { x: 40.4, y: 35.1 },
      "137": { x: 40.4, y: 26.8 },
      "138": { x: 40.3, y: 24 },
      "139": { x: 40.3, y: 21.4 },
      "140": { x: 40.3, y: 16.5 },
      "141": { x: 36.1, y: 16.4 },
      "142": { x: 31, y: 16.5 },
      "143": { x: 27.5, y: 16.5 },
    },
    B: {
      "101": { x: 68.3, y: 16.2 },
      "103": { x: 63, y: 16.4 },
      "105": { x: 57, y: 16.7 },
      "106": { x: 57, y: 28.4 },
      "107": { x: 57, y: 32.1 },
      "108": { x: 57, y: 37.9 },
      "111": { x: 56.8, y: 60.4 },
      "112": { x: 57.5, y: 63.3 },
      "113": { x: 57.5, y: 74 },
      "117": { x: 57.4, y: 90.1 },
      "119": { x: 65.6, y: 90.1 },
      "120": { x: 68.9, y: 90.1 },
      "121": { x: 76.7, y: 90.1 },
      "122": { x: 79.7, y: 90.1 },
      "123": { x: 83.3, y: 90.1 },
      "124": { x: 87.6, y: 90.1 },
      "127": { x: 89.4, y: 74.6 },
      "128": { x: 89.4, y: 70.4 },
      "129": { x: 89.4, y: 67 },
      "130": { x: 89.5, y: 63.6 },
      "131": { x: 89.5, y: 43.6 },
      "132": { x: 89.5, y: 39.1 },
      "138": { x: 89.5, y: 16.2 },
      "139": { x: 83.6, y: 16.2 },
      "141": { x: 75, y: 16.3 },
    },
  },
  "2F": {
    A: {
      "201": { x: 21.7, y: 14.4 },
      "202": { x: 18.8, y: 14.4 },
      "203": { x: 15.8, y: 14.4 },
      "204": { x: 9.6, y: 14.4 },
      "205": { x: 9.6, y: 21.5 },
      "206": { x: 9.6, y: 29.2 },
      "207": { x: 9.6, y: 37.3 },
      "208": { x: 9.6, y: 51 },
      "209": { x: 9.6, y: 63.4 },
      "210": { x: 9.6, y: 76.7 },
      "211": { x: 9.5, y: 85.5 },
      "212": { x: 9.5, y: 91.8 },
      "213": { x: 20.8, y: 91.9 },
      "215": { x: 16, y: 42.7 },
      "216": { x: 31.6, y: 91.8 },
      "217": { x: 41.7, y: 91.9 },
      "218": { x: 41.7, y: 84.6 },
      "224": { x: 41.8, y: 37.1 },
      "226": { x: 41.8, y: 21.1 },
      "227": { x: 41.7, y: 14.4 },
      "228": { x: 36.9, y: 14.4 },
      "229": { x: 30.1, y: 14.4 },
    },
    B: {
      "201": { x: 69.1, y: 14.1 },
      "202": { x: 66.3, y: 14.1 },
      "203": { x: 63.2, y: 14.1 },
      "204": { x: 58.1, y: 14.1 },
      "205": { x: 58.1, y: 21 },
      "206": { x: 58.1, y: 29.5 },
      "207": { x: 58.1, y: 36.6 },
      "208": { x: 58.1, y: 51.4 },
      "209": { x: 58.1, y: 62.8 },
      "210": { x: 58.1, y: 77.4 },
      "211": { x: 58, y: 85.1 },
      "212": { x: 58, y: 92.2 },
      "213": { x: 68.4, y: 92.2 },
      "214": { x: 63.5, y: 69.4 },
      "215": { x: 63.5, y: 42.7 },
      "216": { x: 78.7, y: 92.2 },
      "218": { x: 90.3, y: 85.7 },
      "219": { x: 90.3, y: 77 },
      "220": { x: 90.3, y: 69.9 },
      "221": { x: 89, y: 63.1 },
      "222": { x: 90.3, y: 50.7 },
      "223": { x: 90.3, y: 42.9 },
      "224": { x: 90.2, y: 36.1 },
      "225": { x: 89.4, y: 28 },
      "226": { x: 89.4, y: 21.1 },
      "227": { x: 89.4, y: 14.5 },
      "228": { x: 84.5, y: 14.4 },
      "229": { x: 77.6, y: 14.4 },
      "230": { x: 84.4, y: 37.8 },
    },
  },
  B1: {
    A: {
      "101": { x: 9, y: 87.8 },
      "102": { x: 8.8, y: 78.2 },
      "105": { x: 20, y: 69.5 },
      "B-105": { x: 20, y: 69.5 },
      "B-102": { x: 8.8, y: 78.2 },
      "B-101": { x: 9, y: 87.8 },
    },
    B: {
      "105": { x: 67.7, y: 69.4 },
      "106": { x: 67.7, y: 59.8 },
      "107": { x: 78.7, y: 88.6 },
      "B-106": { x: 67.7, y: 59.8 },
      "B-105": { x: 67.7, y: 69.4 },
      "B-107": { x: 78.7, y: 88.6 },
    },
  },
};

/** 미등록 호실 폴백 — A 좌 / B 우 */
const MD_PANELS: Record<Floor, Record<Building, { left: number; top: number; width: number; height: number }>> = {
  "1F": {
    A: { left: 6.0, top: 15.0, width: 36.0, height: 76.0 },
    B: { left: 55.0, top: 15.0, width: 36.0, height: 76.0 },
  },
  "2F": {
    A: { left: 8.0, top: 13.0, width: 36.0, height: 80.0 },
    B: { left: 56.0, top: 13.0, width: 36.0, height: 80.0 },
  },
  B1: {
    A: { left: 7.0, top: 55.0, width: 30.0, height: 40.0 },
    B: { left: 60.0, top: 55.0, width: 30.0, height: 40.0 },
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

export function hasMdPin(building: Building, floor: Floor, unitNo: string): boolean {
  return lookupMdPin(building, floor, unitNo) != null;
}

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

export function mdPinCoverage() {
  const out: Record<string, number> = {};
  for (const floor of Object.keys(MD_PINS) as Floor[]) {
    for (const b of Object.keys(MD_PINS[floor]) as Building[]) {
      const bare = new Set(
        Object.keys(MD_PINS[floor][b]).map((k) => (floor === "B1" ? k.replace(/^B-/, "") : k)),
      );
      out[`${floor}-${b}`] = bare.size;
    }
  }
  return out;
}
