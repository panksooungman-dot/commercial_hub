import "server-only";
import crypto from "crypto";

const SOLAPI_SEND_URL = "https://api.solapi.com/messages/v4/send";

function buildAuthHeader(apiKey: string, apiSecret: string) {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString("hex");
  const signature = crypto.createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
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

/** 실패해도 문의 접수 자체는 막지 않도록 호출부에서 예외를 삼킨다 */
export async function sendAdminSms(text: string) {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_SENDER_NUMBER;
  const to = process.env.SOLAPI_ADMIN_PHONE;
  if (!apiKey || !apiSecret || !from || !to) return;

  const res = await fetch(SOLAPI_SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: buildAuthHeader(apiKey, apiSecret),
    },
    body: JSON.stringify({ message: { to, from, text } }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Solapi 발송 실패 (${res.status}): ${body}`);
  }
}
