import { UnitStatus } from "./types";

export const STATUS_LABEL: Record<UnitStatus, string> = {
  available: "분양중",
  reserved: "예약",
  sold: "완판",
  hidden: "비공개",
};

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

export function formatArea(area: number, unit: string = "unknown") {
  const suffix = unit === "m2" ? "㎡" : unit === "py" ? "평" : "";
  return suffix ? `${area}${suffix}` : `${area}`;
}

export function unitLabel(building: string, unitNo: string) {
  return `${building}동 ${unitNo}`;
}
