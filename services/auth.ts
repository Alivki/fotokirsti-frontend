"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { api } from "./axios"
import { getErrorMessage } from "@/lib/utils"

interface User {
  id: string
  username: string
  [key: string]: unknown
}

interface Session {
  user: User
}

const AUTH_TIMEOUT_MS = 8_000

/**
 * Non-httpOnly hint cookie set by the backend on sign-in. Used for an
 * optimistic authenticated state so we don't show a loading spinner on
 * every client-side navigation into /admin. The real session check still
 * runs in the background via React Query.
 */
function hasLoginCookie(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("logged_in=1"))
}

async function fetchSession(): Promise<Session> {
  const { data } = await api.get("/auth/get-session", {
    timeout: AUTH_TIMEOUT_MS,
  })
  // Better Auth returns 200 with a null body when the session is invalid
  // or revoked. Turn that into an error so useAuth flips to isError and
  // the hint-cookie optimism below no longer applies.
  if (!data?.user) {
    if (typeof document !== "undefined") {
      document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax"
    }
    throw new Error("no-session")
  }
  return data
}

export function useAuth() {
  const query = useQuery({
    queryKey: ["auth", "session"],
    queryFn: fetchSession,
    retry: false,
    staleTime: 2 * 60 * 1000,
  })

  // Optimistic: if the hint cookie is present and we haven't received a
  // definitive "not authenticated" error, treat the user as authenticated.
  // This lets pages render instantly on navigation — the background session
  // fetch still confirms (or the axios 401 interceptor redirects on failure).
  // Deferred until after mount so SSR and first client render agree.
  const [optimisticallyLoggedIn, setOptimisticallyLoggedIn] = useState(false)
  useEffect(() => {
    setOptimisticallyLoggedIn(hasLoginCookie())
  }, [])
  const isAuthenticated =
    !!query.data?.user || (optimisticallyLoggedIn && !query.isError)

  return {
    user: query.data?.user ?? null,
    session: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated,
    error: query.error,
  }
}

export function useLogin(redirectTo?: string) {
  return async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data: signInData } = await api.post("auth/sign-in/username", {
        username,
        password,
      })

      if (!signInData?.user) {
        return {
          error:
            "Innlogging fullført, men sesjon ble ikke opprettet. Sjekk tredjeparts cookies i nettleseren.",
        }
      }

      // Full page navigation so the Edge middleware sees the freshly-set
      // `logged_in` hint cookie. router.push would kick off an RSC fetch
      // that can race the Set-Cookie from the proxied sign-in response and
      // get bounced back to /login by the middleware.
      const target = redirectTo?.startsWith("/") ? redirectTo : "/admin"
      window.location.href = target
      return {}
    } catch (error: unknown) {
      return { error: getErrorMessage(error) || "Feil passord eller brukernavn." }
    }
  }
}

export function useLogout() {
  const queryClient = useQueryClient()

  return async () => {
    // Clear the hint cookie immediately so UI state updates without waiting
    // for the server response. The backend also clears it via Set-Cookie.
    if (typeof document !== "undefined") {
      document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax"
    }
    try {
      await api.post("/auth/sign-out")
    } catch {
      // ignore
    }
    queryClient.removeQueries({ queryKey: ["auth", "session"] })
    window.location.href = "/"
  }
}
