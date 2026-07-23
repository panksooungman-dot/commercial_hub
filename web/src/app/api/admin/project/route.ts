import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { store } from "@/lib/store";
import { Project } from "@/lib/types";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await store.getProject());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as Project;
    await store.saveProject(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
