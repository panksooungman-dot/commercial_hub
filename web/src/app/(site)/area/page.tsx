import Image from "next/image";
import Link from "next/link";
import { store } from "@/lib/store";

export default async function AreaPage() {
  const area = await store.getArea();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#0b1622] text-white">
        <Image
          src="/images/area-header.jpg"
          alt="송도 1공구 및 주변 상권 항공뷰"
          fill
          priority
          quality={90}
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04141f]/80 via-[#04141f]/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase sm:text-sm">
            Area Guide
          </p>
          <h1 className="mt-2 font-display text-xl text-white sm:text-2xl md:text-3xl">
            {area.positioningHeadline}
          </h1>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-muted">
        홍보 자료 기준 입지 가이드입니다. 학원가·배후세대·주변 권역을 한눈에 보세요.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {area.points.map((p) => (
          <div key={p.title} className="border-t-2 border-brand bg-surface p-5">
            <h2 className="font-display text-xl text-brand">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl text-brand-deep">송도 주요 상권</h2>
      <div className="mt-6 space-y-4">
        {area.districts.map((d) => (
          <details key={d.name} className="border border-line bg-surface open:shadow-sm">
            <summary className="cursor-pointer px-4 py-3 font-medium text-brand">{d.name}</summary>
            <ul className="space-y-1 border-t border-line px-4 py-3 text-sm text-muted">
              {d.traits.map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/plan" className="bg-brand px-4 py-2 text-sm text-white">
          호실·도면
        </Link>
        <Link href="/contact" className="border border-line px-4 py-2 text-sm">
          상담 신청
        </Link>
      </div>
    </div>
  );
}
