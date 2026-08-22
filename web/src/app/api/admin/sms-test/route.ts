import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendAdminSms, smsConfigured } from "@/lib/sms";

/** 관리자 알림 문자가 실제로 발송되는지, 실패한다면 어떤 오류인지 화면에서 바로 확인하기 위한 진단용 엔드포인트 */
export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!smsConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "환경변수 미설정: SOLAPI_API_KEY / SOLAPI_API_SECRET / SOLAPI_SENDER_NUMBER / SOLAPI_ADMIN_PHONE 중 하나 이상이 비어 있습니다.",
    });
  }

  try {
    await sendAdminSms(`[테스트 문자] 관리자 알림이 정상 작동합니다. (${new Date().toLocaleString("ko-KR")})`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
}
