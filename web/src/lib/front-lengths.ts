/**
 * 설계도면 4면 정면(외벽) 치수 매핑 — A/B동 · 전 층(B1·1F·2F).
 * 구조 그리드(X/Y)는 층 공통(북·남 84,375mm / 동·서 64,355mm).
 * 도면 마커 라벨(A116, B101…)과 분양 호실 id(A-1F-116, A-B1-B-101…)를 모두 수용.
 */

export type FacadeSide = "north" | "south" | "east" | "west";
export type Floor = "2F" | "1F" | "B1";
export type Building = "A" | "B";

export const FACADE_LABEL: Record<FacadeSide, string> = {
  north: "북측",
  south: "남측",
  east: "동측",
  west: "서측",
};

/** 상단(북측) X축 — 좌→우, 합계 84,375mm */
export const GRID_NORTH_SPANS_MM = [
  2350, 5550, 8160, 7560, 6800, 6520, 4600, 7200, 6800, 7300, 7685, 8450, 5400,
] as const;

/** 하단(남측) X축 — 좌→우, 합계 84,375mm */
export const GRID_SOUTH_SPANS_MM = [
  2350, 5550, 8160, 7560, 6800, 6520, 4600, 7200, 6800, 8200, 8200, 6035, 6400,
] as const;

/** 우측(동측) Y축 — 상→하, 합계 64,355mm */
export const GRID_EAST_SPANS_MM = [
  2350, 4900, 5080, 7295, 8270, 6300, 10230, 7880, 6600, 5450,
] as const;

/** 좌측(서측) Y축 — 상→하 */
export const GRID_WEST_SPANS_MM = [
  2350, 4900, 5080, 8335, 9000, 7025, 9000, 6615, 6600, 5450,
] as const;

export const A1F_NORTH_SPANS_MM = GRID_NORTH_SPANS_MM;
export const A1F_SOUTH_SPANS_MM = GRID_SOUTH_SPANS_MM;
export const A1F_EAST_SPANS_MM = GRID_EAST_SPANS_MM;
export const A1F_WEST_SPANS_MM = GRID_WEST_SPANS_MM;

function splitByWeights(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / sum);
  const rounded = raw.map((n) => Math.round(n));
  const diff = total - rounded.reduce((a, b) => a + b, 0);
  if (diff !== 0 && rounded.length) rounded[rounded.length - 1] += diff;
  return rounded;
}

type Entry = { id: string; mm: number; facade: FacadeSide };

function buildA1FEntries(): Entry[] {
  const n = GRID_NORTH_SPANS_MM;
  const s = GRID_SOUTH_SPANS_MM;
  const e = GRID_EAST_SPANS_MM;
  const w = GRID_WEST_SPANS_MM;

  const [n113, n112] = splitByWeights(n[4], [2.3, 2.2]);
  const [n108, n107] = splitByWeights(n[10], [2.7, 3.3]);
  const south125 = s[4];
  const [s127, s128] = splitByWeights(s[5], [3.0, 2.9]);
  const [s132, s133] = splitByWeights(s[9], [3.0, 3.0]);
  const [s134, s135] = splitByWeights(s[10], [3.0, 3.0]);
  const [s136, s137] = splitByWeights(s[11], [2.6, 1.6]);
  const [s138, s139] = splitByWeights(s[12], [2.5, 2.0]);

  return [
    { id: "A-1F-116", mm: n[1], facade: "north" },
    { id: "A-1F-115", mm: n[2], facade: "north" },
    { id: "A-1F-114", mm: n[3], facade: "north" },
    { id: "A-1F-113", mm: n113, facade: "north" },
    { id: "A-1F-112", mm: n112, facade: "north" },
    { id: "A-1F-111", mm: n[5], facade: "north" },
    { id: "A-1F-110", mm: n[8], facade: "north" },
    { id: "A-1F-109", mm: n[9], facade: "north" },
    { id: "A-1F-108", mm: n108, facade: "north" },
    { id: "A-1F-107", mm: n107, facade: "north" },
    { id: "A-1F-106", mm: n[11], facade: "north" },

    { id: "A-1F-105", mm: e[1], facade: "east" },
    { id: "A-1F-104", mm: e[2], facade: "east" },
    { id: "A-1F-103", mm: e[3], facade: "east" },
    { id: "A-1F-102", mm: e[4], facade: "east" },
    { id: "A-1F-101", mm: e[5], facade: "east" },
    { id: "A-1F-143", mm: e[6], facade: "east" },
    { id: "A-1F-142", mm: e[7], facade: "east" },
    { id: "A-1F-141", mm: e[8], facade: "east" },
    { id: "A-1F-140", mm: e[9], facade: "east" },

    { id: "A-1F-122", mm: s[1], facade: "south" },
    { id: "A-1F-123", mm: s[2], facade: "south" },
    { id: "A-1F-124", mm: s[3], facade: "south" },
    { id: "A-1F-125", mm: south125, facade: "south" },
    { id: "A-1F-126", mm: south125, facade: "south" },
    { id: "A-1F-127", mm: s127, facade: "south" },
    { id: "A-1F-128", mm: s128, facade: "south" },
    { id: "A-1F-129", mm: s[4], facade: "south" },
    { id: "A-1F-130", mm: s[7], facade: "south" },
    { id: "A-1F-131", mm: s[8], facade: "south" },
    { id: "A-1F-132", mm: s132, facade: "south" },
    { id: "A-1F-133", mm: s133, facade: "south" },
    { id: "A-1F-134", mm: s134, facade: "south" },
    { id: "A-1F-135", mm: s135, facade: "south" },
    { id: "A-1F-136", mm: s136, facade: "south" },
    { id: "A-1F-137", mm: s137, facade: "south" },
    { id: "A-1F-138", mm: s138, facade: "south" },
    { id: "A-1F-139", mm: s139, facade: "south" },

    { id: "A-1F-117", mm: w[1], facade: "west" },
    { id: "A-1F-118", mm: w[2], facade: "west" },
    { id: "A-1F-119", mm: w[5], facade: "west" },
    { id: "A-1F-120", mm: w[6], facade: "west" },
    { id: "A-1F-121", mm: w[7], facade: "west" },
  ];
}

