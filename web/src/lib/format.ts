import { UnitStatus } from "./types";

export const STATUS_LABEL: Record<UnitStatus, string> = {
  available: "분양가능",
  for_lease: "임대가능",
  reserved: "예약중",
  sold: "계약완료",
  move_in: "입주",
  hidden: "비공개",
};

/** 도면 호실 면적 표시용 */
export const STATUS_FILL: Record<Exclude<UnitStatus, "hidden">, string> = {
  available: "rgba(220, 60, 60, 0.42)",
  for_lease: "rgba(47, 158, 92, 0.42)",
  reserved: "rgba(210, 140, 30, 0.45)",
  sold: "rgba(110, 110, 110, 0.40)",
  move_in: "rgba(45, 110, 170, 0.42)",
};

export const STATUS_BORDER: Record<Exclude<UnitStatus, "hidden">, string> = {
  available: "border-[#d63c3c]/70",
  for_lease: "border-[#2f9e5c]/75",
  reserved: "border-[#c48520]/80",
  sold: "border-[#6a6a6a]/70",
  move_in: "border-[#2d6eaa]/75",
};

export const PUBLIC_STATUS_FILTERS = [
  { key: "all", label: "전체" },
  { key: "available", label: "분양가능" },
  { key: "for_lease", label: "임대가능" },
  { key: "reserved", label: "예약중" },
  { key: "sold", label: "계약완료" },
  { key: "move_in", label: "입주" },
] as const;

export type PublicStatusFilter = (typeof PUBLIC_STATUS_FILTERS)[number]["key"];

export const FAQ_CATEGORY_LABEL = {
  unit: "호실",
  contract: "계약",
  tax: "세금",
  move_in: "입주",
  parking: "주차",
  rights: "권리",
} as const;

export function formatPrice(price: number | null | undefined) {
  if (price == null) return "상담 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

/** 26,055만원 / 2억 6,055만 형태 */
export function formatManwon(price: number | null | undefined) {
  if (price == null) return "상담 문의";
  const man = Math.round(price / 10000);
  if (man >= 10000) {
    const eok = Math.floor(man / 10000);
    const rest = man % 10000;
    return rest ? `${eok}억 ${rest.toLocaleString("ko-KR")}만원` : `${eok}억원`;
  }
  return `${man.toLocaleString("ko-KR")}만원`;
}

export function formatLeaseLine(
  deposit: number | null | undefined,
  monthlyRent: number | null | undefined,
) {
  if (deposit == null && monthlyRent == null) return "상담 문의";
  const d = deposit != null ? formatManwon(deposit) : "—";
  const r = monthlyRent != null ? formatManwon(monthlyRent) : "—";
  return `보증금 ${d} · 월 ${r}`;
}

export function formatArea(area: number, unit: string = "unknown") {
  const suffix = unit === "m2" ? "㎡" : unit === "py" ? "평" : "";
  return suffix ? `${area}${suffix}` : `${area}`;
}

/** 도면 정면길이(mm) → 예: 8.15m */
export function formatFrontLength(mm: number | null | undefined) {
  if (mm == null || !Number.isFinite(mm) || mm <= 0) return "상담 문의";
  const meters = mm / 1000;
  return `${meters.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}m`;
}

export function unitLabel(building: string, unitNo: string) {
  return `${building}동 ${unitNo}`;
}
