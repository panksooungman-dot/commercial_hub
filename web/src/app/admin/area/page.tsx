"use client";

import { useEffect, useState } from "react";
import { AreaContent } from "@/lib/types";

export default function AdminAreaPage() {
  const [area, setArea] = useState<AreaContent | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/area")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then(setArea);
  }, []);

  if (!area) return <div className="p-8 text-sm text-muted">불러오는 중…</div>;

  async function save() {
    const res = await fetch("/api/admin/area", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(area),
    });
    setMsg(res.ok ? "저장되었습니다." : "저장 실패");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">입지 콘텐츠</h1>
      <div className="mt-6 space-y-4 border border-line bg-surface p-5">
        <label className="block text-sm">
          포지셔닝 헤드라인
          <textarea
            className="mt-1 w-full border px-3 py-2"
            rows={3}
            value={area.positioningHeadline}
            onChange={(e) => setArea({ ...area, positioningHeadline: e.target.value })}
          />
        </label>
        {area.points.map((p, idx) => (
          <div key={idx} className="grid gap-2 border border-line p-3">
            <input
              className="border px-2 py-1 text-sm"
              value={p.title}
              onChange={(e) => {
                const points = [...area.points];
                points[idx] = { ...p, title: e.target.value };
                setArea({ ...area, points });
              }}
            />
            <textarea
              className="border px-2 py-1 text-sm"
              rows={2}
              value={p.body}
              onChange={(e) => {
                const points = [...area.points];
                points[idx] = { ...p, body: e.target.value };
                setArea({ ...area, points });
              }}
            />
          </div>
        ))}
        <button type="button" onClick={save} className="bg-brand px-4 py-2 text-sm text-white">
          저장
        </button>
        {msg ? <p className="text-sm text-brand">{msg}</p> : null}
      </div>
    </div>
  );
}
