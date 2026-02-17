"use client"

import { Loader2 } from "lucide-react"
import { useAuth } from "@/services/auth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

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

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, error } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const networkError = error != null && isNetworkError(error)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && !networkError) {
      const login = new URL("/login", window.location.origin)
      login.searchParams.set("from", pathname)
      router.replace(login.pathname + login.search)
    }
  }, [isAuthenticated, isLoading, networkError, router, pathname])

  if (isLoading) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-3 py-12"
        aria-busy="true"
        aria-label="Laster"
      >
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Sjekker tilgang...</p>
      </div>
    )
  }

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

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