function buildA2FEntries(): Entry[] {
  const n = GRID_NORTH_SPANS_MM;
  const s = GRID_SOUTH_SPANS_MM;
  const e = GRID_EAST_SPANS_MM;
  const w = GRID_WEST_SPANS_MM;
  const [s223, s224] = splitByWeights(s[9], [4.1, 4.2]);
  const [s226, s227] = splitByWeights(s[11] + s[12], [2.8, 2.8]);

  return [
    { id: "A-2F-212", mm: n[1], facade: "north" },
    { id: "A-2F-211", mm: n[2], facade: "north" },
    { id: "A-2F-210", mm: n[3], facade: "north" },
    { id: "A-2F-209", mm: n[4], facade: "north" },
    { id: "A-2F-208", mm: n[7], facade: "north" },
    { id: "A-2F-207", mm: n[8], facade: "north" },
    { id: "A-2F-206", mm: n[9], facade: "north" },
    { id: "A-2F-205", mm: n[10], facade: "north" },
    { id: "A-2F-204", mm: n[11], facade: "north" },

    { id: "A-2F-203", mm: e[1], facade: "east" },
    { id: "A-2F-202", mm: e[2], facade: "east" },
    { id: "A-2F-201", mm: e[3], facade: "east" },
    { id: "A-2F-229", mm: e[6], facade: "east" },
    { id: "A-2F-228", mm: e[7], facade: "east" },

    { id: "A-2F-217", mm: s[1], facade: "south" },
    { id: "A-2F-218", mm: s[2], facade: "south" },
    { id: "A-2F-219", mm: s[3], facade: "south" },
    { id: "A-2F-220", mm: s[4], facade: "south" },
    { id: "A-2F-221", mm: s[5], facade: "south" },
    { id: "A-2F-230", mm: s[7], facade: "south" },
    { id: "A-2F-222", mm: s[8], facade: "south" },
    { id: "A-2F-223", mm: s223, facade: "south" },
    { id: "A-2F-224", mm: s224, facade: "south" },
    { id: "A-2F-225", mm: s[10], facade: "south" },
    { id: "A-2F-226", mm: s226, facade: "south" },
    { id: "A-2F-227", mm: s227, facade: "south" },

    { id: "A-2F-213", mm: w[4], facade: "west" },
    { id: "A-2F-216", mm: w[6], facade: "west" },
    { id: "A-2F-214", mm: n[5], facade: "north" },
    { id: "A-2F-215", mm: n[7], facade: "north" },
  ];
}

