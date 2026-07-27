import { redirect } from "next/navigation";

type Search = Promise<{
  floor?: string;
  building?: string;
  q?: string;
  status?: string;
  unit?: string;
}>;

/** 호실 목록은 /plan(호실·도면)으로 통합 */
export default async function UnitsPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  if (sp.floor) q.set("floor", sp.floor);
  if (sp.building) q.set("building", sp.building);
  if (sp.q) q.set("q", sp.q);
  if (sp.status && sp.status !== "all") q.set("status", sp.status);
  if (sp.unit) q.set("unit", sp.unit);
  const qs = q.toString();
  redirect(qs ? `/plan?${qs}` : "/plan");
}
