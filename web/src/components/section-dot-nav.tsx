"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

export function SectionDotNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el != null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    // 마지막 섹션은 페이지 하단에 붙어 있어 화면 중앙 밴드까지 스크롤되지 않을 수 있음 — 바닥 근접 시 강제 활성화
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) setActiveId(sections[sections.length - 1].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="섹션 바로가기"
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      {sections.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className="group flex items-center gap-2.5"
            aria-current={active ? "true" : undefined}
          >
            <span
              className={`whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-deep shadow-sm ring-1 ring-line transition-all duration-200 ${
                active
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-1 opacity-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block shrink-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.8)] transition-all duration-200 ${
                active
                  ? "h-2.5 w-2.5 bg-brand"
                  : "h-2 w-2 bg-white/80 ring-1 ring-brand-deep/30 group-hover:bg-accent"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
