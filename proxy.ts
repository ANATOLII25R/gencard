// Proxy runs on Edge Runtime — cannot import pg (Node.js) from lib/auth
// Uses next-auth JWT token verification directly
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = ["/studio", "/editor", "/account"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Legacy URLs dopo il rename dashboard → studio (prima del check auth)
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/studio" + pathname.slice("/dashboard".length);
    return NextResponse.redirect(url, 308);
  }

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  // Decode JWT token (works on Edge — no DB needed)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "volantino-ai-secret-key-2024-secure",
  });

  if (!token) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
