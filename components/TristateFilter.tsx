"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

type TristateValue = "all" | "true" | "false"

interface TristateFilterProps {
  param: string
  label: string
  trueLabel?: string
  falseLabel?: string
  allLabel?: string
  className?: string
}

export function TristateFilter({
  param,
  label,
  trueLabel = "Ja",
  falseLabel = "Nei",
  allLabel = "Alle",
  className,
}: TristateFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = (searchParams.get(param) ?? "all") as TristateValue

  const handleSelect = (value: TristateValue) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete(param)
    } else {
      params.set(param, value)
    }
    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname
    router.replace(url, { scroll: false })
  }

  const options: { value: TristateValue; label: string }[] = [
    { value: "all", label: allLabel },
    { value: "true", label: trueLabel },
    { value: "false", label: falseLabel },
  ]

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex gap-2">
        {options.map(({ value, label: optLabel }) => {
          const isActive = active === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all border shrink-0",
                isActive
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-border bg-secondary text-foreground hover:bg-muted-foreground/15"
              )}
            >
              {optLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
