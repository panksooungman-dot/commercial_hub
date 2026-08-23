"use client";

import { useEffect, useMemo, useState } from "react";
import {
  designMarkerAdminView,
  emptyDesignMarkerOverrides,
  type DesignMarkerOverrides,
} from "@/lib/design-markers";
import type { DesignBuildingKey, DesignFloorKey } from "@/lib/design-marker-seed";

const BUILDINGS: { key: DesignBuildingKey; label: string }[] = [
  { key: "a", label: "A동" },
  { key: "b", label: "B동" },
];

const FLOORS: { key: DesignFloorKey; label: string }[] = [
  { key: "b1", label: "지하1층" },
  { key: "1f", label: "지상1층" },
  { key: "2f", label: "지상2층" },
];

export default function AdminDesignMarkersPage() {
  const [overrides, setOverrides] = useState<DesignMarkerOverrides>(emptyDesignMarkerOverrides());
  const [building, setBuilding] = useState<DesignBuildingKey>("a");
  const [floor, setFloor] = useState<DesignFloorKey>("1f");
  const [newLabel, setNewLabel] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/design-markers")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then((data: DesignMarkerOverrides) => {
        setOverrides(data);
        setLoaded(true);
      });
  }, []);

  const view = useMemo(
    () => designMarkerAdminView(building, floor, overrides),
    [building, floor, overrides],
  );

  function toggleRemoved(label: string, removed: boolean) {
    setOverrides((prev) => {
      const withoutThis = prev.removed.filter(
        (r) => !(r.building === building && r.floor === floor && r.label === label),
      );
      if (!removed) return { ...prev, removed: withoutThis };
      return { ...prev, removed: [...withoutThis, { building, floor, label }] };
    });
  }

  function toggleNonSellable(label: string, nonSellable: boolean) {
    setOverrides((prev) => {
      const withoutThis = prev.nonSellable.filter(
        (n) => !(n.building === building && n.floor === floor && n.label === label),
      );
      if (!nonSellable) return { ...prev, nonSellable: withoutThis };
      return { ...prev, nonSellable: [...withoutThis, { building, floor, label }] };
    });
  }

  function removeAdded(label: string) {
    setOverrides((prev) => ({
      ...prev,
      added: prev.added.filter((a) => !(a.building === building && a.floor === floor && a.label === label)),
    }));
  }

  function addLabel() {
    const label = newLabel.trim().toUpperCase();
    if (!label) return;
    if (view.base.some((b) => b.label === label) || view.added.some((a) => a.label === label)) {
      setMsg(`「${label}」은(는) 이미 목록에 있습니다.`);
      return;
    }
    setOverrides((prev) => ({ ...prev, added: [...prev.added, { building, floor, label }] }));
    setNewLabel("");
    setMsg("");
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/design-markers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides),
    });
    setSaving(false);
    setMsg(res.ok ? "저장되었습니다. 메인 페이지 공식 설계도면에 바로 반영됩니다." : "저장 실패");
  }

  if (!loaded) {
    return <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted">불러오는 중…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-brand">설계도면 호실 관리</h1>
          <p className="mt-1 text-sm text-muted">
            메인 페이지 &quot;공식 설계도면&quot;에 표시되는 호실 번호를 동·층별로 관리합니다. 도면 위 위치는
            개발팀이 좌표로 관리하며, 여기서 추가한 호실은 도면 하단 여백에 임시로 표시됩니다. 각 호실의
            &quot;표시&quot;·&quot;비매물&quot; 체크박스는 아래 목록에서 바로 켜고 끌 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-brand px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-brand">{msg}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <div className="flex gap-2">
          {BUILDINGS.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => setBuilding(b.key)}
              className={`rounded-full px-4 py-2 text-sm ${
                building === b.key ? "bg-brand text-white" : "border border-line bg-surface"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <span className="mx-1 h-8 w-px bg-line" />
        <div className="flex gap-2">
          {FLOORS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFloor(f.key)}
              className={`rounded-full px-4 py-2 text-sm ${
                floor === f.key ? "bg-brand text-white" : "border border-line bg-surface"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input
          className="border border-line px-3 py-2 text-sm"
          placeholder="예: A123"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addLabel();
          }}
        />
        <button type="button" onClick={addLabel} className="border border-line bg-surface px-3 py-2 text-sm">
          호실 추가
        </button>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-brand-deep">
          기본 호실 <span className="font-normal text-muted">{view.base.length}건</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {view.base.map(({ label, removed, nonSellable }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                removed
                  ? "border-line bg-surface text-muted"
                  : nonSellable
                    ? "border-accent/70 bg-[#fff8e8] text-brand-deep"
                    : "border-brand/40 bg-white text-brand-deep"
              }`}
            >
              <span className={`font-bold ${removed ? "line-through" : ""}`}>{label}</span>
              <label className="flex items-center gap-1 text-[11px] text-muted">
                <input
                  type="checkbox"
                  checked={!removed}
                  onChange={(e) => toggleRemoved(label, !e.target.checked)}
                />
                표시
              </label>
              <label
                className={`flex items-center gap-1 text-[11px] ${removed ? "text-muted/50" : "text-muted"}`}
              >
                <input
                  type="checkbox"
                  checked={nonSellable}
                  disabled={removed}
                  onChange={(e) => toggleNonSellable(label, e.target.checked)}
                />
                비매물
              </label>
            </span>
          ))}
        </div>
        <div className="mt-2 space-y-1 text-xs text-muted">
          <p>
            <strong className="font-medium text-brand-deep">표시</strong> 체크 해제 — 도면 편집 화면에서도
            마커가 완전히 사라집니다(삭제와 동일). 실수로 껐다면 다시 체크하면 바로 복구됩니다.
          </p>
          <p>
            <strong className="font-medium text-brand-deep">비매물</strong> 체크 — 계단·기계실 등 실제로 판매하지
            않는 공용시설이라는 뜻입니다. 위치 정보는 남아있지만 공개 도면에는 표시되지 않고, 호실
            목록·카운트에서도 제외됩니다. 나중에 판매용으로 바뀌면 체크만 해제하면 됩니다.
          </p>
        </div>
      </div>

      {view.added.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-brand-deep">
            관리자 추가 호실 <span className="font-normal text-muted">{view.added.length}건</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {view.added.map(({ label, nonSellable }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-[#fff8e8] px-3 py-1.5 text-sm text-brand-deep"
              >
                {label}
                <label className="flex items-center gap-1 text-[11px] text-muted">
                  <input
                    type="checkbox"
                    checked={nonSellable}
                    onChange={(e) => toggleNonSellable(label, e.target.checked)}
                  />
                  비매물
                </label>
                <button type="button" onClick={() => removeAdded(label)} className="text-muted hover:text-red-600">
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
