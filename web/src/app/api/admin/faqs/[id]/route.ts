import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Faq } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const patch = (await req.json()) as Partial<Faq>;
    const faqs = await store.getFaqs();
    const idx = faqs.findIndex((f) => f.id === id);
    if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    faqs[idx] = { ...faqs[idx], ...patch, id, updatedAt: new Date().toISOString() };
    await store.saveFaqs(faqs);
    return NextResponse.json(faqs[idx]);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const faqs = await store.getFaqs();
    await store.saveFaqs(faqs.filter((f) => f.id !== id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
