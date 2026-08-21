import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { Inquiry } from "@/lib/types";
import { sendAdminSms } from "@/lib/sms";

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

  const unitInterest = [inquiry.interestBuilding, inquiry.interestFloor, inquiry.interestUnitNo]
    .filter(Boolean)
    .join(" ");
  try {
    /** Vercel 서버리스는 응답 후 함수가 바로 종료될 수 있어 fire-and-forget 대신 완료까지 대기한다 */
    await sendAdminSms(
      `[아이비원 문의] ${name} (${phone})${unitInterest ? ` · 관심호실 ${unitInterest}` : ""}\n관리자 페이지에서 확인해 주세요.`,
    );
  } catch (err) {
    console.error("[inquiry] admin SMS 발송 실패", err);
  }

  return NextResponse.json({ ok: true, id: inquiry.id });
}
