import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PARTICIPANT_PREFIX = "/dashboard";
const ADMIN_PREFIX = "/admin";
const VOLUNTEER_PREFIX = "/volunteer";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Unauthenticated — redirect to login for protected routes
  if (!session) {
    if (
      pathname.startsWith(PARTICIPANT_PREFIX) ||
      pathname.startsWith(ADMIN_PREFIX) ||
      pathname.startsWith(VOLUNTEER_PREFIX) ||
      pathname === "/auth/redirect"
    ) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const role = (session.user as { role?: string })?.role;

  // Admin-only routes
  if (pathname.startsWith(ADMIN_PREFIX) && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Volunteer routes — volunteer or admin
  if (
    pathname.startsWith(VOLUNTEER_PREFIX) &&
    role !== "volunteer" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect logged-in users away from auth pages — send admins to /admin
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/volunteer/:path*",
    "/auth/redirect",
    "/login",
    "/register",
  ],
};
