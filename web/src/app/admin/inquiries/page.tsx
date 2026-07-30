"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@/lib/types";

const INQUIRY_STATUS_LABEL: Record<Inquiry["status"], string> = {
  new: "신규",
  confirmed: "확인완료",
  in_progress: "상담중",
  done: "상담완료",
};

const INQUIRY_STATUS_STYLE: Record<Inquiry["status"], string> = {
  new: "bg-[#fff8e8] text-[#a8781a]",
  confirmed: "bg-[#eef3fb] text-[#2d6eaa]",
  in_progress: "bg-[#eef7ee] text-[#2f8a4a]",
  done: "bg-background text-muted",
};

const STATUS_ACTIONS: { key: Inquiry["status"]; label: string }[] = [
  { key: "confirmed", label: "확인완료" },
  { key: "in_progress", label: "상담중" },
  { key: "done", label: "상담완료" },
];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);

  async function load() {
    const res = await fetch("/api/admin/inquiries");
    if (res.status === 401) {
      location.href = "/admin/login";
      return;
    }
    setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: Inquiry["status"]) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">상담 신청</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted">접수된 상담이 없습니다.</p>
        ) : (
          items.map((i) => (
            <article key={i.id} className="border border-line bg-surface p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-brand">
                    {i.name} · {i.phone}
                  </p>
                  <p className="text-muted">
                    {[i.interestBuilding && `${i.interestBuilding}동`, i.interestFloor, i.interestUnitNo]
                      .filter(Boolean)
                      .join(" / ") || "관심 호실 미지정"}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${INQUIRY_STATUS_STYLE[i.status]}`}
                  >
                    {INQUIRY_STATUS_LABEL[i.status]}
                  </span>
                  {new Date(i.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              {i.message ? <p className="mt-2 whitespace-pre-wrap">{i.message}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUS_ACTIONS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    disabled={i.status === a.key}
                    onClick={() => setStatus(i.id, a.key)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      i.status === a.key
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-white text-muted hover:border-brand hover:text-brand"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
