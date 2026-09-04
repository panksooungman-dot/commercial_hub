import { Building, Floor } from "@/lib/types";
import { estimateUnitPin, pinLabel } from "@/lib/unit-pins";

export type OperatingPin = {
  id: string;
  floor: Floor;
  building: Building;
  label: string;
  x: number;
  y: number;
  /** 연결된 분양 호실. 지정하면 팝업에 그 호실 정보가 열립니다. */
  unitId?: string;
  /** 노란 표시에 그리는 호실. 분양 목록에 없어도 그대로 표시합니다. */
  roomLabel?: string;
};

export type OperatingUnitRef = {
  id: string;
  building: Building;
  floor: Floor;
  unitNo: string;
};

export function operatingDisplayRoom(
  pin: OperatingPin,
  units: OperatingUnitRef[] = [],
): string | undefined {
  const manual = pin.roomLabel?.trim();
  if (manual) return manual;
  if (!pin.unitId) return undefined;
  const u = units.find((x) => x.id === pin.unitId);
  return u ? pinLabel(u.building, u.unitNo) : undefined;
}

export function matchOperatingUnitId(
  pin: OperatingPin,
  units: OperatingUnitRef[],
  overlay?: Map<string, { x: number; y: number }>,
) {
  if (pin.unitId && units.some((u) => u.id === pin.unitId)) return pin.unitId;
  if (pin.roomLabel?.trim()) return undefined;
  const same = units.filter((u) => u.floor === pin.floor && u.building === pin.building);
  let bestId: string | undefined;
  let bestD = Infinity;
  for (const u of same) {
    const pos = estimateUnitPin(u.building, u.unitNo, [], u.floor, overlay);
    const d = (pos.x - pin.x) ** 2 + (pos.y - pin.y) ** 2;
    if (d < bestD) {
      bestD = d;
      bestId = u.id;
    }
  }
  return bestId;
}

/** 최초 시드 — 관리자에서 수정하면 operating-pins.json 이 우선합니다. */
export const DEFAULT_OPERATING_PINS: OperatingPin[] = [
  { id: "op-B1-A-soccer", floor: "B1", building: "A", label: "축구교실", x: 7.4, y: 74.7 },
  { id: "op-B1-A-musical", floor: "B1", building: "A", label: "뮤지컬", x: 15.1, y: 56.8 },
  { id: "op-B1-A-storage", floor: "B1", building: "A", label: "무인창고", x: 14.8, y: 47.1 },
  { id: "op-B1-A-craft", floor: "B1", building: "A", label: "공방", x: 25.2, y: 63.8 },
  { id: "op-B1-A-play", floor: "B1", building: "A", label: "실내놀이터", x: 26.7, y: 52.0 },
  { id: "op-B1-B-drum", floor: "B1", building: "B", label: "드럼교실", x: 70.7, y: 69.3 },
  { id: "op-B1-B-delivery", floor: "B1", building: "B", label: "배달음식", x: 73.1, y: 61.9 },

  { id: "op-1F-A-kid", floor: "1F", building: "A", label: "어린이집", x: 19.9, y: 91.7 },
  { id: "op-1F-A-coffee", floor: "1F", building: "A", label: "백억커피", x: 27.4, y: 96.0 },
  { id: "op-1F-A-camping", floor: "1F", building: "A", label: "캠핑미트", x: 37.7, y: 94.5 },
  { id: "op-1F-A-rice", floor: "1F", building: "A", label: "무인떡집", x: 37.7, y: 83.0 },
  { id: "op-1F-A-music", floor: "1F", building: "A", label: "수음악학원", x: 36.0, y: 71.4 },
  { id: "op-1F-A-edge", floor: "1F", building: "A", label: "엣지영어", x: 38.0, y: 54.0 },
  { id: "op-1F-B-ud", floor: "1F", building: "B", label: "우대빵부동산", x: 68.8, y: 11.8 },
  { id: "op-1F-B-galbi", floor: "1F", building: "B", label: "돼지생갈비찜", x: 63.7, y: 13.0 },
  { id: "op-1F-B-style", floor: "1F", building: "B", label: "스타일뷰티", x: 91.6, y: 13.4 },
  { id: "op-1F-B-flower", floor: "1F", building: "B", label: "송도꽃집", x: 91.4, y: 16.6 },
  { id: "op-1F-B-hair", floor: "1F", building: "B", label: "머리염색", x: 91.1, y: 19.7 },
  { id: "op-1F-B-nail", floor: "1F", building: "B", label: "네일샵", x: 90.9, y: 22.5 },
  { id: "op-1F-B-leuen", floor: "1F", building: "B", label: "르엔뷰티", x: 54.6, y: 83.5 },
  { id: "op-1F-B-bake", floor: "1F", building: "B", label: "베이크빵집", x: 59.2, y: 49.3 },
  { id: "op-1F-B-pizza", floor: "1F", building: "B", label: "피자배달전문", x: 59.6, y: 45.2 },

  { id: "op-2F-A-jnc", floor: "2F", building: "A", label: "제이엔씨영어학원", x: 41.1, y: 20.9 },
  { id: "op-2F-A-studio", floor: "2F", building: "A", label: "스튜디오", x: 35.9, y: 30.9 },
  { id: "op-2F-A-piano", floor: "2F", building: "A", label: "피아노학원", x: 42.0, y: 45.6 },
  { id: "op-2F-B-science", floor: "2F", building: "B", label: "교습소 과학", x: 94.5, y: 89.3 },
  { id: "op-2F-B-posture", floor: "2F", building: "B", label: "체형교정", x: 86.7, y: 8.1 },
];

export function operatingPinsForFloor(
  pins: OperatingPin[],
  floor: Floor,
  building: Building | "" = "",
) {
  return pins.filter((p) => p.floor === floor && (building === "" || p.building === building));
}

export function operatingOverlayPins(
  pins: OperatingPin[],
  floor: Floor,
  building: Building | "" = "",
  units: OperatingUnitRef[] = [],
  overlay?: Map<string, { x: number; y: number }>,
) {
  return operatingPinsForFloor(pins, floor, building).map((p) => {
    const unitId = matchOperatingUnitId(p, units, overlay);
    return {
      id: p.id,
      building: p.building,
      unitNo: p.label,
      x: p.x,
      y: p.y,
      label: p.label,
      tone: "operating" as const,
      unitId,
      roomLabel: operatingDisplayRoom(p, units),
    };
  });
}
