"use client"

import { useEffect } from "react"
import { useAuth } from "@/services/auth"

function isNetworkError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const e = err as { code?: string; message?: string; cause?: unknown }
  const code = e.code ?? (e.cause && typeof e.cause === "object" && "code" in e.cause ? (e.cause as { code?: string }).code : undefined)
  const msg = String(e.message ?? "")
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ERR_NETWORK" ||
    /network error|socket hang up|connection reset/i.test(msg)
  )
}

/**
 * The proxy middleware already gates /admin/* by checking the `logged_in`
 * hint cookie before any React renders. Reaching this component means the
 * user is optimistically authenticated, so we render children immediately.
 *
 * The real session check still runs in the background via useAuth (React
 * Query), and if the backend returns 401 the axios interceptor in
 * services/axios.ts redirects to "/". The only thing AdminGuard handles
 * is the network-error fallback so admin users see a clear "server is
 * unreachable" message instead of a broken page.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { error } = useAuth()
  const networkError = error != null && isNetworkError(error)
  const authError = error != null && !networkError

  useEffect(() => {
    if (authError) {
      document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax"
      window.location.href = "/"
    }
  }, [authError])

  if (authError) return null

  if (networkError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          Kunne ikke kontakte serveren
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Sjekk internettilkoblingen din og prøv å laste siden på nytt.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-primary hover:underline"
        >
          Last inn på nytt
        </button>
      </div>
    )
  }

  return <>{children}</>
}
