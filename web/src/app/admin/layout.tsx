import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[#eef1f4] text-foreground">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-display text-lg font-semibold text-brand">
            분양 CMS
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/" className="text-muted hover:text-brand">
              사이트
            </Link>
            <Link href="/admin/project" className="text-muted hover:text-brand">
              프로젝트
            </Link>
            <Link href="/admin/units" className="text-muted hover:text-brand">
              호실
            </Link>
            <Link href="/admin/faqs" className="text-muted hover:text-brand">
              FAQ
            </Link>
            <Link href="/admin/inquiries" className="text-muted hover:text-brand">
              상담
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
