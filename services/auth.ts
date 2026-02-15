"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { api } from "./axios"

interface User {
  id: string
  username: string
  [key: string]: unknown
}

interface Session {
  user: User
}

const AUTH_TIMEOUT_MS = 8_000

async function fetchSession(): Promise<Session> {
  const { data } = await api.get("/auth/get-session", {
    timeout: AUTH_TIMEOUT_MS,
  })
  return data
}

export function useAuth() {
  const query = useQuery({
    queryKey: ["auth", "session"],
    queryFn: fetchSession,
    retry: false,
    staleTime: 2 * 60 * 1000,
  })

  return {
    user: query.data?.user ?? null,
    session: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data?.user,
    error: query.error,
  }
}

export function useLogin(redirectTo?: string) {
  const router = useRouter()
  const queryClient = useQueryClient()

  return async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      await api.post("auth/sign-in/username", { username, password })
      // Refetch session so cache is populated before we navigate (avoids AdminGuard redirecting back to login)
      await queryClient.refetchQueries({ queryKey: ["auth", "session"] })
      const target = redirectTo?.startsWith("/") ? redirectTo : "/admin"
      router.push(target)
      return {}
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      const message =
        err?.response?.data?.message || "Feil passord eller brukernavn."
      return { error: message }
    }
  }
}

export function useLogout() {
  const queryClient = useQueryClient()

  return async () => {
    try {
      await api.post("/auth/sign-out")
    } catch {
      // ignore
    }
    queryClient.removeQueries({ queryKey: ["auth", "session"] })
    window.location.href = "/"
  }
}