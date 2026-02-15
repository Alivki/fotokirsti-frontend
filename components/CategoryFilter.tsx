"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const DEFAULT_CATEGORIES = [
  "Alle",
  "Barn",
  "Familie",
  "Portrett",
  "Konfirmant",
  "Bryllup",
  "Produkt",
  "Reklame",
] as const

interface CategoryFilterProps {
  tagList?: readonly string[]
  label?: string
  className?: string
}

export function CategoryFilter({ tagList = DEFAULT_CATEGORIES, label = "Kategori", className }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get("category") ?? "alle"

  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams)
    if (tag === "alle") {
      params.delete("category")
    } else {
      params.set("category", tag)
    }
    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname
    router.replace(url, { scroll: false })
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
      {tagList.map((tag) => {
        const value = tag.toLowerCase()
        const isActive = activeTag === value
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
