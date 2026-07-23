import { NextResponse } from "next/server";
import { setAdminSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const password = String(body.password || "");
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
