import { store } from "@/lib/store";

export default async function GalleryPage() {
  const items = (await store.getGallery()).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-deep">갤러리</h1>
      <p className="mt-2 text-muted">이미지 URL은 관리자에서 등록합니다.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <figure key={item.id} className="border border-line bg-surface p-4">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.title} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-background text-sm text-muted">
                이미지 미등록
              </div>
            )}
            <figcaption className="mt-3">
              <p className="font-medium text-brand">{item.title}</p>
              <p className="text-sm text-muted">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
