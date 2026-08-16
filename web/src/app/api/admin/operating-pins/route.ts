import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Building, Floor } from "@/lib/types";
import type { OperatingPin } from "@/lib/operating-pins";

const FLOORS: Floor[] = ["B1", "1F", "2F"];
const BUILDINGS: Building[] = ["A", "B"];

function sanitize(list: unknown): OperatingPin[] {
  if (!Array.isArray(list)) return [];
  const out: OperatingPin[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Partial<OperatingPin>;
    const floor = FLOORS.includes(item.floor as Floor) ? (item.floor as Floor) : null;
    const building = BUILDINGS.includes(item.building as Building)
      ? (item.building as Building)
      : null;
    const label = typeof item.label === "string" ? item.label.trim() : "";
    const x = Number(item.x);
    const y = Number(item.y);
    if (!floor || !building || !label || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    out.push({
      id: typeof item.id === "string" && item.id ? item.id : `op-${Date.now()}-${out.length}`,
      floor,
      building,
      label,
      x: Math.round(Math.min(100, Math.max(0, x)) * 10) / 10,
      y: Math.round(Math.min(100, Math.max(0, y)) * 10) / 10,
      unitId:
        typeof item.unitId === "string" && item.unitId.trim() ? item.unitId.trim() : undefined,
      roomLabel:
        typeof item.roomLabel === "string" && item.roomLabel.trim()
          ? item.roomLabel.trim()
          : undefined,
    });
  }
  return out;
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getOperatingPins());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = sanitize(await req.json());
    await store.saveOperatingPins(body);
    revalidatePath("/plan");
    revalidatePath("/units", "layout");
    return NextResponse.json({ ok: true, count: body.length });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
