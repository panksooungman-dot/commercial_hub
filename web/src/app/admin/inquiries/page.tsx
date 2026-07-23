"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@/lib/types";

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

  async function markDone(id: string) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "done" }),
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
                <span className="text-xs text-muted">
                  {i.status === "new" ? "신규" : "처리완료"} ·{" "}
                  {new Date(i.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              {i.message ? <p className="mt-2 whitespace-pre-wrap">{i.message}</p> : null}
              {i.status === "new" ? (
                <button
                  type="button"
                  className="mt-3 text-xs text-brand underline"
                  onClick={() => markDone(i.id)}
                >
                  처리완료로 표시
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
