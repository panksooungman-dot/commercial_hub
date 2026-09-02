"use client";

import { useEffect, useState } from "react";
import { HeroSlide, HeroSlideOverlay, Project, ScheduleItem } from "@/lib/types";

const EMPTY_OVERLAY: HeroSlideOverlay = {
  statLines: [],
  headlinePrefix: "",
  headlineBig: "",
  brandLine: "",
  badge: "",
};

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

  function addSlide() {
    const slide: HeroSlide = { id: `slide-${Date.now()}`, image: "", caption: "" };
    update("heroSlides", [...project!.heroSlides, slide]);
  }

  function updateSlide(id: string, patch: Partial<HeroSlide>) {
    update(
      "heroSlides",
      project!.heroSlides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  function removeSlide(id: string) {
    update(
      "heroSlides",
      project!.heroSlides.filter((s) => s.id !== id),
    );
  }

  function moveSlide(id: string, dir: -1 | 1) {
    const list = [...project!.heroSlides];
    const idx = list.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];
    update("heroSlides", list);
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
    if (res.ok) {
      setMsg("저장되었습니다. 홈 메인 배너에 바로 반영됩니다.");
      return;
    }
    const body = await res.json().catch(() => null);
    setMsg(`저장 실패${body?.error ? `: ${body.error}` : ""}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-3 border-b border-line bg-[#eef1f4]/95 px-4 py-3 backdrop-blur">
        <div>
          <h1 className="font-display text-lg text-brand">프로젝트 · 배너 · 연락처</h1>
          {msg ? <p className="text-xs text-brand">{msg}</p> : null}
        </div>
        <button type="button" onClick={save} className="shrink-0 bg-brand px-5 py-2.5 text-sm text-white">
          저장
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-brand">메인 배너 슬라이드</h2>
            <p className="mt-1 text-xs text-muted">
              홈 화면 맨 위 배너가 여러 장 자동으로 넘어갑니다. 이미지는 /images/... 경로 또는 전체
              URL을 입력하세요. 영상 경로를 입력하면 그 슬라이드는 영상으로 재생되고, 이미지는 영상
              로딩 중 포스터로 쓰입니다. 문구·버튼은 위 &ldquo;메인 배너 문구&rdquo;가 모든
              슬라이드에 공통으로 표시됩니다.
            </p>
          </div>
          <button type="button" onClick={addSlide} className="shrink-0 text-sm text-brand underline">
            슬라이드 추가
          </button>
        </div>
        <div className="space-y-3">
          {project.heroSlides.map((s, idx) => (
            <div key={s.id} className="grid gap-2 border border-line p-3 md:grid-cols-2">
              <input
                className="border border-line px-2 py-1 text-sm"
                placeholder="이미지(또는 영상 포스터) 경로 (예: /images/aerial-plan.jpg)"
                value={s.image}
                onChange={(e) => updateSlide(s.id, { image: e.target.value })}
              />
              <input
                className="border border-line px-2 py-1 text-sm"
                placeholder="영상 경로 (선택, 예: /videos/hero-banner.mp4)"
                value={s.video ?? ""}
                onChange={(e) => updateSlide(s.id, { video: e.target.value || undefined })}
              />
              <input
                className="border border-line px-2 py-1 text-sm md:col-span-2"
                placeholder="슬라이드 설명 (참고용, 화면에는 표시 안 됨)"
                value={s.caption}
                onChange={(e) => updateSlide(s.id, { caption: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={Boolean(s.overlay)}
                  onChange={(e) =>
                    updateSlide(s.id, { overlay: e.target.checked ? EMPTY_OVERLAY : undefined })
                  }
                />
                이 슬라이드만 사진 위에 문구 직접 얹기 (공통 배너 문구 대신 사용)
              </label>
              {s.overlay ? (
                <div className="grid gap-2 border border-line bg-background p-2 md:col-span-2 md:grid-cols-2">
                  <div className="flex gap-4 text-sm md:col-span-2">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name={`overlay-style-${s.id}`}
                        checked={(s.overlay.style ?? "centered") === "centered"}
                        onChange={() =>
                          updateSlide(s.id, { overlay: { ...s.overlay!, style: "centered" } })
                        }
                      />
                      가운데 정렬 (큰 헤드라인 강조)
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name={`overlay-style-${s.id}`}
                        checked={s.overlay.style === "left"}
                        onChange={() => updateSlide(s.id, { overlay: { ...s.overlay!, style: "left" } })}
                      />
                      좌측 정렬 (프로젝트명 강조)
                    </label>
                  </div>
                  {(s.overlay.style ?? "centered") === "centered" ? (
                    <textarea
                      className="border border-line px-2 py-1 text-sm md:col-span-2"
                      placeholder={"작은 통계 문구, 줄바꿈으로 구분\n예: 16,000여 배후세대의 스케일도"}
                      rows={3}
                      value={s.overlay.statLines.join("\n")}
                      onChange={(e) =>
                        updateSlide(s.id, {
                          overlay: { ...s.overlay!, statLines: e.target.value.split("\n") },
                        })
                      }
                    />
                  ) : null}
                  <input
                    className="border border-line px-2 py-1 text-sm"
                    placeholder="헤드라인 앞 작은 문구 (예: 송도가 기다려온)"
                    value={s.overlay.headlinePrefix}
                    onChange={(e) =>
                      updateSlide(s.id, { overlay: { ...s.overlay!, headlinePrefix: e.target.value } })
                    }
                  />
                  <input
                    className="border border-line px-2 py-1 text-sm"
                    placeholder={
                      (s.overlay.style ?? "centered") === "left"
                        ? "중간 크기 헤드라인 (예: 최상위권 복합상업시설)"
                        : "큰 헤드라인 (예: 최상위권)"
                    }
                    value={s.overlay.headlineBig}
                    onChange={(e) =>
                      updateSlide(s.id, { overlay: { ...s.overlay!, headlineBig: e.target.value } })
                    }
                  />
                  <input
                    className="border border-line px-2 py-1 text-sm"
                    placeholder={
                      (s.overlay.style ?? "centered") === "left"
                        ? "프로젝트명 — 크고 진하게 강조됨 (예: 송도 하늘채 아이비원)"
                        : "프로젝트명 (예: 송도 하늘채 아이비원)"
                    }
                    value={s.overlay.brandLine}
                    onChange={(e) =>
                      updateSlide(s.id, { overlay: { ...s.overlay!, brandLine: e.target.value } })
                    }
                  />
                  <input
                    className="border border-line px-2 py-1 text-sm"
                    placeholder="배지 문구 (예: 단지 내 상가)"
                    value={s.overlay.badge}
                    onChange={(e) =>
                      updateSlide(s.id, { overlay: { ...s.overlay!, badge: e.target.value } })
                    }
                  />
                </div>
              ) : null}
              <div className="flex items-center gap-3 md:col-span-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSlide(s.id, -1)}
                  className="text-xs text-brand underline disabled:opacity-30"
                >
                  위로
                </button>
                <button
                  type="button"
                  disabled={idx === project.heroSlides.length - 1}
                  onClick={() => moveSlide(s.id, 1)}
                  className="text-xs text-brand underline disabled:opacity-30"
                >
                  아래로
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(s.id)}
                  className="text-xs text-red-700 underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          {project.heroSlides.length === 0 ? (
            <p className="text-sm text-muted">슬라이드가 없으면 배너가 비어 보입니다. 최소 1장은 등록해 주세요.</p>
          ) : null}
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
