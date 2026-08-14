import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./app/lib/session";

const protectedPrefixes = [
  "/dashboard",
  "/scan",
  "/results",
  "/routine",
  "/coach",
  "/progress",
  "/health",
  "/settings"
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session);

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scan/:path*",
    "/results/:path*",
    "/routine/:path*",
    "/coach/:path*",
    "/progress/:path*",
    "/health/:path*",
    "/settings/:path*",
    "/login",
    "/signup"
  ]
};
