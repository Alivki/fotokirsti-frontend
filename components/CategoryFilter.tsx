"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const ADMIN_CATEGORIES = [
  "Alle",
  "Barn",
  "Familie",
  "Portrett",
  "Konfirmant",
  "Bryllup",
  "Produkt",
  "Reklame",
] as const

const PUBLIC_CATEGORIES = [
  "Alle",
  "Barn",
  "Familie",
  "Portrett",
  "Konfirmant",
  "Bryllup",
  "Produkt",
  "Reklame",
  "Premierte",
] as const

interface CategoryFilterProps {
  variant?: "admin" | "public"
  tagList?: readonly string[]
  label?: string
  className?: string
}

export function CategoryFilter({
  variant = "admin",
  tagList,
  label = "Kategori",
  className,
}: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const hasPrize = searchParams.get("hasPrize") === "true"

  const tags = tagList ?? (variant === "public" ? PUBLIC_CATEGORIES : ADMIN_CATEGORIES)

  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("page") // reset to page 1 when changing filter
    if (tag === "alle") {
      params.delete("category")
      params.delete("hasPrize")
    } else if (tag === "premierte") {
      params.set("hasPrize", "true")
      params.delete("category")
    } else {
      params.set("category", tag)
      params.delete("hasPrize")
    }
    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname
    router.replace(url, { scroll: false })
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const value = tag.toLowerCase()
          const isActive =
            value === "alle"
              ? !categoryParam && !hasPrize
              : value === "premierte"
                ? hasPrize
                : categoryParam === value
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleTag(value)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all border",
                isActive
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-border bg-secondary text-foreground hover:bg-muted-foreground/15"
              )}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
