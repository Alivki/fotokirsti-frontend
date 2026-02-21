"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface HamburgerButtonProps
  extends Omit<React.ComponentProps<"button">, "aria-label" | "aria-expanded"> {
  open: boolean
  onToggle?: () => void
  "aria-label"?: string
}

export const HamburgerButton = React.forwardRef<
  HTMLButtonElement,
  HamburgerButtonProps
>(function HamburgerButton(
  {
    open,
    onToggle,
    className,
    "aria-label": ariaLabel = open ? "Lukk meny" : "Åpne meny",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-expanded={open}
      className={cn(
        "relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300",
          open && "translate-y-2 rotate-45"
        )}
      />
      <span
        className={cn(
          "h-0.5 w-5 rounded-full bg-current transition-all duration-300",
          open && "opacity-0 scale-x-0"
        )}
      />
      <span
        className={cn(
          "h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300",
          open && "-translate-y-2 -rotate-45"
        )}
      />
    </button>
  )
})
