import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = [
  "/ai",
  "/items/add",
  "/items/manage",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

 
  const isProtected =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    /^\/items\/[^/]+$/.test(pathname); // matches /items/xyz but not /items/add or /items/manage (already covered above)

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/ai/:path*",
    "/items/:path*",
  ],
};