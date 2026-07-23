import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Unit } from "@/lib/types";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getUnits());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as Unit[];
    await store.saveUnits(body);
    return NextResponse.json({ ok: true, count: body.length });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
