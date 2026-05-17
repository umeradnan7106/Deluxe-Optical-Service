import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth from localStorage is not possible in middleware (server-side).
  // We use a cookie 'auth-token' set by the client after login instead.
  const token = request.cookies.get("auth-token")?.value;
  const isAdmin = request.cookies.get("is-admin")?.value === "true";

  if (pathname.startsWith("/account") && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && (!token || !isAdmin)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
