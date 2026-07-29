import Link from "next/link";
import { InterestNavLink } from "@/components/interest-nav-link";

const NAV = [
  { href: "/about", label: "사업개요" },
  { href: "/area", label: "입지·상권" },
  { href: "/plan", label: "호실·도면" },
  { href: "/interest", label: "내 선택", special: true },
  { href: "/guide", label: "분양안내" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader({ projectName }: { projectName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="min-w-0">
          <p className="font-display text-lg font-semibold text-brand-deep md:text-xl">
            {projectName}
          </p>
          <p className="truncate text-xs text-muted">상업시설</p>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-brand lg:flex">
          {NAV.map((item) =>
            item.special ? (
              <InterestNavLink key={item.href} />
            ) : (
              <Link key={item.href} href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <Link
          href="/contact"
          className="rounded-sm bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-deep"
        >
          상담 신청
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto border-t border-line px-4 py-2 text-xs text-muted lg:hidden">
        {NAV.map((item) =>
          item.special ? (
            <span key={item.href} className="whitespace-nowrap text-brand">
              <InterestNavLink />
            </span>
          ) : (
            <Link key={item.href} href={item.href} className="whitespace-nowrap">
              {item.label}
            </Link>
          ),
        )}
      </div>
    </header>
  );
}

export function SiteFooter({
  developers,
  phone,
}: {
  developers: string[];
  phone: string;
}) {
  return (
    <footer className="mt-auto border-t border-line bg-brand-deep text-white/85">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg text-white">송도 하늘채 아이비원</p>
          <p className="mt-1 text-white/70">{developers.join(" · ")}</p>
        </div>
        <div className="text-white/70">
          {phone ? <p>문의 {phone}</p> : <p>문의 연락처는 관리자에서 등록하세요.</p>}
          <Link href="/admin" className="mt-2 inline-block text-xs text-white/40 hover:text-white/70">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  );
}
