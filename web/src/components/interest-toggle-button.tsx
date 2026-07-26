"use client";

import { useInterestUnits } from "@/hooks/use-interest-units";

export function InterestToggleButton({ unitId }: { unitId: string }) {
  const interest = useInterestUnits();
  if (!interest.ready) return null;

  const selected = interest.isSelected(unitId);
  const atLimit = interest.atLimit && !selected;

  return (
    <button
      type="button"
      disabled={atLimit}
      onClick={() => {
        const res = interest.toggle(unitId);
        if (res.limited) {
          window.alert(`관심 호실은 최대 ${interest.max}개까지 선택할 수 있습니다.`);
        }
      }}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        selected
          ? "bg-[#c45c2a] text-white"
          : atLimit
            ? "cursor-not-allowed border border-line text-muted opacity-60"
            : "border border-brand text-brand hover:bg-brand hover:text-white"
      }`}
    >
      {selected ? "관심 호실에서 제거" : "관심 호실에 담기"}
    </button>
  );
}
