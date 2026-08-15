"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PLAN_MEDIA_GALLERY } from "@/lib/plan-media-gallery";
import { listFloorPins, pinLabel } from "@/lib/unit-pins";
import { Building, Floor } from "@/lib/types";

type PinItem = { building: Building; unitNo: string; x: number; y: number };

const FLOORS: Floor[] = ["B1", "1F", "2F"];
const STORE_KEY = "md-pin-calibrate";

function keyOf(p: PinItem) {
  return `${p.building}${p.unitNo}`;
}

function loadStore(): Partial<Record<Floor, PinItem[]>> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function PinCalibratePage() {
  const [floor, setFloor] = useState<Floor>("2F");
  const [side, setSide] = useState<"all" | Building>("all");
  const [pins, setPins] = useState<PinItem[]>(() => listFloorPins("2F"));
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const skipSave = useRef(true);
  const media = PLAN_MEDIA_GALLERY.find((m) => m.floor === floor)!;
  const originals = useMemo(() => listFloorPins(floor), [floor]);
  const visible = pins.filter((p) => side === "all" || p.building === side);
  const current = pins[active] ?? visible[0];

  useEffect(() => {
    const stored = loadStore()[floor];
    const base = listFloorPins(floor);
    skipSave.current = true;
    if (!stored?.length) {
      setPins(base);
      setActive(0);
      return;
    }
    const byKey = new Map(stored.map((p) => [keyOf(p), p]));
    setPins(base.map((p) => byKey.get(keyOf(p)) ?? p));
    setActive(0);
  }, [floor]);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const all = loadStore();
    all[floor] = pins;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  }, [floor, pins]);

  const snippet = useMemo(() => {
    const changed = pins.filter((p) => {
      const o = originals.find((x) => keyOf(x) === keyOf(p));
      return !o || o.x !== p.x || o.y !== p.y;
    });
    if (!changed.length) return `${floor} 수정할 좌표 없음`;
    return [
      `${floor} (${changed.length}개 수정)`,
      ...changed.map((p) => `${keyOf(p)}: { x: ${p.x.toFixed(1)}, y: ${p.y.toFixed(1)} }`),
    ].join("\n");
  }, [floor, originals, pins]);

  function place(clientX: number, clientY: number, el: HTMLElement) {
    if (!current) return;
    const rect = el.getBoundingClientRect();
    const x = Math.round(((clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((clientY - rect.top) / rect.height) * 1000) / 10;
    setPins((prev) =>
      prev.map((p) => (keyOf(p) === keyOf(current) ? { ...p, x, y } : p)),
    );
    setCopied(false);
  }

  function select(item: PinItem) {
    const idx = pins.findIndex((p) => keyOf(p) === keyOf(item));
    if (idx >= 0) setActive(idx);
  }

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl text-brand-deep">마커 수동 보정</h1>
      <p className="mt-2 text-sm text-muted">
        호실 버튼을 고른 뒤 도면의 <strong>칸 한가운데</strong>를 클릭하세요. 마커를 눌러도 선택할 수
        있습니다. 끝난 뒤 <strong>좌표 복사</strong>를 채팅에 붙여 주시면 반영합니다.
      </p>

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
        <button
          type="button"
          onClick={copy}
          className="ml-auto rounded-md border border-line bg-white px-3 py-1.5 text-sm font-bold"
        >
          {copied ? "복사됨" : "좌표 복사"}
        </button>
        <a href={`/plan?floor=${floor}`} className="text-sm text-brand underline">
          도면으로
        </a>
      </div>

      <div className="mt-3 flex max-h-28 flex-wrap gap-1 overflow-y-auto rounded-xl border border-line bg-white p-2">
        {visible.map((p) => {
          const on = current && keyOf(p) === keyOf(current);
          const orig = originals.find((x) => keyOf(x) === keyOf(p));
          const dirty = orig && (orig.x !== p.x || orig.y !== p.y);
          return (
            <button
              key={keyOf(p)}
              type="button"
              onClick={() => select(p)}
              className={`rounded px-2 py-1 text-[11px] font-bold ${
                on ? "bg-brand text-white" : dirty ? "bg-[#fff4e5] text-brand-deep" : "bg-slate-100"
              }`}
            >
              {pinLabel(p.building, p.unitNo)}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm font-semibold text-brand-deep">
        지금 찍을 호실: {current ? pinLabel(current.building, current.unitNo) : "-"}
        {current ? `  (${current.x.toFixed(1)}, ${current.y.toFixed(1)})` : ""}
      </p>

      <div
        className="relative mt-3 cursor-crosshair overflow-hidden rounded-2xl border border-line bg-white"
        onClick={(e) => place(e.clientX, e.clientY, e.currentTarget)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.imageSrc}
          alt={media.alt}
          width={media.width}
          height={media.height}
          className="block h-auto w-full"
          draggable={false}
        />
        {visible.map((p) => {
          const on = current && keyOf(p) === keyOf(current);
          return (
            <button
              key={keyOf(p)}
              type="button"
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                select(p);
              }}
            >
              <span
                className={`box-border flex h-[22px] w-[42px] items-center justify-center rounded-[3px] border border-white text-[9px] font-black text-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${
                  on ? "bg-[#0b5f8a]" : "bg-[#d63c3c]"
                }`}
              >
                {pinLabel(p.building, p.unitNo)}
              </span>
            </button>
          );
        })}
      </div>

      <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-[#111] p-4 text-xs text-white">{snippet}</pre>
    </div>
  );
}
