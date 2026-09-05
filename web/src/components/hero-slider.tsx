"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { HeroSlide } from "@/lib/types";

const SLIDE_DURATION_MS = 5500;

function chunkHeadline(text: string) {
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += 2) lines.push(text.slice(i, i + 2));
  return lines;
}

const OVERLAY_ACCENT = "#9c7a2e";
const OVERLAY_TEAL = "#2f7182";

/** 가운데 정렬 — 사진 위 가운데에 큰 문구를 직접 얹는 밝은 톤 오버레이. 문구는 순서대로 페이드업, 강조 헤드라인은 포인트 컬러로 표시 */
function CenteredOverlayContent({ overlay }: { overlay: NonNullable<HeroSlide["overlay"]> }) {
  const headlineLines = chunkHeadline(overlay.headlineBig);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
      <div className="max-w-2xl">
        <div className="animate-hero-fade-up space-y-0.5 break-keep text-sm font-medium text-brand-deep/80 sm:text-base">
          {overlay.statLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="animate-hero-fade-up mt-5 break-keep text-base font-medium text-brand-deep/70 [animation-delay:120ms] sm:text-lg">
          {overlay.headlinePrefix}
        </p>
        <h2 className="animate-hero-fade-up mt-3 font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-brand-deep [animation-delay:240ms] sm:mt-5 sm:text-8xl md:text-9xl">
          {headlineLines.map((line, i) => (
            <span
              key={i}
              className="block"
              style={i === headlineLines.length - 1 ? { color: OVERLAY_ACCENT } : undefined}
            >
              {line}
            </span>
          ))}
        </h2>
        <div className="animate-hero-fade-up mt-6 flex items-center justify-center gap-2 break-keep text-sm font-semibold text-brand-deep [animation-delay:420ms] sm:text-base">
          <span>{overlay.brandLine}</span>
          <span className="rounded-sm bg-brand-deep px-2 py-0.5 text-xs font-semibold text-white">
            {overlay.badge}
          </span>
        </div>
      </div>
    </div>
  );
}

/** 좌측 정렬 — headlinePrefix(작게) → headlineBig(중간) → brandLine(크고 포인트 컬러) → badge 순으로 왼쪽에 쌓는 오버레이 */
function LeftOverlayContent({ overlay }: { overlay: NonNullable<HeroSlide["overlay"]> }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 md:px-14">
      <div className="max-w-3xl">
        <p className="animate-hero-fade-up break-keep text-sm font-medium text-brand-deep/70 sm:text-lg">
          {overlay.headlinePrefix}
        </p>
        <p className="animate-hero-fade-up mt-2 break-keep text-xl font-bold text-brand-deep [animation-delay:120ms] sm:text-3xl md:text-4xl">
          {overlay.headlineBig}
        </p>
        <h2
          className="animate-hero-fade-up mt-3 break-keep font-display text-3xl leading-[1.15] font-extrabold tracking-tight [animation-delay:240ms] sm:text-5xl sm:leading-[1.05] md:text-6xl"
          style={{ color: OVERLAY_TEAL }}
        >
          {overlay.brandLine}
        </h2>
        <p
          className="animate-hero-fade-up mt-2 break-keep text-lg font-bold [animation-delay:360ms] sm:text-2xl"
          style={{ color: OVERLAY_TEAL }}
        >
          {overlay.badge}
        </p>
      </div>
    </div>
  );
}

function SlideOverlayContent({ overlay }: { overlay: NonNullable<HeroSlide["overlay"]> }) {
  return overlay.style === "left" ? (
    <LeftOverlayContent overlay={overlay} />
  ) : (
    <CenteredOverlayContent overlay={overlay} />
  );
}

export function HeroSlider({
  slides,
  alt,
  sharedOverlay,
}: {
  slides: HeroSlide[];
  alt: string;
  sharedOverlay: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [playing, slides.length]);

  if (slides.length === 0) return null;

  return (
    <>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          {slide.video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={slide.video}
              poster={slide.image}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "none"}
              aria-hidden="true"
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={slide.image}
              alt={alt}
              fill
              priority={i === 0}
              quality={90}
              sizes="(max-width: 1680px) 100vw, 1680px"
              className="object-cover"
            />
          )}

          {slide.overlay?.style === "left" ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
              <SlideOverlayContent overlay={slide.overlay} />
            </>
          ) : slide.overlay ? (
            <>
              <div className="absolute inset-0 bg-white/55" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/45 to-white/70" />
              <SlideOverlayContent overlay={slide.overlay} />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[#04141f]/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04141f]/60 via-[#04141f]/15 to-transparent" />
              {sharedOverlay}
            </>
          )}
        </div>
      ))}

      {slides.length > 1 ? (
        <div className="absolute bottom-5 left-5 z-10 flex items-center gap-3 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-sm sm:bottom-7 sm:left-10 md:left-14">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "슬라이드 일시정지" : "슬라이드 재생"}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white/90 transition hover:border-white hover:text-white"
          >
            {playing ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <rect x="1" y="0" width="3" height="10" />
                <rect x="6" y="0" width="3" height="10" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M0 0 L10 5 L0 10 Z" />
              </svg>
            )}
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${i + 1}번째 배너로 이동`}
                className="h-1 w-6 overflow-hidden rounded-full bg-white/30 sm:w-8"
              >
                <span
                  className="block h-full bg-white transition-[width] duration-300 ease-linear"
                  style={{ width: i === active ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-medium tabular-nums text-white/80">
            {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </>
  );
}
