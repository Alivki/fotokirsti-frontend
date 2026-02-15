"use client"

import Link from "next/link"
import { UserIcon } from "lucide-react"
import { useAuth, useLogout } from "@/services/auth"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  const { user, isLoading } = useAuth()
  const logout = useLogout()

  return (
    <header className="top-0 z-50 w-full border-b border-border bg-white backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          fotokirsti
        </Link>
        <nav className="flex items-center gap-6">
          {!isLoading && user && (
            <>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="size-4" aria-hidden />
                <span>
                  Konto: <span className="text-foreground">{user.username}</span>
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
