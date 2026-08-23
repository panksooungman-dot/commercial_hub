import {
  DESIGN_BUILDING_KEYS,
  DESIGN_FLOOR_KEYS,
  DESIGN_MARKER_RAW_SEED,
  designMarkerBaseLabels,
  type DesignBuildingKey,
  type DesignFloorKey,
} from "./design-marker-seed";

export type DesignMarkerAddition = {
  building: DesignBuildingKey;
  floor: DesignFloorKey;
  label: string;
};

export type DesignMarkerRemoval = {
  building: DesignBuildingKey;
  floor: DesignFloorKey;
  label: string;
};

/** 관리자가 "공용시설(비매물)"로 직접 지정한 마커 — 실제 호실 데이터 유무와 무관하게 비매물로 취급된다 */
export type DesignMarkerNonSellable = {
  building: DesignBuildingKey;
  floor: DesignFloorKey;
  label: string;
};

export type DesignMarkerOverrides = {
  added: DesignMarkerAddition[];
  removed: DesignMarkerRemoval[];
  nonSellable: DesignMarkerNonSellable[];
};

export function emptyDesignMarkerOverrides(): DesignMarkerOverrides {
  return { added: [], removed: [], nonSellable: [] };
}

/** 관리자가 추가한 호실은 도면 위 정확한 위치 데이터가 없어 기본값(여백)에 배치된다 */
export const DESIGN_MARKER_DEFAULT_POSITION = { x: 50, y: 92, w: 4, h: 7 };

function matches(entry: { building: DesignBuildingKey; floor: DesignFloorKey; label: string }, building: DesignBuildingKey, floor: DesignFloorKey) {
  return entry.building === building && entry.floor === floor;
}

/** 해당 동·층에 실제로 표시될 호실 라벨 목록 (기본 좌표 데이터 + 관리자 추가분 − 관리자 삭제분) */
export function effectiveDesignMarkerLabels(
  building: DesignBuildingKey,
  floor: DesignFloorKey,
  overrides: DesignMarkerOverrides,
): string[] {
  const base = designMarkerBaseLabels(building, floor);
  const removedSet = new Set(
    overrides.removed.filter((r) => matches(r, building, floor)).map((r) => r.label),
  );
  const kept = base.filter((label) => !removedSet.has(label));
  const addedLabels = overrides.added
    .filter((a) => matches(a, building, floor))
    .map((a) => a.label)
    .filter((label) => !kept.includes(label));
  return [...kept, ...addedLabels];
}

/** 해당 마커가 관리자에 의해 "공용시설(비매물)"로 직접 지정되었는지 여부 — 실제 호실 데이터 유무와 별개로 적용된다 */
export function isMarkerNonSellable(
  building: DesignBuildingKey,
  floor: DesignFloorKey,
  label: string,
  overrides: DesignMarkerOverrides,
): boolean {
  return overrides.nonSellable.some((n) => matches(n, building, floor) && n.label === label);
}

function sanitizeLabel(label: unknown): string {
  return typeof label === "string" ? label.trim().toUpperCase() : "";
}

export function sanitizeDesignMarkerOverrides(input: unknown): DesignMarkerOverrides {
  const raw = (input && typeof input === "object" ? input : {}) as Partial<DesignMarkerOverrides>;
  const sanitizeList = <T extends { building: unknown; floor: unknown; label: unknown }>(
    list: unknown,
  ): { building: DesignBuildingKey; floor: DesignFloorKey; label: string }[] => {
    if (!Array.isArray(list)) return [];
    const out: { building: DesignBuildingKey; floor: DesignFloorKey; label: string }[] = [];
    const seen = new Set<string>();
    for (const entry of list as T[]) {
      if (!entry || typeof entry !== "object") continue;
      const building = DESIGN_BUILDING_KEYS.includes(entry.building as DesignBuildingKey)
        ? (entry.building as DesignBuildingKey)
        : null;
      const floor = DESIGN_FLOOR_KEYS.includes(entry.floor as DesignFloorKey)
        ? (entry.floor as DesignFloorKey)
        : null;
      const label = sanitizeLabel(entry.label);
      if (!building || !floor || !label) continue;
      const key = `${building}|${floor}|${label}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ building, floor, label });
    }
    return out;
  };
  return {
    added: sanitizeList(raw.added),
    removed: sanitizeList(raw.removed),
    nonSellable: sanitizeList(raw.nonSellable),
  };
}

/** 관리자 페이지에서 동·층별로 "기본 호실(삭제 가능)"과 "추가 호실"을 구분해 보여주기 위한 헬퍼 */
export function designMarkerAdminView(building: DesignBuildingKey, floor: DesignFloorKey, overrides: DesignMarkerOverrides) {
  const base = designMarkerBaseLabels(building, floor);
  const removedSet = new Set(
    overrides.removed.filter((r) => matches(r, building, floor)).map((r) => r.label),
  );
  const nonSellableSet = new Set(
    overrides.nonSellable.filter((n) => matches(n, building, floor)).map((n) => n.label),
  );
  const added = overrides.added.filter((a) => matches(a, building, floor)).map((a) => a.label);
  return {
    base: base.map((label) => ({
      label,
      removed: removedSet.has(label),
      nonSellable: nonSellableSet.has(label),
    })),
    added: added.map((label) => ({ label, nonSellable: nonSellableSet.has(label) })),
  };
}

export { DESIGN_MARKER_RAW_SEED };