/** B1: 분양 id(A-B1-B-101) + 마커 대응 id(A-B1-101) 둘 다 등록 */
function buildB1Entries(building: Building): Entry[] {
  const n = GRID_NORTH_SPANS_MM;
  const s = GRID_SOUTH_SPANS_MM;
  const w = GRID_WEST_SPANS_MM;
  const prefix = `${building}-B1`;

  const rows: { no: string; mm: number; facade: FacadeSide }[] = [
    { no: "101", mm: n[0] + n[1], facade: "north" },
    { no: "102", mm: n[2], facade: "north" },
    { no: "103", mm: w[2], facade: "west" },
    { no: "104", mm: w[3], facade: "west" },
    { no: "105", mm: n[5], facade: "north" },
    { no: "106", mm: n[4], facade: "north" },
    { no: "107", mm: s[7], facade: "south" },
    { no: "108", mm: w[6], facade: "west" },
    { no: "109", mm: w[7], facade: "west" },
  ];

  const out: Entry[] = [];
  for (const r of rows) {
    out.push({ id: `${prefix}-${r.no}`, mm: r.mm, facade: r.facade });
    out.push({ id: `${prefix}-B-${r.no}`, mm: r.mm, facade: r.facade });
  }
  return out;
}

function mirrorAtoB(entries: Entry[]): Entry[] {
  return entries
    .filter((e) => e.id.startsWith("A-1F-") || e.id.startsWith("A-2F-"))
    .map((e) => ({ ...e, id: e.id.replace(/^A-/, "B-") }));
}

const ALL_ENTRIES: Entry[] = [
  ...buildA1FEntries(),
  ...buildA2FEntries(),
  ...buildB1Entries("A"),
  ...buildB1Entries("B"),
  ...mirrorAtoB(buildA1FEntries()),
  ...mirrorAtoB(buildA2FEntries()),
];

export const FRONT_LENGTH_MM_BY_UNIT_ID: Record<string, number> = Object.fromEntries(
  ALL_ENTRIES.map((e) => [e.id, e.mm]),
);

export const FRONT_FACADE_BY_UNIT_ID: Record<string, FacadeSide> = Object.fromEntries(
  ALL_ENTRIES.map((e) => [e.id, e.facade]),
);

/** 도면 마커 라벨 → 후보 unitNo 목록 (B1은 101 / B-101 모두) */
export function candidateUnitNos(building: Building, floor: Floor, label: string): string[] {
  const prefix = building.toUpperCase();
  let unitNo = label.toUpperCase().startsWith(prefix)
    ? label.slice(prefix.length)
    : label.replace(/^[ABab]/, "");
  const nos = [unitNo];
  if (floor === "B1") {
    if (!unitNo.startsWith("B-")) nos.push(`B-${unitNo}`);
    else nos.push(unitNo.replace(/^B-/, ""));
  }
  return [...new Set(nos)];
}

export function candidateUnitIds(building: Building, floor: Floor, label: string): string[] {
  return candidateUnitNos(building, floor, label).map((no) => `${building}-${floor}-${no}`);
}

export function frontLengthForUnitId(id: string): number | null {
  return FRONT_LENGTH_MM_BY_UNIT_ID[id] ?? null;
}

export function frontFacadeForUnitId(id: string): FacadeSide | null {
  return FRONT_FACADE_BY_UNIT_ID[id] ?? null;
}

/** 마커/호실번호로 정면길이·면 방향 조회 */
export function resolveFrontLength(
  building: Building,
  floor: Floor,
  labelOrUnitNo: string,
): { mm: number; facade: FacadeSide; id: string } | null {
  const ids = candidateUnitIds(building, floor, labelOrUnitNo);
  // 이미 완전 id가 넘어온 경우
  if (FRONT_LENGTH_MM_BY_UNIT_ID[labelOrUnitNo] != null) {
    return {
      mm: FRONT_LENGTH_MM_BY_UNIT_ID[labelOrUnitNo],
      facade: FRONT_FACADE_BY_UNIT_ID[labelOrUnitNo],
      id: labelOrUnitNo,
    };
  }
  for (const id of ids) {
    if (FRONT_LENGTH_MM_BY_UNIT_ID[id] != null) {
      return { mm: FRONT_LENGTH_MM_BY_UNIT_ID[id], facade: FRONT_FACADE_BY_UNIT_ID[id], id };
    }
  }
  return null;
}
