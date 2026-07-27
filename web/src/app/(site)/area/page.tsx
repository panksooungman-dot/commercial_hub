import Link from "next/link";
import { store } from "@/lib/store";

export default async function AreaPage() {
  const area = await store.getArea();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm text-accent">1공구 상권 특성</p>
      <h1 className="mt-2 max-w-3xl font-display text-3xl text-brand-deep md:text-4xl">
        {area.positioningHeadline}
      </h1>

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
