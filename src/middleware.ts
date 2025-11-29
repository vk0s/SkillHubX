import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/notes") ||
    req.nextUrl.pathname.startsWith("/upload") ||
    req.nextUrl.pathname.startsWith("/mock-test") ||
    req.nextUrl.pathname.startsWith("/community");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return null;
  }

  if (isProtected && !isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(from)}`, req.url)
    );
  }

  // Admin Check
  if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return null;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/admin/:path*", "/notes/:path*", "/upload/:path*", "/mock-test/:path*", "/community/:path*"],
};
