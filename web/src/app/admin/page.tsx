import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { store } from "@/lib/store";

const LINKS = [
  { href: "/admin/project", title: "프로젝트·배너·연락처", desc: "메인 배너 문구, 분양일정, 조건, 홍보관" },
  { href: "/admin/units", title: "호실 관리", desc: "분양가, 상태, 계약면적, 권장업종" },
  { href: "/admin/faqs", title: "FAQ", desc: "질문·답변 작성" },
  { href: "/admin/area", title: "입지 콘텐츠", desc: "상권 카피 수정" },
  { href: "/admin/operating", title: "영업 점포 마커", desc: "도면 노란 표시 — 영업 중인 점포 이름·위치" },
  { href: "/admin/unit-pins", title: "호실 마커", desc: "빨간 호실 번호를 드래그해서 위치 보정" },
];

export default async function AdminHomePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [project, units, faqs, inquiries] = await Promise.all([
    store.getProject(),
    store.getUnits(),
    store.getFaqs(),
    store.getInquiries(),
  ]);

  const priced = units.filter((u) => u.price != null).length;
  const answered = faqs.filter((f) => f.answer.trim()).length;
  const newInq = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">대시보드</h1>
      <p className="mt-2 text-sm text-muted">{project.projectName} CMS</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "호실", value: `${units.length}실`, href: "/admin/units" },
          { label: "분양가 입력", value: `${priced}실`, href: "/admin/units" },
          { label: "FAQ 답변", value: `${answered}/${faqs.length}`, href: "/admin/faqs" },
          { label: "신규 상담", value: `${newInq}건`, href: "/admin/inquiries" },
        ].map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="border border-line bg-surface p-4 hover:border-brand"
          >
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 font-display text-2xl text-brand">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="border border-line bg-surface p-5 hover:border-brand">
            <h2 className="font-display text-xl text-brand">{l.title}</h2>
            <p className="mt-1 text-sm text-muted">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
