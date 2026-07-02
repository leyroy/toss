// middleware.ts (root of project)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value
  const { pathname } = request.nextUrl

  const PROTECTED_PAGES = [
    "/",
    "/tickets",
    "/students",
    "/staffs",
    "/settings",
    "/help",
  ]
  const AUTH_PAGES = ["/login", "/register"]

  const isAuthPage = AUTH_PAGES.includes(pathname)
  const isProtectedPage = PROTECTED_PAGES.includes(pathname)

  // User is NOT logged in and trying to access protected page
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // User IS logged in and trying to access login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next() // let them through
}

// Tell Next.js which routes to run middleware on
export const config = {
  matcher: [
    "/",
    "/tickets",
    "/students",
    "/staffs",
    "/settings",
    "/help",
    "/login",
    "/register",
  ],
}
