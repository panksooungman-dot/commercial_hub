"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { STATUS_LABEL } from "@/lib/format";
import { Unit, UnitStatus } from "@/lib/types";

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [floor, setFloor] = useState("");
  const [building, setBuilding] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/units")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then(setUnits);
  }, []);

  const filtered = useMemo(
    () =>
      units.filter((u) => {
        if (floor && u.floor !== floor) return false;
        if (building && u.building !== building) return false;
        return true;
      }),
    [units, floor, building],
  );

  async function saveUnit(unit: Unit) {
    setMsg("");
    const res = await fetch(`/api/admin/units/${unit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit),
    });
    setMsg(res.ok ? `${unit.id} 저장됨` : "저장 실패");
  }

  function patch(id: string, partial: Partial<Unit>) {
    setUnits((list) => list.map((u) => (u.id === id ? { ...u, ...partial } : u)));
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
        {msg ? <span className="text-sm text-brand">{msg}</span> : null}
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[980px] text-left text-xs">
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
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-line">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
