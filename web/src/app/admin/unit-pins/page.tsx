"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PLAN_MEDIA_GALLERY } from "@/lib/plan-media-gallery";
import {
  allDefaultUnitPins,
  estimateUnitPin,
  pinKeyOf,
  pinLabel,
  type UnitPinRecord,
} from "@/lib/unit-pins";
import { Building, Floor } from "@/lib/types";

const FLOORS: Floor[] = ["B1", "1F", "2F"];

function keyOf(p: Pick<UnitPinRecord, "floor" | "building" | "unitNo">) {
  return pinKeyOf(p.floor, p.building, p.unitNo);
}

export default function AdminUnitPinsPage() {
  const [pins, setPins] = useState<UnitPinRecord[]>([]);
  const [floor, setFloor] = useState<Floor>("1F");
  const [side, setSide] = useState<"all" | Building>("all");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [newBuilding, setNewBuilding] = useState<Building>("A");
  const [newUnitNo, setNewUnitNo] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const dragKey = useRef<string | null>(null);
  const dragged = useRef(false);

  const media = PLAN_MEDIA_GALLERY.find((m) => m.floor === floor)!;
  const defaults = useMemo(() => allDefaultUnitPins(), []);
  const visible = useMemo(() => {
    const query = q.trim().toUpperCase().replace(/[\s-]/g, "");
    return pins.filter((p) => {
      if (p.removed) return false;
      if (p.floor !== floor) return false;
      if (side !== "all" && p.building !== side) return false;
      if (!query) return true;
      return pinLabel(p.building, p.unitNo).includes(query) || p.unitNo.includes(query);
    });
  }, [pins, floor, side, q]);
  const active = pins.find((p) => keyOf(p) === activeKey) ?? visible[0] ?? null;

  useEffect(() => {
    fetch("/api/admin/unit-pins")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then((data: UnitPinRecord[]) => {
        setPins(Array.isArray(data) ? data : allDefaultUnitPins());
      });
  }, []);

  useEffect(() => {
    const still = visible.find((p) => keyOf(p) === activeKey);
    if (!still) setActiveKey(visible[0] ? keyOf(visible[0]) : null);
  }, [floor, side, visible, activeKey]);

  function patch(key: string, partial: Partial<UnitPinRecord>) {
    setPins((list) => list.map((p) => (keyOf(p) === key ? { ...p, ...partial } : p)));
  }

  /** 목록에서 삭제 — 위치 값은 남겨두고 removed만 표시해, 같은 호실을 다시 추가하면 원래 위치로 복구된다 */
  function removePin(key: string) {
    const target = pins.find((p) => keyOf(p) === key);
    if (!target) return;
    if (!confirm(`${pinLabel(target.building, target.unitNo)} 마커를 목록에서 삭제할까요?`)) return;
    patch(key, { removed: true });
    if (activeKey === key) setActiveKey(null);
    setMsg("삭제되었습니다. 저장하세요.");
  }

  function addPin() {
    const unitNo = newUnitNo.trim();
    if (!unitNo) return;
    const key = pinKeyOf(floor, newBuilding, unitNo);
    const existing = pins.find((p) => keyOf(p) === key);
    if (existing && !existing.removed) {
      setMsg(`${pinLabel(newBuilding, unitNo)}은(는) 이미 목록에 있습니다.`);
      return;
    }
    if (existing?.removed) {
      patch(key, { removed: false });
    } else {
      const pos = estimateUnitPin(newBuilding, unitNo, [], floor);
      setPins((list) => [...list, { floor, building: newBuilding, unitNo, x: pos.x, y: pos.y }]);
    }
    setActiveKey(key);
    setNewUnitNo("");
    setMsg("추가되었습니다. 도면을 클릭해 위치를 맞추고 저장하세요.");
  }

  function coordsFromClient(clientX: number, clientY: number) {
    const el = mapRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = Math.round(((clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((clientY - rect.top) / rect.height) * 1000) / 10;
    return {
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    };
  }

  function placeAt(x: number, y: number) {
    if (!active) return;
    patch(keyOf(active), { x, y });
    setMsg("");
  }

  function resetFloor() {
    if (!confirm(`${floor} 호실 마커를 처음 좌표로 되돌릴까요?`)) return;
    const base = new Map(defaults.filter((p) => p.floor === floor).map((p) => [keyOf(p), p]));
    setPins((list) =>
      list.map((p) => (p.floor === floor ? (base.get(keyOf(p)) ?? p) : p)),
    );
    setMsg(`${floor} 좌표를 초기값으로 되돌렸습니다. 저장하세요.`);
  }

  async function saveAll() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/unit-pins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pins),
    });
    setSaving(false);
    setMsg(res.ok ? "저장되었습니다. 공개 도면의 빨간 번호에 바로 반영됩니다." : "저장 실패");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-brand">호실 마커</h1>
          <p className="mt-2 text-sm text-muted">
            빨간 호실 번호를 직접 잡고 옮깁니다. 호실을 고른 뒤 도면을 <strong>클릭</strong>하거나,
            마커를 <strong>드래그</strong>하세요. 맞춘 뒤 반드시 저장하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetFloor}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm"
          >
            이 층 초기화
          </button>
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="rounded-md bg-brand px-3 py-1.5 text-sm text-white disabled:opacity-60"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
      {msg ? <p className="mt-3 text-sm text-brand">{msg}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {FLOORS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFloor(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-bold ${
              floor === f ? "bg-brand text-white" : "border border-line bg-white"
            }`}
          >
            {f}
          </button>
        ))}
        {(["all", "A", "B"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              side === s ? "bg-brand-deep text-white" : "border border-line bg-white"
            }`}
          >
            {s === "all" ? "전체 동" : `${s}동`}
          </button>
        ))}
        <input
          className="ml-auto w-28 border border-line px-2 py-1.5 text-sm"
          placeholder="A142"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-line bg-white p-2 text-sm">
        <span className="text-xs text-muted">호실 추가</span>
        <select
          value={newBuilding}
          onChange={(e) => setNewBuilding(e.target.value as Building)}
          className="border border-line px-2 py-1 text-sm"
        >
          <option value="A">A동</option>
          <option value="B">B동</option>
        </select>
        <input
          className="w-24 border border-line px-2 py-1.5 text-sm"
          placeholder="예: 142"
          value={newUnitNo}
          onChange={(e) => setNewUnitNo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addPin();
          }}
        />
        <button
          type="button"
          onClick={addPin}
          className="rounded-md border border-brand px-3 py-1.5 text-sm text-brand hover:bg-brand hover:text-white"
        >
          추가
        </button>
        <span className="text-xs text-muted">
          추가 후 도면을 클릭해 위치를 맞추고 저장하세요. 목록의 ✕는 삭제(도면에서 숨김)입니다.
        </span>
      </div>

      <div className="mt-3 flex max-h-28 flex-wrap gap-1 overflow-y-auto rounded-xl border border-line bg-white p-2">
        {visible.map((p) => {
          const on = active && keyOf(p) === keyOf(active);
          const orig = defaults.find((x) => keyOf(x) === keyOf(p));
          const dirty = orig && (orig.x !== p.x || orig.y !== p.y);
          return (
            <span
              key={keyOf(p)}
              className={`inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-bold ${
                on ? "bg-brand text-white" : dirty ? "bg-[#fff4e5] text-brand-deep" : "bg-slate-100"
              }`}
            >
              <button type="button" onClick={() => setActiveKey(keyOf(p))}>
                {pinLabel(p.building, p.unitNo)}
              </button>
              <button
                type="button"
                onClick={() => removePin(keyOf(p))}
                className="rounded-full px-1 leading-none opacity-70 hover:bg-black/15 hover:opacity-100"
                aria-label={`${pinLabel(p.building, p.unitNo)} 삭제`}
              >
                ✕
              </button>
            </span>
          );
        })}
      </div>

      <p className="mt-3 text-sm font-semibold text-brand-deep">
        {active
          ? `지금 옮길 호실: ${pinLabel(active.building, active.unitNo)}  (${active.x.toFixed(1)}, ${active.y.toFixed(1)})`
          : "호실을 선택하세요"}
      </p>

      <div
        ref={mapRef}
        className="relative mt-3 cursor-crosshair select-none overflow-hidden rounded-2xl border border-line bg-white"
        onClick={(e) => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          const pos = coordsFromClient(e.clientX, e.clientY);
          if (pos) placeAt(pos.x, pos.y);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.imageSrc}
          alt={media.alt}
          width={media.width}
          height={media.height}
          className="pointer-events-none block h-auto w-full"
          draggable={false}
        />
        {visible.map((p) => {
          const on = active && keyOf(p) === keyOf(active);
          const k = keyOf(p);
          return (
            <button
              key={k}
              type="button"
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-none"
              style={{ left: `${p.x}%`, top: `${p.y}%`, cursor: on ? "grab" : "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                if (dragged.current) return;
                setActiveKey(k);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                dragKey.current = k;
                dragged.current = false;
                setActiveKey(k);
              }}
              onPointerMove={(e) => {
                if (dragKey.current !== k) return;
                const pos = coordsFromClient(e.clientX, e.clientY);
                if (!pos) return;
                dragged.current = true;
                patch(k, { x: pos.x, y: pos.y });
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                if (dragKey.current === k) dragKey.current = null;
                window.setTimeout(() => {
                  dragged.current = false;
                }, 0);
              }}
            >
              <span
                className={`box-border flex h-[22px] w-[42px] items-center justify-center rounded-[3px] border border-white text-[9px] font-black tabular-nums text-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${
                  on ? "bg-[#0b5f8a]" : "bg-[#d63c3c]"
                }`}
              >
                {pinLabel(p.building, p.unitNo)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
