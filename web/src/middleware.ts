import { NextRequest, NextResponse } from "next/server";

const COOKIE = "ch_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const raw = req.cookies.get(COOKIE)?.value;
  // 서명 검증은 API/페이지에서 수행. 미들웨어는 세션 쿠키 존재만 확인.
  if (!raw || raw.split(".").length < 3) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
