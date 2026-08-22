"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const SLIDE_DURATION_MS = 5500;

export function HeroSlider({ slides, alt }: { slides: HeroSlide[]; alt: string }) {
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
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          )}
        </div>
      ))}

      {slides.length > 1 ? (
        <div className="absolute bottom-5 left-5 z-10 flex items-center gap-3 sm:bottom-7 sm:left-10 md:left-14">
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
