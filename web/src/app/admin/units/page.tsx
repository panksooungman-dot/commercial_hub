"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { STATUS_LABEL } from "@/lib/format";
import { Unit, UnitStatus } from "@/lib/types";

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [floor, setFloor] = useState("");
  const [building, setBuilding] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [msg, setMsg] = useState("");
  const [savingAll, setSavingAll] = useState(false);
  /** 삭제 직전 상태를 기억해 두었다가 복구 시 그대로 되돌린다(새로고침 시엔 분양가능으로 복구) */
  const statusBeforeDelete = useRef<Record<string, UnitStatus>>({});

  useEffect(() => {
    fetch("/api/admin/units")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then(setUnits);
  }, []);

  const hiddenCount = useMemo(() => units.filter((u) => u.status === "hidden").length, [units]);

  const filtered = useMemo(
    () =>
      units.filter((u) => {
        if (floor && u.floor !== floor) return false;
        if (building && u.building !== building) return false;
        if (!showHidden && u.status === "hidden") return false;
        return true;
      }),
    [units, floor, building, showHidden],
  );

  async function saveUnit(unit: Unit) {
    setMsg("");
    const res = await fetch(`/api/admin/units/${unit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit),
    });
    if (res.ok) {
      setMsg(`${unit.id} 저장됨`);
      return;
    }
    const body = await res.json().catch(() => null);
    setMsg(`저장 실패${body?.error ? ` (${body.error})` : ""}`);
  }

  async function saveAll() {
    setMsg("");
    setSavingAll(true);
    try {
      const res = await fetch("/api/admin/units", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(units),
      });
      if (res.ok) {
        const body = await res.json();
        setMsg(`전체 저장됨 (${body.count}실)`);
        return;
      }
      const body = await res.json().catch(() => null);
      setMsg(`전체 저장 실패${body?.error ? ` (${body.error})` : ""}`);
    } finally {
      setSavingAll(false);
    }
  }

  function patch(id: string, partial: Partial<Unit>) {
    setUnits((list) => list.map((u) => (u.id === id ? { ...u, ...partial } : u)));
  }

  /** 삭제(비공개 처리)·복구는 상태를 바로 저장해 공개 사이트에 즉시 반영한다 */
  async function setStatusAndSave(unit: Unit, status: UnitStatus) {
    const next = { ...unit, status };
    patch(unit.id, { status });
    await saveUnit(next);
  }

  function deleteUnit(unit: Unit) {
    if (!window.confirm(`${unit.building}-${unit.floor}-${unit.unitNo} 호실을 삭제(비공개)할까요?\n공개 사이트에서 즉시 사라지며, 목록의 "비공개 호실 표시"에서 언제든 복구할 수 있습니다.`)) {
      return;
    }
    statusBeforeDelete.current[unit.id] = unit.status;
    setStatusAndSave(unit, "hidden");
  }

  function restoreUnit(unit: Unit) {
    setStatusAndSave(unit, statusBeforeDelete.current[unit.id] ?? "available");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">호실 관리</h1>
      <p className="mt-2 text-sm text-muted">
        분양가·상태·계약면적·정면길이·권장업종을 수정하세요. 공개 사이트에 바로 반영됩니다.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <select value={floor} onChange={(e) => setFloor(e.target.value)} className="border px-2 py-1 text-sm">
          <option value="">전체 층</option>
          <option value="2F">2F</option>
          <option value="1F">1F</option>
          <option value="B1">B1</option>
        </select>
        <select value={building} onChange={(e) => setBuilding(e.target.value)} className="border px-2 py-1 text-sm">
          <option value="">전체 동</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          비공개 호실 표시 ({hiddenCount})
        </label>
        <button
          type="button"
          onClick={saveAll}
          disabled={savingAll || units.length === 0}
          className="bg-brand px-3 py-1 text-sm text-white hover:bg-brand-deep disabled:opacity-50"
        >
          {savingAll ? "전체 저장 중…" : `전체 저장 (${units.length}실)`}
        </button>
        {msg ? <span className="text-sm text-brand">{msg}</span> : null}
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[1040px] text-left text-xs">
          <thead className="bg-background text-muted">
            <tr>
              <th className="px-2 py-2">호실</th>
              <th className="px-2 py-2">전용</th>
              <th className="px-2 py-2">정면(mm)</th>
              <th className="px-2 py-2">계약면적</th>
              <th className="px-2 py-2">분양가(원)</th>
              <th className="px-2 py-2">상태</th>
              <th className="px-2 py-2">권장업종</th>
              <th className="px-2 py-2">옵션</th>
              <th className="px-2 py-2"></th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className={`border-t border-line ${u.status === "hidden" ? "bg-background/70 opacity-60" : ""}`}
              >
                <td className="px-2 py-2 font-medium">
                  <Link href={`/units/${u.id}`} className="text-brand underline">
                    {u.building}-{u.floor}-{u.unitNo}
                  </Link>
                </td>
                <td className="px-2 py-2">{u.exclusiveArea}</td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-20 border px-1 py-1"
                    value={u.frontLengthMm ?? ""}
                    onChange={(e) =>
                      patch(u.id, {
                        frontLengthMm: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-20 border px-1 py-1"
                    value={u.contractArea ?? ""}
                    onChange={(e) =>
                      patch(u.id, {
                        contractArea: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-28 border px-1 py-1"
                    value={u.price ?? ""}
                    onChange={(e) =>
                      patch(u.id, {
                        price: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    className="border px-1 py-1"
                    value={u.status}
                    onChange={(e) => patch(u.id, { status: e.target.value as UnitStatus })}
                  >
                    {(Object.keys(STATUS_LABEL) as UnitStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-28 border px-1 py-1"
                    value={u.recommendedBusiness}
                    onChange={(e) => patch(u.id, { recommendedBusiness: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-24 border px-1 py-1"
                    value={u.options}
                    onChange={(e) => patch(u.id, { options: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    className="bg-brand px-2 py-1 text-white"
                    onClick={() => saveUnit(u)}
                  >
                    저장
                  </button>
                </td>
                <td className="px-2 py-2">
                  {u.status === "hidden" ? (
                    <button
                      type="button"
                      className="border border-brand px-2 py-1 text-brand hover:bg-brand hover:text-white"
                      onClick={() => restoreUnit(u)}
                    >
                      복구
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="border border-[#c0392b] px-2 py-1 text-[#c0392b] hover:bg-[#c0392b] hover:text-white"
                      onClick={() => deleteUnit(u)}
                    >
                      삭제
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
