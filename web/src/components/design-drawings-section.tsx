"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import Image from "next/image";
import {
  PUBLIC_STATUS_FILTERS,
  STATUS_FILL,
  STATUS_LABEL,
  type PublicStatusFilter,
} from "@/lib/format";
import type { Building, Floor, UnitStatus } from "@/lib/types";
import { UnitInfoPopup, type UnitPopupInfo } from "@/components/unit-info-popup";
import {
  candidateUnitNos,
  frontFacadeForUnitId,
  resolveFrontLength,
} from "@/lib/front-lengths";

type FloorKey = "b1" | "1f" | "2f";
type BuildingKey = "a" | "b";

export type DrawingUnitStatus = {
  id: string;
  building: Building;
  floor: Floor;
  unitNo: string;
  status: Exclude<UnitStatus, "hidden">;
  exclusiveArea: number;
  exclusiveAreaUnit: string;
  contractArea: number | null;
  frontLengthMm: number | null;
  frontFacade?: "north" | "south" | "east" | "west" | null;
  price: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  recommendedBusiness: string;
  options: string;
};

const FLOOR_KEY_TO_FLOOR: Record<FloorKey, Floor> = {
  b1: "B1",
  "1f": "1F",
  "2f": "2F",
};

const BUILDING_KEY_TO_BUILDING: Record<BuildingKey, Building> = {
  a: "A",
  b: "B",
};

function markerUnitNo(label: string, building: Building): string {
  const prefix = building.toUpperCase();
  if (label.toUpperCase().startsWith(prefix)) return label.slice(prefix.length);
  return label.replace(/^[ABab]/, "");
}

function findUnitForMarker(
  units: DrawingUnitStatus[],
  building: BuildingKey,
  floor: FloorKey,
  label: string,
): DrawingUnitStatus | undefined {
  const b = BUILDING_KEY_TO_BUILDING[building];
  const f = FLOOR_KEY_TO_FLOOR[floor];
  const nos = candidateUnitNos(b, f, label);
  return units.find((u) => u.building === b && u.floor === f && nos.includes(u.unitNo));
}

function statusForMarker(
  units: DrawingUnitStatus[],
  building: BuildingKey,
  floor: FloorKey,
  label: string,
): Exclude<UnitStatus, "hidden"> {
  return findUnitForMarker(units, building, floor, label)?.status ?? "available";
}

