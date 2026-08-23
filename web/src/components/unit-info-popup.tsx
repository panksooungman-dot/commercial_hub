"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatAreaM2, formatLeaseLine, formatManwon, STATUS_FILL, STATUS_LABEL, unitLabel } from "@/lib/format";
import type { UnitPopupInfo } from "@/lib/unit-popup";

export type { UnitPopupInfo };

export function UnitInfoPopup({
  unit,
  onClose,
}: {
  unit: UnitPopupInfo;
  onClose: () => void;
}) {
  const title = unit.shopLabel || unitLabel(unit.building, unit.unitNo);
  const unitLine = unit.unitNo
    ? `${unitLabel(unit.building, unit.unitNo)} · ${unit.floor}`
    : `${unit.building}동 · ${unit.floor}`;
  const detailHref = unit.id
    ? `/units/${unit.id}#floor-plan`
    : `/plan?building=${unit.building}&floor=${unit.floor}`;
  const contactHref = `/contact?building=${unit.building}&floor=${unit.floor}${
    unit.unitNo ? `&unit=${unit.unitNo}` : ""
  }`;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unit-popup-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">
              {unit.shopLabel ? "영업 점포 · 호실 정보" : "호실 정보"}
            </p>
            <h3 id="unit-popup-title" className="mt-1 font-display text-2xl text-brand-deep">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {unit.shopLabel ? unitLine : `${unit.building}동 · ${unit.floor}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-2.5 py-1 text-sm text-muted hover:border-brand hover:text-brand"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-5 rounded-sm border border-black/10"
              style={{ backgroundColor: STATUS_FILL[unit.status] }}
              aria-hidden
            />
            <span className="rounded-full bg-brand-deep/90 px-2.5 py-0.5 text-xs font-medium text-white">
              {STATUS_LABEL[unit.status]}
            </span>
            {unit.shopLabel ? (
              <span className="rounded-full bg-[#ffc000] px-2.5 py-0.5 text-xs font-bold text-[#3a2a00]">
                영업중
              </span>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[#f7f9fb] px-3 py-2.5">
              <dt className="text-xs text-muted">전용면적(㎡)</dt>
              <dd className="mt-0.5 font-medium text-brand-deep">
                {unit.exclusiveArea != null
                  ? formatAreaM2(unit.exclusiveArea, unit.exclusiveAreaUnit || "unknown")
                  : "확인 중"}
              </dd>
            </div>
            <div className="rounded-xl bg-[#f7f9fb] px-3 py-2.5">
              <dt className="text-xs text-muted">계약면적(평)</dt>
              <dd className="mt-0.5 font-medium text-brand-deep">
                {unit.contractArea != null ? `${unit.contractArea.toLocaleString("ko-KR")}평` : "상담 문의"}
              </dd>
            </div>
            <div className="rounded-xl bg-[#f7f9fb] px-3 py-2.5">
              <dt className="text-xs text-muted">분양가</dt>
              <dd className="mt-0.5 font-medium text-brand-deep">{formatManwon(unit.price)}</dd>
            </div>
            <div className="col-span-2 rounded-xl bg-[#f7f9fb] px-3 py-2.5">
              <dt className="text-xs text-muted">임대조건</dt>
              <dd className="mt-0.5 font-medium text-brand-deep">
                {formatLeaseLine(unit.deposit, unit.monthlyRent)}
              </dd>
            </div>
            <div className="col-span-2 rounded-xl bg-[#f7f9fb] px-3 py-2.5">
              <dt className="text-xs text-muted">권장업종</dt>
              <dd className="mt-0.5 font-medium text-brand-deep">
                {unit.recommendedBusiness || "—"}
              </dd>
            </div>
          </dl>

          {unit.options ? (
            <p className="text-sm text-muted">
              <span className="font-medium text-brand-deep">옵션 </span>
              {unit.options}
            </p>
          ) : null}

          {!unit.id ? (
            <p className="text-xs text-muted">
              이 호실의 상세 데이터가 아직 연결되지 않았습니다. 상담으로 확인해 주세요.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line bg-[#f7f9fb] px-5 py-4">
          <Link
            href={detailHref}
            className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-center text-sm font-medium text-brand-deep hover:border-brand"
            onClick={onClose}
          >
            상세 보기
          </Link>
          <Link
            href={contactHref}
            className="flex-1 rounded-full bg-brand px-4 py-2.5 text-center text-sm font-medium text-white hover:opacity-95"
            onClick={onClose}
          >
            상담 신청
          </Link>
        </div>
      </div>
    </div>
  );
}
