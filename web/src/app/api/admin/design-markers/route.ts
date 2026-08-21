import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { sanitizeDesignMarkerOverrides } from "@/lib/design-markers";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getDesignMarkerOverrides());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = sanitizeDesignMarkerOverrides(await req.json());
    await store.saveDesignMarkerOverrides(body);
    revalidatePath("/");
    return NextResponse.json({ ok: true, added: body.added.length, removed: body.removed.length });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
