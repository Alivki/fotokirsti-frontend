"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HamburgerButton } from "@/components/ui/hamburger-button"
import { StyledLink } from "@/components/ui/styled-link"

export function MobileNavSheet() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <HamburgerButton
          open={false}
          className="lg:hidden"
          aria-label="Åpne meny"
        />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full max-w-sm flex-col border-l bg-background p-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:max-w-xs"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <SheetTitle className="text-lg font-semibold">Meny</SheetTitle>
          <SheetClose asChild>
            <HamburgerButton open aria-label="Lukk meny" />
          </SheetClose>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <div className="flex flex-col gap-1 rounded-lg bg-secondary p-4">
            <StyledLink
              href="/"
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                pathname === "/" ? "bg-accent" : ""
              }`}
            >
              Hovedside
            </StyledLink>
            <StyledLink
              href="/about"
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                pathname === "/about" ? "bg-accent" : ""
              }`}
            >
              Om meg
            </StyledLink>
            <StyledLink
              href="/gallery"
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                pathname === "/gallery" ? "bg-accent" : ""
              }`}
            >
              Galleri
            </StyledLink>
            <StyledLink
              href="/pricelist"
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                pathname === "/pricelist" ? "bg-accent" : ""
              }`}
            >
              Prisliste
            </StyledLink>
          </div>

          <div className="mt-6 flex flex-col gap-1 rounded-lg bg-secondary p-4">
            <p className="mb-2 px-3 text-sm font-semibold text-muted-foreground">
              Se bilder etter kategori
            </p>
            <StyledLink
              href="/gallery"
              query={{ hasPrize: "true" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Premierte bilder
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "barn" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Barn
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "familie" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Familie
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "portrett" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Portrett
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "konfirmant" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Konfirmant
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "bryllup" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Bryllup
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "produkt" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Produkt
            </StyledLink>
            <StyledLink
              href="/gallery"
              query={{ category: "reklame" }}
              className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Reklame
            </StyledLink>
          </div>

        </nav>
      </SheetContent>
    </Sheet>
  )
}
