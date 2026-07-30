"use client";

import { useEffect, useMemo, useState } from "react";
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

const STATUS_FILTERS: { key: Inquiry["status"] | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "new", label: "신규" },
  { key: "confirmed", label: "확인완료" },
  { key: "in_progress", label: "상담중" },
  { key: "done", label: "상담완료" },
];

function defaultSmsMessage(i: Inquiry) {
  return `[송도 하늘채 아이비원] ${i.name}님, 문의주신 상담 건으로 연락드립니다. 편하신 시간에 다시 연락드리겠습니다. 감사합니다.`;
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<Inquiry["status"] | "all">("all");
  const [q, setQ] = useState("");
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [noteMsg, setNoteMsg] = useState<{ id: string; text: string } | null>(null);
  const [smsDrafts, setSmsDrafts] = useState<Record<string, string>>({});
  const [smsMsg, setSmsMsg] = useState<{ id: string; text: string } | null>(null);

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

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (query && !`${i.name} ${i.phone}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [items, statusFilter, q]);

  const counts = useMemo(() => {
    const c: Record<Inquiry["status"], number> = { new: 0, confirmed: 0, in_progress: 0, done: 0 };
    for (const i of items) c[i.status] += 1;
    return c;
  }, [items]);

  async function patchInquiry(id: string, patch: Partial<Pick<Inquiry, "status" | "note">>) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
  }

  async function setStatus(id: string, status: Inquiry["status"]) {
    await patchInquiry(id, { status });
    load();
  }

  function updateNoteDraft(id: string, note: string) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, note } : i)));
  }

  async function saveNote(id: string, note: string) {
    setSavingNoteId(id);
    setNoteMsg(null);
    await patchInquiry(id, { note });
    setSavingNoteId(null);
    setNoteMsg({ id, text: "메모 저장됨" });
  }

  function updateSmsDraft(id: string, text: string) {
    setSmsDrafts((prev) => ({ ...prev, [id]: text }));
  }

  async function copySms(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setSmsMsg({ id, text: "문자 내용 복사됨" });
    } catch {
      setSmsMsg({ id, text: "복사 실패 — 직접 선택해 복사해 주세요" });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">상담 신청</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름 또는 연락처 검색"
          className="min-w-[12rem] flex-1 border border-line bg-surface px-3 py-2 text-sm sm:max-w-xs"
        />
        {STATUS_FILTERS.map((f) => {
          const count = f.key === "all" ? items.length : counts[f.key];
          const active = statusFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                active
                  ? "bg-brand-deep text-white"
                  : "border border-line bg-white text-muted hover:border-brand"
              }`}
            >
              {f.label} <span className="ml-1 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">
            {items.length === 0 ? "접수된 상담이 없습니다." : "조건에 맞는 상담이 없습니다."}
          </p>
        ) : (
          filtered.map((i) => (
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
              <div className="mt-3">
                <label className="text-xs font-medium text-muted">담당자 메모</label>
                <textarea
                  value={i.note ?? ""}
                  onChange={(e) => updateNoteDraft(i.id, e.target.value)}
                  rows={2}
                  placeholder="통화 내용, 후속 조치 등을 기록하세요"
                  className="mt-1 w-full border border-line bg-white px-2 py-1.5 text-sm"
                />
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={savingNoteId === i.id}
                    onClick={() => saveNote(i.id, i.note ?? "")}
                    className="rounded-sm bg-brand px-3 py-1 text-xs text-white hover:bg-brand-deep disabled:opacity-50"
                  >
                    {savingNoteId === i.id ? "저장 중…" : "메모 저장"}
                  </button>
                  {noteMsg?.id === i.id ? (
                    <span className="text-xs text-brand">{noteMsg.text}</span>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 border-t border-line pt-3">
                <label className="text-xs font-medium text-muted">문자(SMS) 보내기</label>
                <textarea
                  value={smsDrafts[i.id] ?? defaultSmsMessage(i)}
                  onChange={(e) => updateSmsDraft(i.id, e.target.value)}
                  rows={2}
                  className="mt-1 w-full border border-line bg-white px-2 py-1.5 text-sm"
                />
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copySms(i.id, smsDrafts[i.id] ?? defaultSmsMessage(i))}
                    className="rounded-sm border border-line bg-white px-3 py-1 text-xs text-brand hover:border-brand"
                  >
                    문자 내용 복사
                  </button>
                  <a
                    href={`sms:${i.phone}?body=${encodeURIComponent(smsDrafts[i.id] ?? defaultSmsMessage(i))}`}
                    className="rounded-sm bg-brand px-3 py-1 text-xs text-white hover:bg-brand-deep"
                  >
                    문자 앱 열기
                  </a>
                  {smsMsg?.id === i.id ? (
                    <span className="text-xs text-brand">{smsMsg.text}</span>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
