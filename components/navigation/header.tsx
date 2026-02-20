"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

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
          <Link
            href="/gallery"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/gallery" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Galleri
          </Link>
        </nav>
      </div>
    </header>
  )
}