import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /lab routes
  if (!pathname.startsWith("/lab")) return NextResponse.next();

  const secret = process.env.LAB_PASSWORD;
  if (!secret) return NextResponse.next(); // No password set = no protection (dev convenience)

  const cookie = request.cookies.get("lab_auth");
  if (cookie?.value === secret) return NextResponse.next();

  // Redirect to login page
  const loginUrl = new URL("/lab-login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/lab/:path*"],
};
