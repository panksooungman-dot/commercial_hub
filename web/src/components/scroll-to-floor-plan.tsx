"use client";

import { useEffect } from "react";

/** 상세 진입 시 도면 영역으로 스크롤 */
export function ScrollToFloorPlan({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById("floor-plan");
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [enabled]);
  return null;
}
