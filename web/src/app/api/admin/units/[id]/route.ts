import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Unit } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const patch = (await req.json()) as Partial<Unit>;
    const units = await store.getUnits();
    const idx = units.findIndex((u) => u.id === id);
    if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    units[idx] = {
      ...units[idx],
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    };
    await store.saveUnits(units);
    return NextResponse.json(units[idx]);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
