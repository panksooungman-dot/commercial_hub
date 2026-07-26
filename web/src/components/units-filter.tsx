"use client";

import { useRouter } from "next/navigation";
import { PUBLIC_STATUS_FILTERS } from "@/lib/format";

export function UnitsFilter({
  floor,
  building,
  q,
  status = "",
}: {
  floor: string;
  building: string;
  q: string;
  status?: string;
}) {
  const router = useRouter();

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { floor, building, q, status, ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/units?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={floor}
          onChange={(e) => apply({ floor: e.target.value })}
          className="border border-line bg-surface px-3 py-2 text-sm"
        >
          <option value="">전체 층</option>
          <option value="2F">2F</option>
          <option value="1F">1F</option>
          <option value="B1">B1</option>
        </select>
        <select
          value={building}
          onChange={(e) => apply({ building: e.target.value })}
          className="border border-line bg-surface px-3 py-2 text-sm"
        >
          <option value="">전체 동</option>
          <option value="A">A동</option>
          <option value="B">B동</option>
        </select>
        <input
          defaultValue={q}
          placeholder="호실번호 검색"
          className="border border-line bg-surface px-3 py-2 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") apply({ q: (e.target as HTMLInputElement).value });
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted">분양 상태</span>
        {PUBLIC_STATUS_FILTERS.map((f) => {
          const active = (status || "all") === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => apply({ status: f.key === "all" ? "" : f.key })}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                active
                  ? "bg-brand-deep text-white"
                  : "border border-line bg-surface text-muted hover:border-brand"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
