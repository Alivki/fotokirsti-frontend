import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * We DO NOT fetch the session here.
 * In a cross-domain setup (frontend.up.railway.app vs backend.up.railway.app),
 * the Next.js server cannot see the backend cookies.
 */
export function proxy(request: NextRequest) {
  // Just let the request through to the page.
  // The client-side AdminGuard will handle the logic because
  // the browser is the only one that actually has the session cookies.
  return NextResponse.next()
}

// Only run this proxy for admin routes to keep the rest of the site fast
export const config = {
  matcher: ["/admin/:path*"],
}