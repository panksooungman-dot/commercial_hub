import { Building, Floor } from "@/lib/types";

type Pin = { x: number; y: number };

/**
 * MD Plan 합본(A좌·B우) 핀 좌표(%).
 * 아웃라인 도면에서 호실 칸 bounding box 중심에 맞춤.
 */
const MD_PINS: Record<Floor, Record<Building, Record<string, Pin>>> = {
  "1F": {
    A: {
      "102": { x: 12.6, y: 15.5 },
      "105": { x: 9.7, y: 15.6 },
      "106": { x: 6.3, y: 15.6 },
      "107": { x: 8.7, y: 24.5 },
      "108": { x: 8.1, y: 28.4 },
      "109": { x: 8.1, y: 35.1 },
      "110": { x: 6.3, y: 40.7 },
      "111": { x: 6.2, y: 64.9 },
      "112": { x: 8.7, y: 71.1 },
      "113": { x: 8.7, y: 74.7 },
      "114": { x: 8.0, y: 78.5 },
      "115": { x: 8.0, y: 82.7 },
      "116": { x: 8.1, y: 87.8 },
      "120": { x: 14.8, y: 88.2 },
      "122": { x: 40.0, y: 87.8 },
      "130": { x: 39.9, y: 82.5 },
      "134": { x: 40.0, y: 71.8 },
      "135": { x: 38.2, y: 57.2 },
      "137": { x: 38.2, y: 49.8 },
      "138": { x: 38.2, y: 46.0 },
      "139": { x: 40.0, y: 16.7 },
      "140": { x: 40.0, y: 11.8 },
      "141": { x: 30.4, y: 13.7 },
      "142": { x: 27.1, y: 16.4 },
      "143": { x: 15.1, y: 15.5 },
    },
    B: {
      "101": { x: 64.2, y: 15.5 },
      "103": { x: 61.7, y: 15.5 },
      "105": { x: 58.2, y: 15.6 },
      "106": { x: 58.8, y: 24.5 },
      "107": { x: 58.2, y: 35.1 },
      "108": { x: 60.1, y: 46.2 },
      "111": { x: 60.1, y: 49.8 },
      "112": { x: 58.8, y: 60.8 },
      "113": { x: 58.8, y: 71.2 },
      "117": { x: 58.2, y: 87.8 },
      "119": { x: 58.2, y: 82.7 },
      "120": { x: 63.9, y: 88.2 },
      "121": { x: 67.0, y: 85.7 },
      "122": { x: 70.1, y: 85.1 },
      "123": { x: 77.7, y: 87.9 },
      "124": { x: 80.8, y: 85.7 },
      "127": { x: 88.9, y: 87.9 },
      "128": { x: 89.9, y: 82.6 },
      "129": { x: 90.1, y: 71.7 },
      "130": { x: 90.0, y: 40.8 },
      "131": { x: 90.0, y: 35.3 },
      "132": { x: 89.1, y: 16.7 },
      "138": { x: 89.8, y: 12.1 },
      "139": { x: 79.5, y: 13.7 },
      "141": { x: 76.4, y: 16.3 },
    },
  },
  "2F": {
    A: {
      "201": { x: 8.2, y: 7.6 },
      "202": { x: 16.2, y: 11.0 },
      "203": { x: 12.8, y: 11.0 },
      "204": { x: 4.3, y: 7.7 },
      "205": { x: 6.2, y: 15.3 },
      "206": { x: 6.2, y: 24.2 },
      "207": { x: 6.3, y: 32.5 },
      "208": { x: 6.2, y: 46.5 },
      "209": { x: 6.2, y: 62.1 },
      "210": { x: 6.2, y: 73.8 },
      "211": { x: 6.2, y: 84.2 },
      "212": { x: 6.2, y: 92.3 },
      "213": { x: 18.5, y: 86.2 },
      "215": { x: 13.1, y: 38.0 },
      "216": { x: 29.7, y: 85.8 },
      "217": { x: 40.7, y: 92.1 },
      "218": { x: 40.7, y: 84.2 },
      "224": { x: 40.7, y: 31.6 },
      "226": { x: 40.7, y: 15.0 },
      "227": { x: 40.7, y: 7.9 },
      "228": { x: 35.7, y: 8.0 },
      "229": { x: 28.1, y: 12.9 },
    },
    B: {
      "201": { x: 71.5, y: 11.0 },
      "202": { x: 68.4, y: 11.0 },
      "203": { x: 65.1, y: 11.0 },
      "204": { x: 59.6, y: 7.5 },
      "205": { x: 59.6, y: 15.3 },
      "206": { x: 59.6, y: 24.2 },
      "207": { x: 59.6, y: 32.6 },
      "208": { x: 59.6, y: 48.3 },
      "209": { x: 59.6, y: 60.4 },
      "210": { x: 59.6, y: 75.9 },
      "211": { x: 59.6, y: 84.2 },
      "212": { x: 59.6, y: 92.3 },
      "213": { x: 71.1, y: 86.5 },
      "214": { x: 65.2, y: 67.9 },
      "215": { x: 65.3, y: 38.0 },
      "216": { x: 82.0, y: 86.6 },
      "218": { x: 92.7, y: 92.4 },
      "219": { x: 94.0, y: 84.5 },
      "220": { x: 94.0, y: 75.8 },
      "221": { x: 94.0, y: 68.1 },
      "222": { x: 94.0, y: 60.4 },
      "223": { x: 94.0, y: 47.1 },
      "224": { x: 94.0, y: 31.6 },
      "225": { x: 93.1, y: 22.7 },
      "226": { x: 93.1, y: 15.2 },
      "227": { x: 93.7, y: 8.2 },
      "228": { x: 87.9, y: 8.1 },
      "229": { x: 80.3, y: 12.9 },
      "230": { x: 87.6, y: 33.7 },
    },
  },
  B1: {
    A: {
      "101": { x: 5.7, y: 91.0 },
      "102": { x: 5.7, y: 77.0 },
      "105": { x: 15.5, y: 60.5 },
      "B-101": { x: 5.7, y: 91.0 },
      "B-102": { x: 5.7, y: 77.0 },
      "B-105": { x: 15.5, y: 60.5 },
    },
    B: {
      "105": { x: 68.7, y: 68.2 },
      "106": { x: 69.6, y: 57.9 },
      "107": { x: 81.1, y: 90.9 },
      "B-105": { x: 68.7, y: 68.2 },
      "B-106": { x: 69.6, y: 57.9 },
      "B-107": { x: 81.1, y: 90.9 },
    },
  },
};

