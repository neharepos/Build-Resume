import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAuthPage = path === "/login" || path === "/signup";
  const isPublicPath = path === "/" || isAuthPage || path === "/verifyemail";

  const token = request.cookies.get("token")?.value || "";

  // If user is logged in and tries to access standalone login/signup pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // If user is NOT logged in and tries to access a protected dashboard route
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/dashboard/:path*",
    "/editor/:path*"
  ],
};