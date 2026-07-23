"use client";

import { useEffect, useState } from "react";
import { FAQ_CATEGORY_LABEL } from "@/lib/format";
import { Faq, FaqCategory } from "@/lib/types";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [msg, setMsg] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then((data: Faq[]) => setFaqs(data.sort((a, b) => a.sortOrder - b.sortOrder)));
  }, []);

  function patch(idx: number, partial: Partial<Faq>) {
    setFaqs((list) => {
      const next = [...list];
      next[idx] = { ...next[idx], ...partial };
      return next;
    });
  }

  async function saveOne(faq: Faq) {
    setSavingId(faq.id);
    setMsg("");
    const res = await fetch(`/api/admin/faqs/${faq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq),
    });
    setSavingId(null);
    setMsg(res.ok ? `「${faq.question.slice(0, 24)}…」 저장됨` : "저장 실패");
  }

  async function saveAll() {
    setMsg("");
    const payload = faqs.map((f, i) => ({ ...f, sortOrder: i + 1 }));
    const res = await fetch("/api/admin/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setFaqs(payload);
      setMsg("전체 저장되었습니다. 공개 /faq 에 반영됩니다.");
    } else {
      setMsg("저장 실패");
    }
  }

  async function addFaq() {
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "unit",
        question: "새 질문",
        answer: "",
        sortOrder: faqs.length + 1,
        published: true,
      }),
    });
    if (res.ok) {
      const faq = await res.json();
      setFaqs((f) => [...f, faq]);
      setMsg("FAQ가 추가되었습니다. 질문·답변을 작성한 뒤 저장하세요.");
    }
  }

  async function remove(id: string, question: string) {
    if (!confirm(`삭제할까요?\n\n${question}`)) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg("삭제 실패");
      return;
    }
    setFaqs((f) => f.filter((x) => x.id !== id));
    setMsg("삭제되었습니다.");
  }

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= faqs.length) return;
    setFaqs((list) => {
      const next = [...list];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next.map((f, i) => ({ ...f, sortOrder: i + 1 }));
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-brand">FAQ 관리</h1>
          <p className="mt-1 text-sm text-muted">
            질문·답변 수정, 개별/전체 저장, 삭제, 순서 변경이 가능합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addFaq} className="border border-line bg-surface px-3 py-2 text-sm">
            FAQ 추가
          </button>
          <button type="button" onClick={saveAll} className="bg-brand px-3 py-2 text-sm text-white">
            전체 저장
          </button>
        </div>
      </div>
      {msg ? <p className="mt-3 text-sm text-brand">{msg}</p> : null}

      <div className="mt-6 space-y-4">
        {faqs.map((f, idx) => (
          <div key={f.id} className="border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted">#{idx + 1} · {f.id}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button type="button" className="border border-line px-2 py-1" onClick={() => move(idx, -1)}>
                  위로
                </button>
                <button type="button" className="border border-line px-2 py-1" onClick={() => move(idx, 1)}>
                  아래로
                </button>
                <button
                  type="button"
                  className="bg-brand px-2 py-1 text-white disabled:opacity-50"
                  disabled={savingId === f.id}
                  onClick={() => saveOne(f)}
                >
                  {savingId === f.id ? "저장 중…" : "이 항목 저장"}
                </button>
                <button
                  type="button"
                  className="border border-red-200 px-2 py-1 text-red-700"
                  onClick={() => remove(f.id, f.question)}
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <label className="block text-sm">
                카테고리
                <select
                  className="mt-1 w-full border border-line px-2 py-1.5 text-sm"
                  value={f.category}
                  onChange={(e) => patch(idx, { category: e.target.value as FaqCategory })}
                >
                  {(Object.keys(FAQ_CATEGORY_LABEL) as FaqCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {FAQ_CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-end gap-2 pb-1 text-sm">
                <input
                  type="checkbox"
                  checked={f.published}
                  onChange={(e) => patch(idx, { published: e.target.checked })}
                />
                사이트에 공개
              </label>
            </div>

            <label className="mt-3 block text-sm">
              질문
              <input
                className="mt-1 w-full border border-line px-2 py-1.5 text-sm"
                value={f.question}
                onChange={(e) => patch(idx, { question: e.target.value })}
              />
            </label>
            <label className="mt-3 block text-sm">
              답변
              <textarea
                className="mt-1 w-full border border-line px-2 py-1.5 text-sm"
                rows={8}
                placeholder="답변 입력"
                value={f.answer}
                onChange={(e) => patch(idx, { answer: e.target.value })}
              />
            </label>
          </div>
        ))}
      </div>

      {faqs.length === 0 ? (
        <p className="mt-8 text-sm text-muted">등록된 FAQ가 없습니다. 「FAQ 추가」로 새로 만드세요.</p>
      ) : null}
    </div>
  );
}