function popupInfoForMarker(
  units: DrawingUnitStatus[],
  building: BuildingKey,
  floor: FloorKey,
  label: string,
): UnitPopupInfo {
  const hit = findUnitForMarker(units, building, floor, label);
  const b = BUILDING_KEY_TO_BUILDING[building];
  const f = FLOOR_KEY_TO_FLOOR[floor];
  const unitNo = hit?.unitNo ?? markerUnitNo(label, b);
  const resolved =
    (hit?.id ? resolveFrontLength(b, f, hit.id) : null) ??
    resolveFrontLength(b, f, label) ??
    resolveFrontLength(b, f, unitNo);

  if (hit) {
    return {
      id: hit.id,
      building: hit.building,
      floor: hit.floor,
      unitNo: hit.unitNo,
      status: hit.status,
      exclusiveArea: hit.exclusiveArea,
      exclusiveAreaUnit: hit.exclusiveAreaUnit,
      contractArea: hit.contractArea,
      frontLengthMm: hit.frontLengthMm ?? resolved?.mm ?? null,
      frontFacade: hit.frontFacade ?? resolved?.facade ?? frontFacadeForUnitId(hit.id),
      price: hit.price,
      deposit: hit.deposit ?? null,
      monthlyRent: hit.monthlyRent ?? null,
      recommendedBusiness: hit.recommendedBusiness,
      options: hit.options,
    };
  }

  return {
    building: b,
    floor: f,
    unitNo,
    status: "available",
    frontLengthMm: resolved?.mm ?? null,
    frontFacade: resolved?.facade ?? null,
  };
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.5;
/** 호실 번호가 읽히도록 라이트박스는 확대 상태로 시작 */
const ZOOM_OPEN_DEFAULT = 2.4;

const FLOOR_TABS: { key: FloorKey; label: string }[] = [
  { key: "b1", label: "지하1층" },
  { key: "1f", label: "지상1층" },
  { key: "2f", label: "지상2층" },
];

const BUILDINGS: { key: BuildingKey; label: string }[] = [
  { key: "a", label: "A동" },
  { key: "b", label: "B동" },
];

const DRAWINGS: Record<BuildingKey, Record<FloorKey, { src: string; alt: string }>> = {
  a: {
    b1: { src: "/images/plans/units/design-a-b1-units.jpg", alt: "A블럭 지하1층 평면도" },
    "1f": { src: "/images/plans/units/design-a-1f-units.jpg", alt: "A블럭 지상1층 평면도" },
    "2f": { src: "/images/plans/units/design-a-2f-units.jpg", alt: "A블럭 지상2층 평면도" },
  },
  b: {
    b1: { src: "/images/plans/units/design-b-b1-units.jpg", alt: "B블럭 지하1층 평면도" },
    "1f": { src: "/images/plans/units/design-b-1f-units.jpg", alt: "B블럭 지상1층 평면도" },
    "2f": { src: "/images/plans/units/design-b-2f-units.jpg", alt: "B블럭 지상2층 평면도" },
  },
};

type UnitMarker = { id: string; label: string; x: number; y: number; w?: number; h?: number };
type MarkerStore = Record<BuildingKey, Record<FloorKey, UnitMarker[]>>;

/** MD Plan 스타일: 호실 전체 빨간 면적 표시용 기본 박스 비율(%) — 수동 추가 마커용 */
const DEFAULT_BOX_W = 3.6;
const DEFAULT_BOX_H = 5.2;

/**
 * 도면 위 호실 라벨의 대략 위치·크기(이미지 기준 %). X1~X14 / Y1~Y11 그리드 실측치(mm)를
 * 시트 상 위치 비율로 환산해 배치한 1차 좌표이며, w/h(박스 폭·높이)는 분양 도면 전용면적표 및
 * 인접 호실 간격을 참고해 대략 추정한 값이다 — 실제 벽체 형상과 다를 수 있으며 편집 모드에서
 * 드래그/더블클릭으로 위치·이름을 보정할 수 있다(박스 크기 자체는 아직 편집 UI로 조절 불가).
 */
const RAW_SEED: Record<BuildingKey, Record<FloorKey, [string, number, number, number, number][]>> = {
  a: {
    b1: [
      // 분양 호실만 (A동 B1: B-101, B-102, B-105) — 라벨은 도면 표기 B-xxx
      // 원본 설계도면 PDF의 인쇄 텍스트 좌표를 벡터 추출해 그 바로 위에 라벨이 오도록 보정
      ["A101", 18.27, 17.98, 6.35, 13.32],
      ["A102", 28.24, 17.98, 12.64, 13.32],
      ["A105", 33.86, 36.42, 5.46, 18.72],
    ],
    "1f": [
      // 원본 설계도면 PDF의 인쇄 텍스트(근생A-xxx) 좌표를 벡터 추출해 그 바로 위에 라벨이 오도록 보정
      ["A116", 17.48, 16.68, 3.67, 13.32],
      ["A115", 21.21, 16.68, 3.67, 13.32],
      ["A114", 24.51, 16.68, 3.67, 13.32],
      ["A113", 27.89, 16.68, 3.04, 13.32],
      ["A112", 30.67, 16.68, 3.04, 13.32],
      ["A111", 35.54, 16.68, 5.46, 13.32],
      ["A110", 55.21, 16.33, 5.46, 13.32],
      ["A109", 59.78, 16.33, 5.86, 13.32],
      ["A108", 65.00, 16.33, 3.09, 13.32],
      ["A107", 68.17, 16.33, 3.09, 13.32],
      ["A106", 76.41, 16.33, 11.11, 7.83],
      ["A105", 76.41, 21.71, 11.11, 5.49],
      ["A102", 76.41, 35.24, 8.39, 4.31],
      ["A120", 17.05, 59.22, 11.02, 4.34],
      ["A122", 16.96, 73.38, 4.46, 7.13],
      ["A123", 20.41, 74.43, 3.6, 7.13],
      ["A124", 23.65, 74.43, 3.2, 7.13],
      ["A125", 29.84, 74.43, 5.5, 7.13],
      ["A126", 33.64, 75.57, 3.2, 7.13],
      ["A127", 36.60, 74.43, 2.9, 7.13],
      ["A128", 38.57, 75.57, 2.9, 7.13],
      ["A129", 42.08, 74.43, 3.5, 7.13],
      ["A130", 47.92, 73.38, 2.89, 7.13],
      ["A134", 59.40, 73.38, 2.93, 7.13],
      ["A135", 62.76, 73.38, 2.93, 7.13],
      ["A137", 69.75, 74.43, 3.09, 7.13],
      ["A138", 72.09, 73.38, 3.40, 7.13],
      ["A139", 74.45, 74.43, 3.40, 7.13],
      ["A140", 78.16, 73.38, 4.32, 5.89],
      ["A141", 78.24, 65.62, 4.32, 7.12],
      ["A142", 78.24, 56.92, 4.32, 8.51],
      ["A143", 78.24, 51.54, 11.11, 11.05],
    ],
    "2f": [
      // 원본 설계도면 PDF의 인쇄 텍스트(근생A-xxx) 좌표를 벡터 추출해 그 바로 위에 라벨이 오도록 보정
      ["A212", 17.94, 17.07, 4.46, 13.32],
      ["A211", 23.45, 17.07, 6.56, 13.32],
      ["A210", 30.22, 17.07, 6.08, 13.32],
      ["A209", 39.61, 17.07, 10.70, 13.32],
      ["A208", 49.89, 17.07, 5.79, 13.32],
      ["A207", 59.40, 17.07, 5.46, 13.32],
      ["A206", 66.21, 17.07, 5.86, 13.32],
      ["A205", 72.82, 17.07, 6.18, 13.32],
      ["A204", 78.48, 17.07, 6.79, 13.32],
      ["A213", 17.90, 36.60, 11.02, 18.72],
      ["A215", 56.74, 30.11, 5.46, 9.00],
      ["A216", 20.54, 57.55, 11.02, 16.87],
      ["A217", 17.47, 73.98, 4.46, 7.13],
      ["A218", 23.13, 73.98, 6.56, 7.13],
      ["A224", 61.09, 73.98, 5.86, 7.13],
      ["A226", 73.62, 73.98, 6.79, 7.13],
      ["A227", 78.48, 73.98, 4.32, 7.13],
      ["A203", 78.47, 29.94, 4.32, 7.88],
      ["A202", 78.54, 34.58, 4.32, 4.74],
      ["A201", 78.61, 39.03, 4.32, 4.19],
      ["A229", 74.91, 55.12, 11.11, 11.05],
      ["A228", 78.67, 65.31, 4.32, 8.51],
    ],
  },
  b: {
    b1: [
      // 분양 호실만 (B동 B1: B-105, B-106, B-107)
      // 원본 설계도면 PDF의 인쇄 텍스트 좌표를 벡터 추출해 그 바로 위에 라벨이 오도록 보정
      ["B105", 33.50, 36.17, 5.46, 18.72],
      ["B106", 42.67, 36.17, 5.24, 18.72],
      ["B107", 18.88, 56.14, 12.91, 9.72],
    ],
    "1f": [
      // 원본 설계도면 PDF의 인쇄 텍스트(근생B-xxx) 좌표를 벡터 추출해 그 바로 위에 라벨이 오도록 보정
      ["B117", 17.31, 19.84, 4.46, 13.32],
      ["B113", 30.59, 19.84, 5.24, 13.32],
      ["B112", 39.14, 19.84, 1.85, 13.32],
      ["B111", 42.13, 19.84, 1.85, 13.32],
      ["B108", 59.77, 19.84, 5.86, 13.32],
      ["B107", 64.97, 19.84, 3.09, 13.32],
      ["B106", 68.06, 19.84, 3.09, 13.32],
      ["B105", 76.64, 20.57, 11.11, 7.83],
      ["B103", 76.64, 30.04, 8.39, 4.00],
      ["B101", 76.64, 38.88, 8.39, 9.15],
      ["B119", 16.74, 35.45, 11.02, 4.86],
      ["B120", 16.74, 40.52, 11.02, 4.86],
      ["B121", 16.74, 53.92, 11.02, 5.38],
      ["B122", 16.74, 58.68, 11.02, 4.34],
      ["B123", 16.74, 64.11, 11.02, 7.15],
      ["B124", 16.74, 71.66, 11.02, 7.13],
      ["B127", 30.09, 75.78, 2.73, 7.13],
      ["B128", 33.66, 75.78, 2.73, 7.13],
      ["B129", 36.24, 76.87, 2.62, 7.13],
      ["B130", 39.20, 75.78, 2.62, 7.13],
      ["B131", 55.51, 75.78, 1.82, 7.13],
      ["B132", 59.65, 75.78, 1.82, 7.13],
      ["B138", 78.15, 73.25, 4.32, 7.13],
      ["B139", 77.71, 66.20, 4.32, 8.51],
      ["B141", 77.08, 51.57, 11.11, 11.05],
    ],
    "2f": [
      // 원본 설계도면 PDF의 인쇄 텍스트(근생B-xxx) 좌표를 벡터 추출해 그 바로 위에 라벨이 오도록 보정
      ["B212", 17.24, 19.72, 4.46, 7.83],
      ["B211", 22.49, 19.72, 6.56, 7.83],
      ["B210", 28.78, 19.72, 6.08, 7.83],
      ["B209", 40.52, 19.72, 5.24, 7.83],
      ["B208", 48.85, 19.72, 5.79, 7.83],
      ["B207", 60.76, 19.72, 5.46, 7.83],
      ["B206", 66.40, 19.72, 5.86, 7.83],
      ["B205", 73.15, 19.72, 6.18, 7.83],
      ["B204", 78.69, 19.72, 6.79, 7.83],
      ["B203", 78.29, 29.88, 11.11, 7.88],
      ["B202", 78.37, 35.16, 11.11, 4.59],
      ["B201", 78.43, 39.58, 11.11, 4.34],
      ["B213", 17.49, 38.26, 17.10, 18.72],
      ["B214", 34.86, 29.92, 5.24, 9.00],
      ["B215", 56.17, 29.92, 5.46, 9.00],
      ["B216", 17.38, 55.99, 11.02, 16.87],
      ["B218", 23.06, 76.58, 4.46, 7.13],
      ["B219", 28.98, 76.58, 12.64, 7.13],
      ["B220", 34.55, 76.58, 5.46, 7.13],
      ["B221", 39.78, 76.58, 5.24, 7.13],
      ["B222", 49.99, 76.58, 5.79, 7.13],
      ["B223", 55.80, 76.58, 5.46, 7.13],
      ["B224", 61.25, 76.58, 5.86, 7.13],
      ["B225", 67.51, 73.40, 6.18, 7.13],
      ["B226", 73.34, 73.40, 6.79, 7.13],
      ["B227", 78.22, 73.38, 4.32, 7.13],
      ["B228", 77.56, 66.80, 4.32, 7.15],
      ["B229", 74.98, 54.01, 11.11, 9.72],
      ["B230", 59.71, 65.18, 5.86, 7.15],
    ],
  },
};

function buildSeedMarkers(raw: typeof RAW_SEED): MarkerStore {
  const build = (building: BuildingKey, floor: FloorKey): UnitMarker[] =>
    raw[building][floor].map(([label, x, y, w, h]) => ({ id: `${building}-${floor}-${label}`, label, x, y, w, h }));
  return {
    a: { b1: build("a", "b1"), "1f": build("a", "1f"), "2f": build("a", "2f") },
    b: { b1: build("b", "b1"), "1f": build("b", "1f"), "2f": build("b", "2f") },
  };
}

const SEED_MARKERS: MarkerStore = buildSeedMarkers(RAW_SEED);

const MARKERS_STORAGE_KEY = "ivysquare:design-drawing-markers:v5";
const DRAG_CLICK_THRESHOLD = 6;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function makeMarkerId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `m_${Math.random().toString(36).slice(2)}_${performance.now()}`;
}

