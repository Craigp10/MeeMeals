import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("meemeals_session");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/create-account");

  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // If there's a session cookie and user is on auth page, redirect to dashboard
  // Note: We're just checking for cookie presence here; actual session validation
  // happens in API routes via iron-session
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If no session cookie and user is on dashboard, redirect to login
  if (isDashboardPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/create-account"],
};
