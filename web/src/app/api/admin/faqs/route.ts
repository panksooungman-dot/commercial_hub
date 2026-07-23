import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Faq } from "@/lib/types";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getFaqs());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as Faq[];
    await store.saveFaqs(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as Omit<Faq, "id" | "updatedAt">;
    const faqs = await store.getFaqs();
    const faq: Faq = {
      ...body,
      id: `faq-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    faqs.push(faq);
    await store.saveFaqs(faqs);
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
