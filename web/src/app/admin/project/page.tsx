"use client";

import { useEffect, useState } from "react";
import { Project, ScheduleItem } from "@/lib/types";

export default function AdminProjectPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/project")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then(setProject);
  }, []);

  if (!project) return <div className="p-8 text-sm text-muted">불러오는 중…</div>;

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => (p ? { ...p, [key]: value } : p));
  }

  function addSchedule() {
    const item: ScheduleItem = {
      id: `sch-${Date.now()}`,
      title: "새 일정",
      dateLabel: "",
      description: "",
      sortOrder: project!.salesSchedule.length + 1,
    };
    update("salesSchedule", [...project!.salesSchedule, item]);
  }

  async function save() {
    setMsg("");
    const res = await fetch("/api/admin/project", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    setMsg(res.ok ? "저장되었습니다. 홈 메인 배너에 바로 반영됩니다." : "저장 실패");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">프로젝트 · 배너 · 연락처</h1>
      <p className="mt-2 text-sm text-muted">
        메인 배너 문구·분양안내·홍보관 정보를 수정할 수 있습니다. 코드 수정 없이 저장만 하면 됩니다.
      </p>

      <section className="mt-6 space-y-4 border border-line bg-surface p-5">
        <h2 className="font-display text-xl text-brand">메인 배너 문구</h2>
        <p className="text-xs text-muted">
          헤드라인에서 줄바꿈이 필요하면 Enter로 입력하세요. (홈에 그대로 표시됩니다)
        </p>
        <Field
          label="상단 라벨 (eyebrow)"
          value={project.heroEyebrow || ""}
          onChange={(v) => update("heroEyebrow", v)}
          placeholder="예: Ivy Square · Commercial"
        />
        <Field
          label="브랜드 라인"
          value={project.heroBrandLine || ""}
          onChange={(v) => update("heroBrandLine", v)}
          placeholder="예: 아이비스퀘어 · 송도 하늘채 아이비원"
        />
        <label className="block text-sm">
          헤드라인
          <textarea
            className="mt-1 w-full border border-line px-3 py-2"
            rows={2}
            value={project.heroHeadline}
            onChange={(e) => update("heroHeadline", e.target.value)}
            placeholder="투자 가치의 스케일이 다르다"
          />
        </label>
        <label className="block text-sm">
          설명 문구
          <textarea
            className="mt-1 w-full border border-line px-3 py-2"
            rows={4}
            value={project.heroSubcopy}
            onChange={(e) => update("heroSubcopy", e.target.value)}
          />
        </label>
        <Field
          label="강조 한 줄"
          value={project.heroAccentLine || ""}
          onChange={(v) => update("heroAccentLine", v)}
          placeholder="예: 송도학원가 랜드마크 상가 — 아이비스퀘어"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="CTA 버튼 1"
            value={project.heroCtaPrimary || ""}
            onChange={(v) => update("heroCtaPrimary", v)}
          />
          <Field
            label="CTA 버튼 2"
            value={project.heroCtaSecondary || ""}
            onChange={(v) => update("heroCtaSecondary", v)}
          />
        </div>
      </section>

      <section className="mt-6 space-y-4 border border-line bg-surface p-5">
        <h2 className="font-display text-xl text-brand">기본 · 홍보관</h2>
        <Field label="주소" value={project.address} onChange={(v) => update("address", v)} />
        <Field label="홍보관명" value={project.prCenterName} onChange={(v) => update("prCenterName", v)} />
        <Field label="홍보관 주소" value={project.prCenterAddress} onChange={(v) => update("prCenterAddress", v)} />
        <Field label="홍보관 전화" value={project.prCenterPhone} onChange={(v) => update("prCenterPhone", v)} />
        <Field label="운영시간" value={project.prCenterHours} onChange={(v) => update("prCenterHours", v)} />
        <Field label="지도 URL" value={project.prCenterMapUrl} onChange={(v) => update("prCenterMapUrl", v)} />
      </section>

      <section className="mt-6 space-y-4 border border-line bg-surface p-5">
        <h2 className="font-display text-xl text-brand">분양안내 본문</h2>
        <label className="block text-sm">
          분양 조건
          <textarea
            className="mt-1 w-full border border-line px-3 py-2"
            rows={6}
            value={project.salesTerms}
            onChange={(e) => update("salesTerms", e.target.value)}
            placeholder="계약금/중도금/잔금 등"
          />
        </label>
        <label className="block text-sm">
          유의사항
          <textarea
            className="mt-1 w-full border border-line px-3 py-2"
            rows={6}
            value={project.notices}
            onChange={(e) => update("notices", e.target.value)}
          />
        </label>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-brand">분양 일정</h3>
            <button type="button" onClick={addSchedule} className="text-sm text-brand underline">
              일정 추가
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {project.salesSchedule.map((s, idx) => (
              <div key={s.id} className="grid gap-2 border border-line p-3 md:grid-cols-2">
                <input
                  className="border border-line px-2 py-1 text-sm"
                  placeholder="날짜 표기"
                  value={s.dateLabel}
                  onChange={(e) => {
                    const next = [...project.salesSchedule];
                    next[idx] = { ...s, dateLabel: e.target.value };
                    update("salesSchedule", next);
                  }}
                />
                <input
                  className="border border-line px-2 py-1 text-sm"
                  placeholder="제목"
                  value={s.title}
                  onChange={(e) => {
                    const next = [...project.salesSchedule];
                    next[idx] = { ...s, title: e.target.value };
                    update("salesSchedule", next);
                  }}
                />
                <textarea
                  className="border border-line px-2 py-1 text-sm md:col-span-2"
                  placeholder="설명"
                  rows={2}
                  value={s.description}
                  onChange={(e) => {
                    const next = [...project.salesSchedule];
                    next[idx] = { ...s, description: e.target.value };
                    update("salesSchedule", next);
                  }}
                />
                <button
                  type="button"
                  className="text-left text-xs text-red-700"
                  onClick={() =>
                    update(
                      "salesSchedule",
                      project.salesSchedule.filter((x) => x.id !== s.id),
                    )
                  }
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={save} className="bg-brand px-5 py-2.5 text-sm text-white">
          저장
        </button>
        {msg ? <p className="text-sm text-brand">{msg}</p> : null}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        className="mt-1 w-full border border-line px-3 py-2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
