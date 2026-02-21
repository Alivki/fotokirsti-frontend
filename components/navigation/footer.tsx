import Image from "next/image"
import Link from "next/link"

import { FaInstagram } from "react-icons/fa"
import { FiYoutube, FiTwitter } from "react-icons/fi"
import { Bug } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StyledLink } from "@/components/ui/styled-link"

export function Footer() {
  return (
    <div className="flex h-auto justify-center border-t border-border bg-secondary py-16 xl:py-24">
      <div className="container mx-auto flex h-full max-w-5xl flex-col justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-14 md:flex-row md:justify-between md:px-4 lg:px-2">
          <Link href="/">
            <Image
              src="/assets/logo-fotokirsti.png"
              alt="Logo for Fotograf Kirsti Hovde"
              width={80}
              height={80}
            />
          </Link>

          <nav className="flex flex-col gap-2 text-center md:flex-row md:flex-wrap md:justify-center md:gap-4">
            <StyledLink href="/">Hjem</StyledLink>
            <StyledLink href="/about">Om meg</StyledLink>
            <StyledLink href="/gallery">Galleri</StyledLink>
            <StyledLink href="/pricelist">Prisliste</StyledLink>
            <StyledLink href="/login">Logg inn</StyledLink>
            <StyledLink href="/admin">Admin</StyledLink>
          </nav>
        </div>

        <div className="flex w-full flex-col gap-1 px-4 pt-10 text-center lg:px-2 md:text-left">
          <p className="flex flex-row items-center justify-center md:justify-start">
            © 2025 Fotograf Kirsti Hovde.
          </p>
          <p className="flex flex-row justify-center text-sm text-muted-foreground md:justify-start">
            Alle rettigheter forbeholdt.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-10 px-4 md:flex-row md:justify-between lg:mb-4 lg:px-2">
          <div className="flex w-full flex-row items-center justify-center gap-4 md:justify-start">
            <Link
              target="_blank"
              href="https://google.com"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter"
            >
              <FiTwitter size={34} />
            </Link>
            <Link
              target="_blank"
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="YouTube"
            >
              <FiYoutube size={34} />
            </Link>
            <Link
              target="_blank"
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Instagram"
            >
              <FaInstagram size={34} />
            </Link>
          </div>

          <Button
            className="gap-2 rounded-none"
            variant="primary"
            size="sm"
            asChild
          >
            <Link href="https://github.com/iver" className="flex h-10 items-center gap-2 px-7">
              <Bug className="size-4" />
              Created by Iver Lindholm
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
