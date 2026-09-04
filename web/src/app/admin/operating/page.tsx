"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PLAN_MEDIA_GALLERY } from "@/lib/plan-media-gallery";
import { operatingDisplayRoom, type OperatingPin, type OperatingUnitRef } from "@/lib/operating-pins";
import { belowUnitPin, buildPinOverlay, listFloorPins, pinLabel, type UnitPinRecord } from "@/lib/unit-pins";
import { Building, Floor } from "@/lib/types";

const FLOORS: Floor[] = ["B1", "1F", "2F"];

function findGhost(
  raw: string,
  floor: Floor,
  hint: Building | undefined,
  overlay?: Map<string, { x: number; y: number }>,
): { building: Building; unitNo: string; x: number; y: number } | null {
  const q = raw.trim().toUpperCase().replace(/[\s-]/g, "");
  if (!q) return null;
  const ghosts = listFloorPins(floor, overlay);
  const exact = ghosts.find((g) => pinLabel(g.building, g.unitNo) === q);
  if (exact) return exact;
  const m = q.match(/^([AB])?(\d+)$/);
  if (!m) return null;
  const no = m[2];
  const building = (m[1] as Building | undefined) ?? hint;
  const sameNo = (g: (typeof ghosts)[number]) => pinLabel(g.building, g.unitNo).slice(1) === no;
  if (building) {
    return ghosts.find((g) => g.building === building && sameNo(g)) ?? null;
  }
  return ghosts.find(sameNo) ?? null;
}