function MarkerPin({
  marker,
  editable,
  selected = false,
  dimmed = false,
  raiseAbovePopup = true,
  pinScale = 1,
  compact = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDoubleClick,
  onDelete,
}: {
  marker: UnitMarker;
  editable: boolean;
  /** 호실목록에서 선택된 마커인지 — 선택 시 빨간 핀으로 강조 표시 */
  selected?: boolean;
  /** 다른 마커가 선택되어 있을 때 나머지 마커를 흐리게 처리해 선택된 핀을 돋보이게 함 */
  dimmed?: boolean;
  /**
   * 선택 시 정보 팝업(z-70) 위로 뜨도록 z-index를 올릴지 여부. 라이트박스가 열려 있을 때 썸네일
   * 라벨까지 이 값을 쓰면 라이트박스 배경(z-50)마저 뚫고 비쳐 보이므로, 그 경우엔 꺼야 한다.
   */
  raiseAbovePopup?: boolean;
  /** 부모(도면)에 확대/축소 transform이 걸려 있을 때 마커 자체 크기는 화면상 일정하게 유지하기 위한 역배율 */
  pinScale?: number;
  /** 좁은 화면 축소 미리보기(모바일)에서는 라벨을 더 작게 표시해 밀집한 호실도 겹침을 줄여 보이게 함 */
  compact?: boolean;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onDoubleClick?: () => void;
  onDelete?: () => void;
}) {
  const wrapperClassName = `absolute select-none transition-opacity duration-200 ${
    editable ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
  } ${selected && raiseAbovePopup ? "z-[75]" : ""} ${dimmed ? "opacity-40" : ""}`;
  const wrapperStyle = {
    left: `${marker.x}%`,
    top: `${marker.y}%`,
    transform: `translate(-50%, -50%) scale(${pinScale})`,
  };

  if (!editable) {
    // 도면이 잘 보이도록 배지 없이 굵은 글씨 라벨만 표시하고, 흰색 텍스트 외곽선으로 도면선 위에서도 읽히게 한다
    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <span
          className={`relative whitespace-nowrap font-extrabold leading-none ${
            selected
              ? compact
                ? "text-[12px] sm:text-[16px] text-[#d32f2f]"
                : "text-[16px] text-[#d32f2f]"
              : compact
                ? "text-[9px] sm:text-[13px] text-[#173355]"
                : "text-[13px] text-[#173355]"
          }`}
          style={{
            textShadow:
              "-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, 0 0 4px #fff",
          }}
        >
          {marker.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={wrapperClassName}
      style={wrapperStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      <span className="relative flex h-[18px] min-w-[22px] items-center justify-center gap-0.5 whitespace-nowrap rounded-[3px] border border-[#2f5f9a]/80 bg-[#3d7ab8] px-1.5 text-[9px] font-bold leading-none text-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
        {marker.label}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="ml-0.5 rounded-full bg-black/25 px-1 text-[8px] leading-none text-white hover:bg-black/50"
          aria-label="마커 삭제"
        >
          ✕
        </button>
      </span>
    </div>
  );
}

/**
 * 마커 위치가 실제 벽체와 완전히 일치하지 않을 수 있어, 공개 화면에서는 상태색 테두리를 그리지 않고
 * 굵은 텍스트 라벨(MarkerPin)만으로 상태·선택 여부를 표시한다. 이 컴포넌트는 그 영역의 클릭
 * 대상(호실 정보 팝업을 여는 히트박스)으로만 쓰인다. 편집 모드에서는 기존처럼 박스가 보인다.
 */
function UnitBox({
  marker,
  status = "available",
  editable,
  dimmed = false,
  pinScale = 1,
  onSelect,
  onResizeHandlePointerDown,
  onResizeHandlePointerMove,
  onResizeHandlePointerUp,
}: {
  marker: UnitMarker;
  status?: Exclude<UnitStatus, "hidden">;
  editable?: boolean;
  /** 다른 호실이 선택되어 있을 때 나머지 박스를 흐리게 처리해 선택된 호실을 돋보이게 함(편집 모드에서만 보임) */
  dimmed?: boolean;
  pinScale?: number;
  onSelect?: () => void;
  onResizeHandlePointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeHandlePointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeHandlePointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const w = marker.w ?? DEFAULT_BOX_W;
  const h = marker.h ?? DEFAULT_BOX_H;
  const clickable = Boolean(onSelect) && !editable;
  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={`absolute rounded-[1px] transition-opacity duration-200 ${
        editable
          ? "border border-black/40"
          : `${clickable ? "cursor-pointer" : "pointer-events-none"}`
      } ${dimmed ? "opacity-40" : ""}`}
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transform: "translate(-50%, -50%)",
        backgroundColor: editable ? STATUS_FILL[status] : "transparent",
      }}
      title={`${marker.label} · ${STATUS_LABEL[status]} · 클릭하여 정보 보기`}
      onPointerDown={
        clickable
          ? (e) => {
              e.stopPropagation();
            }
          : undefined
      }
      onClick={
        clickable
          ? (e) => {
              e.stopPropagation();
              onSelect?.();
            }
          : undefined
      }
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onSelect?.();
              }
            }
          : undefined
      }
    >
      {editable && (
        <div
          className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-nwse-resize rounded-sm border border-white bg-[#d63c3c] shadow"
          style={{ transform: `scale(${pinScale})`, transformOrigin: "center" }}
          onPointerDown={onResizeHandlePointerDown}
          onPointerMove={onResizeHandlePointerMove}
          onPointerUp={onResizeHandlePointerUp}
        />
      )}
    </div>
  );
}

