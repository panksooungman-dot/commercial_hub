import "server-only";
import crypto from "crypto";

const SOLAPI_SEND_URL = "https://api.solapi.com/messages/v4/send";

function buildAuthHeader(apiKey: string, apiSecret: string) {
  /** Solapi 공식 예시 포맷(예: 2019-07-01T00:41:48Z)에 맞춰 밀리초를 제거한다 */
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const salt = crypto.randomBytes(32).toString("hex");
  const signature = crypto.createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

/** Vercel 환경변수에 하이픈 등을 섞어 입력해도 동작하도록 숫자만 남긴다 */
function normalizePhone(raw: string) {
  return raw.replace(/[^0-9]/g, "");
}

/** SOLAPI_API_KEY/SECRET/SENDER_NUMBER/ADMIN_PHONE이 모두 설정돼 있어야 발송한다 */
export function smsConfigured() {
  return Boolean(
    process.env.SOLAPI_API_KEY &&
      process.env.SOLAPI_API_SECRET &&
      process.env.SOLAPI_SENDER_NUMBER &&
      process.env.SOLAPI_ADMIN_PHONE,
  );
}

async function sendOne(apiKey: string, apiSecret: string, from: string, to: string, text: string) {
  const res = await fetch(SOLAPI_SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: buildAuthHeader(apiKey, apiSecret),
    },
    body: JSON.stringify({ message: { to: normalizePhone(to), from: normalizePhone(from), text } }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Solapi 발송 실패 (${to}, ${res.status}): ${body}`);
  }
}

/**
 * 실패해도 문의 접수 자체는 막지 않도록 호출부에서 예외를 삼킨다.
 * SOLAPI_ADMIN_PHONE은 콤마로 여러 번호를 넣으면 전원에게 발송된다 (예: "01011112222,01033334444").
 */
export async function sendAdminSms(text: string) {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_SENDER_NUMBER;
  const recipients = (process.env.SOLAPI_ADMIN_PHONE || "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  if (!apiKey || !apiSecret || !from || recipients.length === 0) return;

  const results = await Promise.allSettled(
    recipients.map((to) => sendOne(apiKey, apiSecret, from, to, text)),
  );
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failures.length > 0) {
    throw new Error(failures.map((f) => f.reason).join("; "));
  }
}
