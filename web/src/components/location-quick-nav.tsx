"use client";

import { useEffect, useState } from "react";
import { SiteLocationInfographic } from "@/components/site-location-infographic";

/** 참고 화면(하늘채아이비원 상업)처럼 우측 하단에 "지역도 자세히보기" + 맨 위로 버튼을 띄운다 */
export function LocationQuickNav() {
  const [showTop, setShowTop] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!panelOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  return (
    <>
      <div className="fixed right-5 bottom-8 z-30 hidden flex-col items-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="flex h-20 w-20 flex-col items-center justify-center gap-0.5 rounded-full bg-white shadow-[0_8px_24px_rgba(8,38,60,0.18)] ring-1 ring-line transition hover:ring-brand"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-brand">
            <path
              d="M9 20l-6-2V6l6 2m0 12l6-2m-6 2V8m6 10l6 2V8l-6-2m0 14V6m0 2L9 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-semibold text-brand-deep">지역도</span>
          <span className="text-[9px] text-muted">자세히보기</span>
        </button>
        {showTop ? (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="맨 위로"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-deep text-white shadow-[0_8px_24px_rgba(8,38,60,0.25)] transition hover:bg-brand"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5m0 0l-6 6m6-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>

      {panelOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setPanelOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={`fixed inset-0 z-50 transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="지역도 자세히보기"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
          <h3 className="font-display text-lg text-brand-deep">지역도</h3>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="flex items-center gap-1 text-sm text-muted transition hover:text-brand-deep"
          >
            닫기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="h-[calc(100%-57px)] overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-5xl">
            <SiteLocationInfographic />
          </div>
        </div>
      </div>
    </>
  );
}
