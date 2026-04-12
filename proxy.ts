import { NextResponse, type NextRequest } from "next/server"

/**
 * Route protection using the `logged_in` hint cookie set by the backend
 * on successful sign-in. This runs on the Edge before any React rendering,
 * so unauthenticated users never see a flash of admin content.
 *
 * The hint cookie is a boolean flag only — it carries no secret. The real
 * session token (httpOnly) is still validated by the backend on every
 * API request. If a user has only the hint cookie but no valid session,
 * the API will return 401 and the axios interceptor will redirect.
 */
export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get("logged_in")?.value === "1"
  const { pathname, search } = request.nextUrl

  if (pathname.startsWith("/admin") && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
