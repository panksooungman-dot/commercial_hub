import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Building, Floor } from "@/lib/types";
import { mergeUnitPins, type UnitPinRecord } from "@/lib/unit-pins";

const FLOORS: Floor[] = ["B1", "1F", "2F"];
const BUILDINGS: Building[] = ["A", "B"];

function sanitize(list: unknown): UnitPinRecord[] {
  if (!Array.isArray(list)) return [];
  const out: UnitPinRecord[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Partial<UnitPinRecord>;
    const floor = FLOORS.includes(item.floor as Floor) ? (item.floor as Floor) : null;
    const building = BUILDINGS.includes(item.building as Building)
      ? (item.building as Building)
      : null;
    const unitNo = typeof item.unitNo === "string" ? item.unitNo.trim() : "";
    const x = Number(item.x);
    const y = Number(item.y);
    if (!floor || !building || !unitNo || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    out.push({
      floor,
      building,
      unitNo,
      x: Math.round(Math.min(100, Math.max(0, x)) * 10) / 10,
      y: Math.round(Math.min(100, Math.max(0, y)) * 10) / 10,
      ...(item.removed === true ? { removed: true as const } : {}),
    });
  }
  return mergeUnitPins(out);
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getUnitPins());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = sanitize(await req.json());
    await store.saveUnitPins(body);
    revalidatePath("/plan");
    revalidatePath("/units", "layout");
    revalidatePath("/interest");
    return NextResponse.json({ ok: true, count: body.length });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
