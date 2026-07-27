"use client";

import { useRouter } from "next/navigation";
import { PUBLIC_STATUS_FILTERS } from "@/lib/format";

export function UnitsFilter({
  floor,
  building,
  q,
  status = "",
  basePath = "/plan",
}: {
  floor: string;
  building: string;
  q: string;
  status?: string;
  /** 필터 적용 시 이동 경로 (기본: 호실·도면) */
  basePath?: string;
}) {
  const router = useRouter();

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { floor, building, q, status, ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={floor}
          onChange={(e) => apply({ floor: e.target.value })}
          className="border border-line bg-surface px-3 py-2 text-sm"
        >
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
          key={q}
          placeholder="호실번호 검색"
          className="min-w-[10rem] flex-1 border border-line bg-surface px-3 py-2 text-sm sm:max-w-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") apply({ q: (e.target as HTMLInputElement).value.trim() });
          }}
        />
        <button
          type="button"
          className="rounded-sm border border-line bg-surface px-3 py-2 text-sm hover:border-brand"
          onClick={(e) => {
            const input = (e.currentTarget.parentElement?.querySelector(
              "input",
            ) as HTMLInputElement | null);
            apply({ q: input?.value.trim() || "" });
          }}
        >
          검색
        </button>
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
