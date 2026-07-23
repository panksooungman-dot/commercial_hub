import { InquiryForm } from "@/components/inquiry-form";
import { store } from "@/lib/store";

type Search = Promise<{ building?: string; floor?: string; unit?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const project = await store.getProject();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">상담 · 홍보관</h1>
      <p className="mt-2 text-muted">관심 호실을 남기시면 담당자가 안내드립니다.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <InquiryForm
          defaultBuilding={sp.building || ""}
          defaultFloor={sp.floor || ""}
          defaultUnitNo={sp.unit || ""}
        />

        <div className="border border-line bg-surface p-6">
          <h2 className="font-display text-2xl text-brand">{project.prCenterName}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">주소</dt>
              <dd className="mt-1">
                {project.prCenterAddress || "관리자에서 홍보관 주소를 등록하세요."}
              </dd>
            </div>
            <div>
              <dt className="text-muted">전화</dt>
              <dd className="mt-1">
                {project.prCenterPhone || "관리자에서 연락처를 등록하세요."}
              </dd>
            </div>
            <div>
              <dt className="text-muted">운영시간</dt>
              <dd className="mt-1">
                {project.prCenterHours || "관리자에서 운영시간을 등록하세요."}
              </dd>
            </div>
          </dl>
          {project.prCenterMapUrl ? (
            <a
              href={project.prCenterMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-brand underline"
            >
              지도 보기
            </a>
          ) : (
            <p className="mt-4 text-xs text-muted">지도 URL도 관리자에서 연결할 수 있습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
