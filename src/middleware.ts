import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

// Routes that logged-in users should not access (redirect to dashboard)
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // access_token is set by the backend (onrender.com) — it's not visible here.
  // billd_session is a plain cookie the frontend JS sets on this domain after
  // a successful login, so the middleware can see that the user is authenticated.
  const accessToken = req.cookies.get("access_token")?.value;
  const sessionFlag = req.cookies.get("billd_session")?.value;
  const isLoggedIn = Boolean(accessToken || sessionFlag);

  // Redirect authenticated users away from sign-in / sign-up
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users trying to access protected pages
  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  if (!isLoggedIn && !isPublic) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("next", pathname); // remember where they were going
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|logo.svg|videos).*)",
  ],
};