export default function AdminOperatingPinsPage() {
  const [pins, setPins] = useState<OperatingPin[]>([]);
  const [units, setUnits] = useState<OperatingUnitRef[]>([]);
  const [unitPinRecords, setUnitPinRecords] = useState<UnitPinRecord[]>([]);
  const [floor, setFloor] = useState<Floor>("1F");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [roomDrafts, setRoomDrafts] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const roomInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const mapRoomRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const mapRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);
  const dragged = useRef(false);

  const media = PLAN_MEDIA_GALLERY.find((m) => m.floor === floor)!;
  const pinOverlay = useMemo(() => buildPinOverlay(unitPinRecords), [unitPinRecords]);
  const unitGhosts = useMemo(() => listFloorPins(floor, pinOverlay), [floor, pinOverlay]);
  const visible = useMemo(
    () => pins.filter((p) => p.floor === floor),
    [pins, floor],
  );
  const active = pins.find((p) => p.id === activeId) ?? visible[0] ?? null;
  const floorUnits = useMemo(
    () => units.filter((u) => u.floor === floor),
    [units, floor],
  );

  useEffect(() => {
    fetch("/api/admin/operating-pins")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then((data: OperatingPin[]) => {
        setPins(Array.isArray(data) ? data : []);
      });
    fetch("/api/admin/units")
      .then((r) => r.json())
      .then((data: OperatingUnitRef[]) => {
        if (!Array.isArray(data)) return;
        setUnits(
          data.map((u) => ({
            id: u.id,
            building: u.building,
            floor: u.floor,
            unitNo: u.unitNo,
          })),
        );
      });
    fetch("/api/admin/unit-pins")
      .then((r) => r.json())
      .then((data: UnitPinRecord[]) => {
        if (Array.isArray(data)) setUnitPinRecords(data);
      });
  }, []);

  useEffect(() => {
    const still = visible.find((p) => p.id === activeId);
    if (!still) setActiveId(visible[0]?.id ?? null);
  }, [floor, visible, activeId]);

  function patch(id: string, partial: Partial<OperatingPin>) {
    setPins((list) => list.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  }

  function roomLabelForPin(p: OperatingPin) {
    return operatingDisplayRoom(p, units) ?? "";
  }

  function shownRoom(p: OperatingPin) {
    return roomDrafts[p.id] !== undefined ? roomDrafts[p.id] : roomLabelForPin(p);
  }

  function assignUnit(
    pinId: string,
    ghost: { building: Building; unitNo: string },
    move = false,
  ) {
    const unit = units.find(
      (u) =>
        u.floor === floor &&
        u.building === ghost.building &&
        pinLabel(u.building, u.unitNo) === pinLabel(ghost.building, ghost.unitNo),
    );
    const below = belowUnitPin(ghost.building, ghost.unitNo, floor, pinOverlay);
    const room = pinLabel(ghost.building, ghost.unitNo);
    patch(pinId, {
      building: ghost.building,
      unitId: unit?.id,
      roomLabel: room,
      ...(move ? { x: below.x, y: below.y } : {}),
    });
    setRoomDrafts((d) => ({ ...d, [pinId]: room }));
    setActiveId(pinId);
    const pin = pins.find((p) => p.id === pinId);
    setMsg(
      move
        ? `${room} 밑에 「${pin?.label ?? "점포"}」를 붙였습니다. 저장하세요.`
        : `「${pin?.label ?? "점포"}」 호실을 ${room}로 바꿨습니다. 저장하세요.`,
    );
  }

  function attachToGhost(
    pinId: string,
    ghost: { building: Building; unitNo: string },
  ) {
    assignUnit(pinId, ghost, true);
  }

  function commitRoomInput(pinId: string) {
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return;
    const raw = shownRoom(pin);
    if (!raw.trim()) {
      patch(pinId, { unitId: undefined, roomLabel: undefined });
      setRoomDrafts((d) => ({ ...d, [pinId]: "" }));
      setMsg("호실 표시를 지웠습니다. 저장하세요.");
      return;
    }
    const text = raw.trim();
    const ghost = findGhost(text, floor, pin.building, pinOverlay);
    if (!ghost) {
      patch(pinId, { unitId: undefined, roomLabel: text });
      setRoomDrafts((d) => ({ ...d, [pinId]: text }));
      setMsg(`「${text}」를 노란 표시에 수동 입력했습니다. 저장하세요.`);
      return;
    }
    assignUnit(pinId, ghost, false);
  }

  function setRoomDraft(pinId: string, value: string) {
    setActiveId(pinId);
    setRoomDrafts((d) => ({ ...d, [pinId]: value }));
    patch(pinId, { roomLabel: value });
  }

  function snapBelow(pinId: string) {
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return;
    const raw = shownRoom(pin);
    const ghost =
      findGhost(raw, floor, pin.building, pinOverlay) ??
      (pin.unitId
        ? (() => {
            const u = units.find((x) => x.id === pin.unitId);
            return u ? { building: u.building, unitNo: u.unitNo } : null;
          })()
        : null);
    if (!ghost) {
      setMsg("먼저 호실을 지정한 뒤 밑에 붙이기를 누르세요.");
      return;
    }
    assignUnit(pinId, ghost, true);
  }

  function focusRoomInput(pinId: string) {
    setActiveId(pinId);
    window.requestAnimationFrame(() => {
      const el = mapRoomRefs.current[pinId] ?? roomInputRefs.current[pinId];
      el?.focus();
      el?.select();
    });
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

  function placeAt(x: number, y: number, id?: string) {
    const targetId = id ?? active?.id ?? visible[0]?.id;
    if (!targetId) return;
    const target = pins.find((p) => p.id === targetId);
    if (!target) return;
    const building: Building = x < 50 ? "A" : "B";
    patch(targetId, { x, y, building });
    setActiveId(targetId);
    setMsg("");
  }

  function addPin() {
    const id = `op-${Date.now()}`;
    const next: OperatingPin = {
      id,
      floor,
      building: "A",
      label: "새 점포",
      x: 20,
      y: 50,
    };
    setPins((list) => [...list, next]);
    setActiveId(id);
    setMsg("점포 이름을 넣고, PPT와 다르면 노란 칸에 호실·점포명을 직접 입력하세요.");
  }

  function removePin(id: string) {
    const pin = pins.find((p) => p.id === id);
    if (!pin) return;
    if (!confirm(`삭제할까요?\n\n${pin.label}`)) return;
    setPins((list) => list.filter((p) => p.id !== id));
    setMsg("");
  }

  async function saveAll() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/operating-pins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pins),
    });
    setSaving(false);
    setMsg(res.ok ? "저장되었습니다. 공개 도면에 바로 반영됩니다." : "저장 실패");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-brand">영업 점포 마커</h1>
          <p className="mt-2 text-sm text-muted">
            PPT 노란 표시와 다르면 도면의 노란 칸에 <strong>호실·점포명</strong>을 직접 입력하세요.
            분양 호실 목록에 없는 번호도 그대로 표시됩니다. 빨간 번호를 누르거나 「밑에 붙이기」를 누르면
            그 호실 마커 아래로 이동합니다. 빨간 번호 위치는{" "}
            <a href="/admin/unit-pins" className="text-brand underline">
              호실 마커
            </a>
            에서 옮길 수 있습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addPin}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm"
          >
            점포 추가
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
      </div>

      <datalist id={`operating-unit-nos-${floor}`}>
        {unitGhosts.map((g) => (
          <option key={`${g.building}-${g.unitNo}`} value={pinLabel(g.building, g.unitNo)} />
        ))}
      </datalist>

      <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-line bg-white p-2">
        {visible.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted">이 층에 등록된 점포가 없습니다.</p>
        ) : (
          visible.map((p) => (
            <div
              key={p.id}
              className={`flex flex-wrap items-center gap-2 rounded-md px-2 py-1.5 ${
                p.id === active?.id ? "bg-[#fff8d6]" : "hover:bg-slate-50"
              }`}
            >
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-muted">
                {p.building}동
              </span>
              <button
                type="button"
                className="text-left text-sm font-bold text-brand-deep"
                onClick={() => setActiveId(p.id)}
              >
                {p.label || "(이름 없음)"}
              </button>
              <input
                className="w-36 border border-line px-1.5 py-0.5 text-sm"
                value={p.label}
                onChange={(e) => patch(p.id, { label: e.target.value })}
                onFocus={() => setActiveId(p.id)}
                placeholder="점포 이름"
              />
              <label className="flex items-center gap-1 text-xs text-muted">
                호실
                <input
                  ref={(el) => {
                    roomInputRefs.current[p.id] = el;
                  }}
                  className="w-[5.25rem] border border-line px-1.5 py-0.5 font-mono text-sm text-brand-deep"
                  list={`operating-unit-nos-${floor}`}
                  placeholder="직접입력"
                  value={shownRoom(p)}
                  onChange={(e) => setRoomDraft(p.id, e.target.value)}
                  onBlur={() => commitRoomInput(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitRoomInput(p.id);
                    }
                  }}
                  onFocus={() => setActiveId(p.id)}
                />
              </label>
              <select
                className="max-w-[8.5rem] border border-line bg-white px-1 py-0.5 text-xs"
                value={p.unitId ?? ""}
                onChange={(e) => {
                  const id = e.target.value;
                  setActiveId(p.id);
                  if (!id) {
                    patch(p.id, { unitId: undefined, roomLabel: undefined });
                    setRoomDrafts((d) => ({ ...d, [p.id]: "" }));
                    setMsg("호실 표시를 지웠습니다. 저장하세요.");
                    return;
                  }
                  const u = floorUnits.find((x) => x.id === id);
                  if (!u) return;
                  assignUnit(p.id, { building: u.building, unitNo: u.unitNo }, false);
                }}
                onFocus={() => setActiveId(p.id)}
              >
                <option value="">호실 선택</option>
                {floorUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {pinLabel(u.building, u.unitNo)}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 font-mono text-[11px] text-muted">
                x
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  className="w-14 border border-line px-1 py-0.5"
                  value={p.x}
                  onChange={(e) => patch(p.id, { x: Number(e.target.value) })}
                  onFocus={() => setActiveId(p.id)}
                />
                y
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  className="w-14 border border-line px-1 py-0.5"
                  value={p.y}
                  onChange={(e) => patch(p.id, { y: Number(e.target.value) })}
                  onFocus={() => setActiveId(p.id)}
                />
              </label>
              <button
                type="button"
                className="rounded border border-line bg-white px-1.5 py-0.5 text-[11px] text-muted hover:border-brand hover:text-brand"
                onClick={() => snapBelow(p.id)}
              >
                밑에 붙이기
              </button>
              <button
                type="button"
                className="ml-auto text-xs text-muted hover:text-red-600"
                onClick={() => removePin(p.id)}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      <p className="mt-3 text-sm font-semibold text-brand-deep">
        {active
          ? `지금 점포: ${active.label}${shownRoom(active) ? ` · ${shownRoom(active)}` : " · 호실 미지정"} · 노란 칸에서 직접 입력 가능`
          : "점포를 추가하세요"}
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
        {unitGhosts.map((u) => (
          <button
            key={`${u.building}-${u.unitNo}`}
            type="button"
            className="absolute z-[1] flex h-[22px] w-[42px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] border border-white/80 bg-[#d63c3c]/80 text-[9px] font-black tabular-nums text-white hover:z-20 hover:bg-[#d63c3c]"
            style={{ left: `${u.x}%`, top: `${u.y}%` }}
            title={`${pinLabel(u.building, u.unitNo)} 밑에 노란 점포 붙이기`}
            onClick={(e) => {
              e.stopPropagation();
              const targetId = active?.id ?? visible[0]?.id;
              if (!targetId) {
                setMsg("먼저 점포를 추가하거나 목록에서 선택하세요.");
                return;
              }
              attachToGhost(targetId, u);
            }}
          >
            {pinLabel(u.building, u.unitNo)}
          </button>
        ))}
        {visible.map((p) => {
          const on = active?.id === p.id;
          const room = shownRoom(p);
          return (
            <div
              key={p.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 touch-none ${on ? "z-30" : "z-10"}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`box-border inline-flex min-h-[22px] items-center justify-center gap-0.5 whitespace-nowrap rounded-[3px] border px-1 text-[8px] font-black leading-none ${
                  on
                    ? "border-[#3a2a00] bg-[#ffe566] text-[#3a2a00]"
                    : "border-white bg-[#ffc000] text-[#3a2a00]"
                }`}
                style={{ cursor: on ? "grab" : "pointer" }}
                onClick={() => {
                  if (dragged.current) return;
                  focusRoomInput(p.id);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  dragId.current = p.id;
                  dragged.current = false;
                  setActiveId(p.id);
                }}
                onPointerMove={(e) => {
                  if (dragId.current !== p.id) return;
                  const pos = coordsFromClient(e.clientX, e.clientY);
                  if (!pos) return;
                  dragged.current = true;
                  patch(p.id, { x: pos.x, y: pos.y });
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  if (dragId.current === p.id) dragId.current = null;
                  window.setTimeout(() => {
                    dragged.current = false;
                  }, 0);
                }}
              >
                {on ? (
                  <>
                    <input
                      ref={(el) => {
                        mapRoomRefs.current[p.id] = el;
                      }}
                      className="min-w-[2.4rem] bg-transparent text-center font-mono text-[8px] font-black text-[#7a5200] outline-none"
                      style={{ width: `${Math.max(4, room.length + 1)}ch` }}
                      placeholder="호실"
                      list={`operating-unit-nos-${floor}`}
                      value={room}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setRoomDraft(p.id, e.target.value)}
                      onBlur={() => commitRoomInput(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitRoomInput(p.id);
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                    <input
                      className="min-w-[4rem] bg-transparent text-[8px] font-black outline-none"
                      style={{ width: `${Math.max(5, p.label.length + 1)}ch` }}
                      value={p.label}
                      placeholder="점포명"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => patch(p.id, { label: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    {room ? <span className="text-[#7a5200]">{room}</span> : null}
                    <span>{p.label}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
