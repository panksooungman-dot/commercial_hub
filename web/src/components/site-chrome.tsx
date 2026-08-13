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

export function SiteHeader({ projectName, phone }: { projectName: string; phone?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4">
        <Link href="/" className="min-w-0 shrink">
          <p className="truncate font-display text-base font-semibold text-brand-deep sm:text-lg md:text-xl">
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {phone ? (
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-brand/60 px-2 py-2 text-xs font-medium text-brand hover:border-brand hover:bg-brand/5 sm:gap-1.5 sm:px-3 sm:text-sm"
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>통화하기</span>
            </a>
          ) : null}
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-sm bg-brand px-2 py-2 text-xs font-medium text-white hover:bg-brand-deep sm:px-3 sm:text-sm"
          >
            상담 신청
          </Link>
        </div>
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
