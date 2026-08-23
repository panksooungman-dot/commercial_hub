import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Unit } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    revalidatePath("/");
    revalidatePath("/plan");
    revalidatePath("/units", "layout");
    revalidatePath("/interest");
    return NextResponse.json(units[idx]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
