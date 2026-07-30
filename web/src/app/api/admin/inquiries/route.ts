import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Inquiry } from "@/lib/types";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getInquiries());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...patch } = (await req.json()) as { id: string } & Partial<
      Pick<Inquiry, "status" | "note">
    >;
    const list = await store.getInquiries();
    const idx = list.findIndex((i) => i.id === id);
    if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    list[idx] = { ...list[idx], ...patch };
    await store.saveInquiries(list);
    return NextResponse.json(list[idx]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
