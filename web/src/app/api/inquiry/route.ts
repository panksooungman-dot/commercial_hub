import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { Inquiry } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  if (!name || !phone) {
    return NextResponse.json({ error: "이름과 연락처는 필수입니다." }, { status: 400 });
  }
  if (!body.privacyAgreed) {
    return NextResponse.json({ error: "개인정보 동의가 필요합니다." }, { status: 400 });
  }

  const inquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    name,
    phone,
    email: String(body.email || ""),
    interestBuilding: body.interestBuilding || "",
    interestFloor: body.interestFloor || "",
    interestUnitNo: String(body.interestUnitNo || ""),
    preferredBusiness: String(body.preferredBusiness || ""),
    message: String(body.message || ""),
    createdAt: new Date().toISOString(),
    status: "new",
    note: "",
  };

  const list = await store.getInquiries();
  list.unshift(inquiry);
  await store.saveInquiries(list);
  return NextResponse.json({ ok: true, id: inquiry.id });
}
