// middleware.ts (root of project)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedPage = pathname.startsWith("/dashboard")

  // User is NOT logged in and trying to access protected page
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // User IS logged in and trying to access login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next() // let them through
}

// Tell Next.js which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
