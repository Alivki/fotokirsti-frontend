import Link from "next/link"
import { type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface StyledLinkProps {
  href: string
  children: ReactNode
  query?: Record<string, string>
  style?: CSSProperties
  className?: string
  target?: "_blank" | "_self"
}

export function StyledLink({
  href,
  children,
  style,
  className,
  query,
  target,
}: StyledLinkProps) {
  const url = query && Object.keys(query).length > 0
    ? `${href}?${new URLSearchParams(query).toString()}`
    : href

  return (
    <Link
      style={style}
      target={target}
      className={cn(
        "hover:underline hover:underline-offset-4 focus:underline focus:underline-offset-4",
        className
      )}
      href={url}
    >
      {children}
    </Link>
  )
}