export function DesignDrawingsSection({ units = [] }: { units?: DrawingUnitStatus[] }) {
  const [building, setBuilding] = useState<BuildingKey>("a");
  const [floor, setFloor] = useState<FloorKey>("1f");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitPopupInfo | null>(null);
  /** 호실목록에서 고른 호실 라벨 — 도면에 빨간 마커로만 표시하고, 팝업은 그 마커를 눌러야 뜬다 */
  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);
  const figureRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(ZOOM_OPEN_DEFAULT);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, panX: 0, panY: 0 });

  const [markers, setMarkers] = useState<MarkerStore>(() => {
    if (typeof window === "undefined") return SEED_MARKERS;
    try {
      const raw = window.localStorage.getItem(MARKERS_STORAGE_KEY);
      if (!raw) return SEED_MARKERS;
      const parsed = JSON.parse(raw);
      const slot = (bk: BuildingKey, fk: FloorKey): UnitMarker[] => {
        const saved = parsed?.[bk]?.[fk];
        if (Array.isArray(saved) && saved.length > 0) return saved as UnitMarker[];
        return SEED_MARKERS[bk][fk];
      };
      return {
        a: { b1: slot("a", "b1"), "1f": slot("a", "1f"), "2f": slot("a", "2f") },
        b: { b1: slot("b", "b1"), "1f": slot("b", "1f"), "2f": slot("b", "2f") },
      };
    } catch {
      return SEED_MARKERS;
    }
  });
  const [showMarkers, setShowMarkers] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PublicStatusFilter>("all");
  const [editMode, setEditMode] = useState(false);
  const [exportFlash, setExportFlash] = useState(false);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const markerDragId = useRef<string | null>(null);
  const boxResizeId = useRef<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(markers));
  }, [markers]);

  const drawing = DRAWINGS[building][floor];
  const currentMarkers = markers[building][floor];
  const clampScale = (s: number) => clamp(s, ZOOM_MIN, ZOOM_MAX);

  const openLightbox = () => {
    setScale(ZOOM_OPEN_DEFAULT);
    setPan({ x: 0, y: 0 });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setEditMode(false);
  };

  const openUnitPopup = (markerLabel: string) => {
    setHighlightedLabel(markerLabel);
    setSelectedUnit(popupInfoForMarker(units, building, floor, markerLabel));
  };

  const closeUnitPopup = () => setSelectedUnit(null);

  /** 호실목록에서 호실을 고르면 도면에 빨간 마커만 표시한다 — 팝업은 그 마커를 눌러야 뜬다 */
  const highlightMarker = (markerLabel: string) => {
    setSelectedUnit(null);
    setHighlightedLabel(markerLabel);
    figureRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isMarkerSelected = (label: string) => highlightedLabel === label;

  const selectedMarker = highlightedLabel ? currentMarkers.find((m) => isMarkerSelected(m.label)) : undefined;

  /**
   * 라이트박스 안의 마커는 pan/zoom transform이 걸린 컨테이너 안에 있어 z-index만으로는
   * 팝업(z-70) 위로 뜰 수 없다(transform이 별도 stacking context를 만듦). 대신 선택된 마커의
   * 화면상 픽셀 좌표를 계산해 팝업과 같은 레벨(섹션 루트)에 배지를 하나 더 띄워 표시한다.
   */
  const [lightboxMarkerScreenPos, setLightboxMarkerScreenPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!lightboxOpen || !selectedMarker || !selectedUnit) return;
    const updatePos = () => {
      const rect = imageBoxRef.current?.getBoundingClientRect();
      setLightboxMarkerScreenPos(
        rect
          ? {
              left: rect.left + (selectedMarker.x / 100) * rect.width,
              top: rect.top + (selectedMarker.y / 100) * rect.height,
            }
          : null,
      );
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, [lightboxOpen, selectedMarker, selectedUnit, pan, scale]);

  const zoomBy = (delta: number) => setScale((prev) => clampScale(prev + delta));

  const resetView = () => {
    setScale(ZOOM_OPEN_DEFAULT);
    setPan({ x: 0, y: 0 });
  };

  const updateCurrentMarkers = (updater: (list: UnitMarker[]) => UnitMarker[]) => {
    setMarkers((prev) => ({
      ...prev,
      [building]: { ...prev[building], [floor]: updater(prev[building][floor]) },
    }));
  };

  const addMarkerAt = (clientX: number, clientY: number) => {
    const rect = imageBoxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
    const label = window.prompt("호실 번호를 입력하세요 (예: B105)", "");
    if (!label || !label.trim()) return;
    updateCurrentMarkers((list) => [...list, { id: makeMarkerId(), label: label.trim(), x, y }]);
  };

  const renameMarker = (id: string) => {
    const current = currentMarkers.find((m) => m.id === id);
    const next = window.prompt("호실 번호 수정", current?.label ?? "");
    if (next === null) return;
    if (!next.trim()) {
      updateCurrentMarkers((list) => list.filter((m) => m.id !== id));
      return;
    }
    updateCurrentMarkers((list) => list.map((m) => (m.id === id ? { ...m, label: next.trim() } : m)));
  };

  const deleteMarker = (id: string) => {
    updateCurrentMarkers((list) => list.filter((m) => m.id !== id));
  };

  const clearCurrentMarkers = () => {
    if (currentMarkers.length === 0) return;
    if (!window.confirm("현재 도면의 마커를 모두 삭제할까요?")) return;
    updateCurrentMarkers(() => []);
  };

  const exportMarkers = async () => {
    const json = JSON.stringify(markers, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setExportFlash(true);
      setTimeout(() => setExportFlash(false), 1500);
    } catch {
      window.prompt("아래 좌표 데이터를 복사하세요", json);
    }
  };

  const handleWheel = (e: ReactWheelEvent) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = { dragging: true, startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPan({ x: dragState.current.panX + dx, y: dragState.current.panY + dy });
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return;
    const moved = Math.hypot(e.clientX - dragState.current.startX, e.clientY - dragState.current.startY);
    dragState.current.dragging = false;
    if (editMode && moved < DRAG_CLICK_THRESHOLD) {
      addMarkerAt(e.clientX, e.clientY);
    }
  };

  const handlePointerLeave = () => {
    dragState.current.dragging = false;
  };

  const handleMarkerPointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    if (!editMode) return;
    markerDragId.current = id;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMarkerPointerMove = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (markerDragId.current !== id) return;
    const rect = imageBoxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
    updateCurrentMarkers((list) => list.map((m) => (m.id === id ? { ...m, x, y } : m)));
  };

  const handleMarkerPointerUp = () => {
    markerDragId.current = null;
  };

  const handleBoxResizePointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    if (!editMode) return;
    boxResizeId.current = id;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleBoxResizePointerMove = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (boxResizeId.current !== id) return;
    const rect = imageBoxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const marker = currentMarkers.find((m) => m.id === id);
    if (!marker) return;
    const pointerXPct = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerYPct = ((e.clientY - rect.top) / rect.height) * 100;
    const w = clamp(Math.abs(pointerXPct - marker.x) * 2, 0.6, 20);
    const h = clamp(Math.abs(pointerYPct - marker.y) * 2, 0.6, 20);
    updateCurrentMarkers((list) => list.map((m) => (m.id === id ? { ...m, w, h } : m)));
  };

  const handleBoxResizePointerUp = () => {
    boxResizeId.current = null;
  };

  useEffect(() => {
    if (!lightboxOpen && !selectedUnit) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedUnit) {
        closeUnitPopup();
        return;
      }
      if (lightboxOpen) closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    if (lightboxOpen || selectedUnit) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, selectedUnit]);

  const visibleMarkers = useMemo(() => {
    return currentMarkers.filter((m) => {
      const st = statusForMarker(units, building, floor, m.label);
      return statusFilter === "all" || st === statusFilter;
    });
  }, [currentMarkers, units, building, floor, statusFilter]);

  const thumbMarkers = useMemo(
    () => (showMarkers ? visibleMarkers : []),
    [showMarkers, visibleMarkers],
  );

  const statusCounts = useMemo(() => {
    const counts = { available: 0, for_lease: 0, reserved: 0, sold: 0, move_in: 0 };
    for (const m of currentMarkers) {
      const st = statusForMarker(units, building, floor, m.label);
      counts[st] += 1;
    }
    return counts;
  }, [currentMarkers, units, building, floor]);

  return (
    <section className="bg-[#f7f9fb] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Design Drawing</p>
        <h2 className="mt-1 font-display text-3xl text-brand-deep">공식 설계도면</h2>
        <p className="mt-2 text-muted">
          동·층을 골라 호실 위치를 확인해 보세요. 호실을 누르면 면적·상태가 표시됩니다.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
            {BUILDINGS.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => setBuilding(b.key)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  building === b.key
                    ? "bg-brand text-white"
                    : "border border-line bg-white text-muted hover:border-brand"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <div className="flex flex-wrap gap-2">
            {FLOOR_TABS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFloor(f.key)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  floor === f.key
                    ? "bg-brand text-white"
                    : "border border-line bg-white text-muted hover:border-brand"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {currentMarkers.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMarkers((v) => !v)}
              className={`w-full rounded-full px-4 py-2 text-sm transition sm:ml-auto sm:w-auto ${
                showMarkers
                  ? "bg-accent text-brand-deep"
                  : "border border-line bg-white text-muted hover:border-brand"
              }`}
            >
              {showMarkers ? "호실 표시 중" : "호실 표시 숨김"}
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-muted">분양 상태</span>
          {PUBLIC_STATUS_FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? statusCounts.available +
                  statusCounts.for_lease +
                  statusCounts.reserved +
                  statusCounts.sold +
                  statusCounts.move_in
                : statusCounts[f.key];
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatusFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  statusFilter === f.key
                    ? "bg-brand-deep text-white"
                    : "border border-line bg-white text-muted hover:border-brand"
                }`}
              >
                {f.label}
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm border border-[#1e88e5]/70" style={{ backgroundColor: STATUS_FILL.available }} />
            분양가능
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm border border-[#2f9e5c]/75" style={{ backgroundColor: STATUS_FILL.for_lease }} />
            임대가능
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm border border-[#c48520]/80" style={{ backgroundColor: STATUS_FILL.reserved }} />
            예약중
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm border border-[#6a6a6a]/70" style={{ backgroundColor: STATUS_FILL.sold }} />
            계약완료
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm border border-[#2d6eaa]/75" style={{ backgroundColor: STATUS_FILL.move_in }} />
            입주
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-brand-deep">
            {PUBLIC_STATUS_FILTERS.find((f) => f.key === statusFilter)?.label ?? "전체"} 호실 목록
            <span className="ml-1.5 font-normal text-muted">{visibleMarkers.length}건</span>
          </p>
          {visibleMarkers.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {visibleMarkers.map((m) => {
                const st = statusForMarker(units, building, floor, m.label);
                const active = isMarkerSelected(m.label);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => highlightMarker(m.label)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold shadow-sm transition hover:shadow sm:text-sm ${
                      active
                        ? "border-[#e53935] bg-[#e53935]/10 text-[#b71c1c] hover:border-[#e53935]"
                        : "border-line bg-white text-brand-deep hover:border-brand"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_FILL[st] }}
                      aria-hidden
                    />
                    {m.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-2.5 text-sm text-muted">해당 상태의 호실이 없습니다.</p>
          )}
        </div>

        <figure ref={figureRef} className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="relative aspect-[888/661] w-full overflow-hidden bg-[#fbfbfb]">
            <Image
              key={drawing.src}
              src={drawing.src}
              alt={drawing.alt}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              quality={95}
              className="object-contain"
            />
            {thumbMarkers.map((m) => (
              <UnitBox
                key={`box-${m.id}`}
                marker={m}
                status={statusForMarker(units, building, floor, m.label)}
                onSelect={() => openUnitPopup(m.label)}
              />
            ))}
            {thumbMarkers.map((m) => {
              const sel = isMarkerSelected(m.label);
              return (
                <MarkerPin
                  key={m.id}
                  marker={m}
                  editable={false}
                  compact
                  selected={sel}
                  dimmed={Boolean(selectedUnit) && !sel}
                  raiseAbovePopup={!lightboxOpen}
                />
              );
            })}
            <button
              type="button"
              onClick={openLightbox}
              className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-brand-deep/85 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm transition hover:bg-brand-deep"
              aria-label="도면 확대 보기"
            >
              <svg aria-hidden viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8.5 6v5M6 8.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              도면 확대
            </button>
          </div>
          <figcaption className="border-t border-line px-4 py-2 text-xs text-muted">
            {drawing.alt} · 호실을 클릭하면 정보가 표시됩니다 · (주)아센스 종합건축사사무소 제공
          </figcaption>
        </figure>

        {thumbMarkers.length > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-accent sm:hidden">
            <svg aria-hidden viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8.5 6v5M6 8.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            호실 번호가 겹쳐 보일 수 있어요 — &ldquo;도면 확대&rdquo;를 눌러 크게 보세요.
          </p>
        )}

        <p className="mt-3 text-xs text-muted">
          ※ 색칠된 호실을 클릭하면 면적·분양가·상태를 확인할 수 있습니다. 상태는 관리자에서 변경하면 바로 반영됩니다.
        </p>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90" role="dialog" aria-modal="true">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
            <p className="text-sm font-medium">{drawing.alt}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => zoomBy(-ZOOM_STEP)}
                className="h-8 w-8 rounded-full border border-white/30 text-base leading-none hover:bg-white/10"
                aria-label="축소"
              >
                −
              </button>
              <span className="w-12 text-center text-xs tabular-nums text-white/80">
                {Math.round((scale / ZOOM_OPEN_DEFAULT) * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoomBy(ZOOM_STEP)}
                className="h-8 w-8 rounded-full border border-white/30 text-base leading-none hover:bg-white/10"
                aria-label="확대"
              >
                +
              </button>
              <button
                type="button"
                onClick={resetView}
                className="rounded-full border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10"
              >
                화면 초기화
              </button>

              <span className="mx-1 h-5 w-px bg-white/20" />

              <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  editMode ? "bg-accent text-brand-deep" : "border border-white/30 hover:bg-white/10"
                }`}
              >
                {editMode ? "편집 모드 끄기" : "호실 마커 편집"}
              </button>
              {editMode && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowMarkers((v) => !v)}
                    className="rounded-full border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    {showMarkers ? "마커 숨기기" : "마커 보이기"}
                  </button>
                  <button
                    type="button"
                    onClick={clearCurrentMarkers}
                    className="rounded-full border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    이 도면 마커 초기화
                  </button>
                  <button
                    type="button"
                    onClick={exportMarkers}
                    className="rounded-full border border-white/30 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    {exportFlash ? "복사됨!" : "좌표 내보내기"}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={closeLightbox}
                className="ml-1 h-8 w-8 rounded-full border border-white/30 text-base leading-none hover:bg-white/10"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="relative flex-1 touch-none select-none overflow-hidden"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onDoubleClick={() => {
              if (editMode) return;
              setScale((s) => (s > ZOOM_MIN ? ZOOM_MIN : ZOOM_OPEN_DEFAULT));
            }}
          >
            <div
              ref={imageBoxRef}
              className={`absolute left-1/2 top-1/2 aspect-[888/661] w-[min(96vw,1900px)] ${
                editMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
              }`}
              style={{
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={drawing.src}
                alt={drawing.alt}
                fill
                sizes="96vw"
                quality={100}
                className="object-contain"
                draggable={false}
                priority
              />
              {(showMarkers || editMode) &&
                (editMode ? currentMarkers : visibleMarkers).map((m) => {
                  const sel = !editMode && isMarkerSelected(m.label);
                  return (
                    <UnitBox
                      key={`box-${m.id}`}
                      marker={m}
                      status={statusForMarker(units, building, floor, m.label)}
                      editable={editMode}
                      dimmed={!editMode && Boolean(selectedUnit) && !sel}
                      pinScale={1 / scale}
                      onSelect={editMode ? undefined : () => openUnitPopup(m.label)}
                      onResizeHandlePointerDown={(e) => handleBoxResizePointerDown(e, m.id)}
                      onResizeHandlePointerMove={(e) => handleBoxResizePointerMove(e, m.id)}
                      onResizeHandlePointerUp={handleBoxResizePointerUp}
                    />
                  );
                })}
              {(showMarkers || editMode) &&
                (editMode ? currentMarkers : visibleMarkers).map((m) => {
                  const sel = !editMode && isMarkerSelected(m.label);
                  return (
                    <MarkerPin
                      key={m.id}
                      marker={m}
                      editable={editMode}
                      selected={sel}
                      dimmed={!editMode && Boolean(selectedUnit) && !sel}
                      pinScale={1 / scale}
                      onPointerDown={(e) => handleMarkerPointerDown(e, m.id)}
                      onPointerMove={(e) => handleMarkerPointerMove(e, m.id)}
                      onPointerUp={handleMarkerPointerUp}
                      onDoubleClick={() => renameMarker(m.id)}
                      onDelete={() => deleteMarker(m.id)}
                    />
                  );
                })}
            </div>
          </div>

          <p className="px-4 pb-4 text-center text-xs text-white/60 sm:px-6">
            {editMode
              ? "빈 곳 클릭: 마커 추가 · 배지 드래그: 위치 이동 · 빨간 박스 모서리 드래그: 크기 조절 · 더블클릭: 이름 수정 · ✕: 삭제 · 완료 후 '좌표 내보내기'로 저장"
              : "호실 클릭: 정보 팝업 · 마우스 휠로 확대/축소 · 드래그로 이동 · ESC로 닫기"}
          </p>
        </div>
      )}

      {lightboxOpen && selectedUnit && selectedMarker && lightboxMarkerScreenPos && (
        // 라이트박스 안 라벨은 pan/zoom transform 컨테이너에 갇혀 z-index만으로 팝업 위로 뜰 수
        // 없으므로, 선택된 호실의 화면 좌표를 다시 계산해 팝업과 같은 레벨에 라벨을 그려 보이게 한다
        <div
          className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-1/2"
          style={{ left: lightboxMarkerScreenPos.left, top: lightboxMarkerScreenPos.top }}
          aria-hidden
        >
          <span
            className="whitespace-nowrap text-[13px] font-extrabold leading-none text-[#d32f2f]"
            style={{
              textShadow:
                "-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 0 3px #fff",
            }}
          >
            {selectedMarker.label}
          </span>
        </div>
      )}

      {selectedUnit && <UnitInfoPopup unit={selectedUnit} onClose={closeUnitPopup} />}
    </section>
  );
}
