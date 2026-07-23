import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";

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
    const { id, status } = await req.json();
    const list = await store.getInquiries();
    const idx = list.findIndex((i) => i.id === id);
    if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    list[idx].status = status;
    await store.saveInquiries(list);
    return NextResponse.json(list[idx]);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
