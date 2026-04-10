// Middleware runs on Edge Runtime — it cannot import pg (Node.js) from lib/auth
// So we use next-auth's JWT token verification directly
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = ["/dashboard", "/editor", "/account"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  // Decode JWT token (works on Edge — no DB needed)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "volantino-ai-secret-key-2024-secure",
  });

  if (!token) {
    const loginUrl = new URL("/", req.url); // Redirect to homepage where modal opens
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
