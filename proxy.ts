import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const cookie = request.headers.get("cookie") ?? ""
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8_000)
    const res = await fetch(`${apiUrl}/auth/get-session`, {
      headers: { Cookie: cookie },
      cache: "no-store",
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const data = await res.json().catch(() => ({}))
    // Only redirect when we got a successful response with no user (same-origin cookie was sent)
    if (res.ok && !data?.user) {
      const login = new URL("/login", request.url)
      login.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(login)
    }
    // 401 or network error: cookie may not be sent (e.g. cross-origin). Let client guard handle it.
  } catch {
    // Network error: let client-side guard handle auth
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
