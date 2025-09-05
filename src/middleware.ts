import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get the session token from cookies
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/sign-in" || path === "/sign-up" || path === "/verify";

  // If user is logged in and tries to access sign-in or sign-up → redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is NOT logged in and tries to access protected routes → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Otherwise, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up", "/verify"],
};