/** 미등록 호실 폴백 — A 좌 / B 우 */
const MD_PANELS: Record<Floor, Record<Building, { left: number; top: number; width: number; height: number }>> = {
  "1F": {
    A: { left: 7.5, top: 14.0, width: 35.0, height: 72.0 },
    B: { left: 56.5, top: 14.0, width: 36.0, height: 72.0 },
  },
  "2F": {
    A: { left: 5.5, top: 12.0, width: 36.5, height: 79.0 },
    B: { left: 57.5, top: 12.0, width: 35.0, height: 79.0 },
  },
  B1: {
    A: { left: 7.0, top: 62.0, width: 18.0, height: 28.0 },
    B: { left: 62.0, top: 52.0, width: 28.0, height: 38.0 },
  },
};

export function normalizeUnitNo(unitNo: string): string {
  return unitNo.replace(/^B-/i, "").replace(/^[ABab]-/, "");
}

export function listFloorPins(floor: Floor): { building: Building; unitNo: string; x: number; y: number }[] {
  const out: { building: Building; unitNo: string; x: number; y: number }[] = [];
  for (const building of ["A", "B"] as Building[]) {
    const map = MD_PINS[floor]?.[building] ?? {};
    for (const [unitNo, pin] of Object.entries(map)) {
      if (unitNo.startsWith("B-")) continue;
      out.push({ building, unitNo, x: pin.x, y: pin.y });
    }
  }
  return out.sort((a, b) => {
    if (a.building !== b.building) return a.building.localeCompare(b.building);
    return a.unitNo.localeCompare(b.unitNo, undefined, { numeric: true });
  });
}

export function pinLabel(building: Building, unitNo: string) {
  return `${building}${normalizeUnitNo(unitNo)}`;
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
