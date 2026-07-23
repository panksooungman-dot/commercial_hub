import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "ch_admin_session";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminSession() {
  const token = `ok.${Date.now()}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, `${token}.${sign(token)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE)?.value;
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length < 3) return false;
  const sig = parts.pop()!;
  const token = parts.join(".");
  const expected = sign(token);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("UNAUTHORIZED");
}
