"use client"

import Image from "next/image"
import Link from "next/link"

import { FadeContent } from "@/components/ui/fade-content"
import { StyledLink } from "@/components/ui/styled-link"
import { MobileNavSheet } from "@/components/navigation/mobile-nav-sheet"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-secondary px-4 sm:px-8">
      <Link href="/">
        <FadeContent duration={1000}>
          <Image
            src="/assets/logo-fotokirsti.png"
            alt="Logo for Fotograf Kirsti Hovde"
            width={80}
            height={80}
          />
        </FadeContent>
      </Link>

      <nav className="hidden flex-row justify-center space-x-6 lg:flex">
        <FadeContent duration={800}>
          <StyledLink href="/">Hovedside</StyledLink>
          <StyledLink href="/about">Om meg</StyledLink>
          <StyledLink href="/gallery">Galleri</StyledLink>
          <StyledLink href="/pricelist">Prisliste</StyledLink>
        </FadeContent>
      </nav>

      <div className="flex lg:hidden">
        <MobileNavSheet />
      </div>
    </header>
  )
}
