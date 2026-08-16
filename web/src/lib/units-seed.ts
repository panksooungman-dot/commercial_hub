import { Building, Floor, Unit } from "./types";
import { frontLengthForUnitId } from "./front-lengths";
import { applyPptPricing } from "./unit-pricing";

type SeedRow = { building: Building; floor: Floor; unitNo: string; exclusiveArea: number };

const rows: SeedRow[] = [
  // 2F A
  ...[
    ["201", 15.36], ["202", 16.72], ["203", 17.95], ["204", 18.18], ["205", 26.37],
    ["206", 25.35], ["207", 27.29], ["208", 28.73], ["209", 27.34], ["210", 28.48],
    ["211", 26.21], ["212", 18.45], ["213", 51.73], ["215", 17.94], ["216", 52.81],
    ["217", 11.71], ["218", 15.14], ["224", 14.5], ["226", 11.92], ["227", 12.36],
    ["228", 11.97], ["229", 50.32],
  ].map(([unitNo, exclusiveArea]) => ({
    building: "A" as const,
    floor: "2F" as const,
    unitNo: String(unitNo),
    exclusiveArea: Number(exclusiveArea),
  })),
  // 2F B
  ...[
    ["201", 15.36], ["202", 16.72], ["203", 17.95], ["204", 12.88], ["205", 18.37],
    ["206", 17.66], ["207", 14.42], ["208", 16.49], ["209", 15.23], ["210", 15.99],
    ["211", 18.26], ["212", 13.91], ["213", 51.78], ["214", 11.62], ["215", 17.94],
    ["216", 52.86], ["218", 23.99], ["219", 20.16], ["220", 19.17], ["221", 20.13],
    ["222", 26.59], ["223", 14.72], ["224", 23.12], ["225", 15.0], ["226", 11.23],
    ["227", 16.75], ["228", 11.98], ["229", 50.32], ["230", 8.68],
  ].map(([unitNo, exclusiveArea]) => ({
    building: "B" as const,
    floor: "2F" as const,
    unitNo: String(unitNo),
    exclusiveArea: Number(exclusiveArea),
  })),
  // 1F A
  ...[
    ["102", 12.02], ["105", 22.06], ["106", 20.57], ["107", 14.88], ["108", 11.77],
    ["109", 14.26], ["110", 10.69], ["111", 13.46], ["112", 13.09], ["113", 12.12],
    ["114", 13.36], ["115", 12.71], ["116", 16.49], ["120", 12.37], ["122", 14.18],
    ["130", 15.65], ["134", 10.01], ["135", 10.03], ["137", 7.13], ["138", 6.88],
    ["139", 6.91], ["140", 16.01], ["141", 11.61], ["142", 16.18], ["143", 27.79],
  ].map(([unitNo, exclusiveArea]) => ({
    building: "A" as const,
    floor: "1F" as const,
    unitNo: String(unitNo),
    exclusiveArea: Number(exclusiveArea),
  })),
  // 1F B
  ...[
    ["101", 13.96], ["103", 16.39], ["105", 29.65], ["106", 10.92], ["107", 8.11],
    ["108", 9.55], ["111", 8.95], ["112", 9.44], ["113", 9.76], ["117", 12.66],
    ["119", 11.45], ["120", 19.47], ["121", 9.44], ["122", 12.37], ["123", 10.0],
    ["124", 12.61], ["127", 17.83], ["128", 11.25], ["129", 11.25], ["130", 12.34],
    ["131", 19.75], ["132", 13.89], ["138", 19.7], ["139", 11.61], ["141", 26.54],
  ].map(([unitNo, exclusiveArea]) => ({
    building: "B" as const,
    floor: "1F" as const,
    unitNo: String(unitNo),
    exclusiveArea: Number(exclusiveArea),
  })),
  // B1 A
  ...[
    ["B-101", 44.02], ["B-102", 47.97], ["B-105", 24.65],
  ].map(([unitNo, exclusiveArea]) => ({
    building: "A" as const,
    floor: "B1" as const,
    unitNo: String(unitNo),
    exclusiveArea: Number(exclusiveArea),
  })),
  // B1 B
  ...[
    ["B-105", 34.17], ["B-106", 33.15], ["B-107", 48.38],
  ].map(([unitNo, exclusiveArea]) => ({
    building: "B" as const,
    floor: "B1" as const,
    unitNo: String(unitNo),
    exclusiveArea: Number(exclusiveArea),
  })),
];

const mdByFloor: Record<Floor, string> = {
  "2F": "학원·메디컬·여성뷰티·금융",
  "1F": "리테일·식음·카페·생활편의",
  B1: "교습·운동·공방·스튜디오",
};

export function buildSeedUnits(): Unit[] {
  const now = new Date().toISOString();
  return rows.map((row, index) => {
    const id = `${row.building}-${row.floor}-${row.unitNo}`;
    const unit: Unit = {
      id,
      building: row.building,
      floor: row.floor,
      unitNo: row.unitNo,
      exclusiveArea: row.exclusiveArea,
      exclusiveAreaUnit: "py" as const,
      contractArea: null,
      frontLengthMm: frontLengthForUnitId(id),
      price: null,
      status: "available" as const,
      recommendedBusiness: mdByFloor[row.floor],
      options: "",
      memo: "",
      sortOrder: index + 1,
      updatedAt: now,
    };
    return applyPptPricing(unit);
  });
}
