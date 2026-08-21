"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import Image from "next/image";
import {
  PUBLIC_STATUS_FILTERS,
  STATUS_BORDER,
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
import { DESIGN_MARKER_RAW_SEED } from "@/lib/design-marker-seed";
import {
  DESIGN_MARKER_DEFAULT_POSITION,
  effectiveDesignMarkerLabels,
  emptyDesignMarkerOverrides,
  type DesignMarkerOverrides,
} from "@/lib/design-markers";

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

/** 선택된 호실 목록 버튼을 그 호실의 분양 상태색으로 강조 표시 */
const STATUS_TEXT: Record<Exclude<UnitStatus, "hidden">, string> = {
  available: "text-[#0d5aa7]",
  for_lease: "text-[#1b6b3f]",
  reserved: "text-[#8a5c12]",
  sold: "text-[#4a4a4a]",
  move_in: "text-[#1c4a73]",
};

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

/** design-marker-seed.ts의 좌표 기준 데이터를 그대로 사용 (관리자 추가/삭제 오버레이는 buildEffectiveSeedMarkers에서 적용) */
const RAW_SEED = DESIGN_MARKER_RAW_SEED;

/**
 * 관리자(/admin/design-markers)가 추가·삭제한 호실을 RAW_SEED 좌표 위에 겹쳐 적용한다.
 * 관리자가 새로 추가한 호실은 도면 상 정확한 좌표가 없어 하단 여백에 순서대로 배치된다.
 */
function buildEffectiveSeedMarkers(overrides: DesignMarkerOverrides): MarkerStore {
  const build = (building: BuildingKey, floor: FloorKey): UnitMarker[] => {
    const baseByLabel = new Map(
      RAW_SEED[building][floor].map(([label, x, y, w, h]) => [label, { x, y, w, h }]),
    );
    const labels = effectiveDesignMarkerLabels(building, floor, overrides);
    let extraIndex = 0;
    return labels.map((label) => {
      const hit = baseByLabel.get(label);
      if (hit) return { id: `${building}-${floor}-${label}`, label, ...hit };
      const col = extraIndex % 15;
      const row = Math.floor(extraIndex / 15);
      extraIndex += 1;
      return {
        id: `${building}-${floor}-${label}`,
        label,
        x: 10 + col * 5,
        y: DESIGN_MARKER_DEFAULT_POSITION.y - row * 4,
        w: DESIGN_MARKER_DEFAULT_POSITION.w,
        h: DESIGN_MARKER_DEFAULT_POSITION.h,
      };
    });
  };
  return {
    a: { b1: build("a", "b1"), "1f": build("a", "1f"), "2f": build("a", "2f") },
    b: { b1: build("b", "b1"), "1f": build("b", "1f"), "2f": build("b", "2f") },
  };
}

const MARKERS_STORAGE_KEY = "ivysquare:design-drawing-markers:v7";
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

export function DesignDrawingsSection({
  units = [],
  markerOverrides,
}: {
  units?: DrawingUnitStatus[];
  /** 관리자(/admin/design-markers)가 추가·삭제한 호실 목록. 없으면 RAW_SEED 그대로 사용 */
  markerOverrides?: DesignMarkerOverrides;
}) {
  const seedMarkers = useMemo(
    () => buildEffectiveSeedMarkers(markerOverrides ?? emptyDesignMarkerOverrides()),
    [markerOverrides],
  );
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
    if (typeof window === "undefined") return seedMarkers;
    try {
      const raw = window.localStorage.getItem(MARKERS_STORAGE_KEY);
      if (!raw) return seedMarkers;
      const parsed = JSON.parse(raw);
      const slot = (bk: BuildingKey, fk: FloorKey): UnitMarker[] => {
        const saved = parsed?.[bk]?.[fk];
        if (Array.isArray(saved) && saved.length > 0) return saved as UnitMarker[];
        return seedMarkers[bk][fk];
      };
      return {
        a: { b1: slot("a", "b1"), "1f": slot("a", "1f"), "2f": slot("a", "2f") },
        b: { b1: slot("b", "b1"), "1f": slot("b", "1f"), "2f": slot("b", "2f") },
      };
    } catch {
      return seedMarkers;
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
                        ? `${STATUS_BORDER[st]} ${STATUS_TEXT[st]}`
                        : "border-line bg-white text-brand-deep hover:border-brand"
                    }`}
                    style={active ? { backgroundColor: STATUS_FILL[st] } : undefined}
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
                  raiseAbovePopup={false}
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
