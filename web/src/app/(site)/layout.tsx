import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { store } from "@/lib/store";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const project = await store.getProject();
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader projectName={project.projectName} />
      <main className="flex-1">{children}</main>
      <SiteFooter developers={project.developers} phone={project.prCenterPhone} />
    </div>
  );
}
