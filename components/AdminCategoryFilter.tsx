"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "Alle",
  "Barn",
  "Familie",
  "Portrett",
  "Konfirmant",
  "Bryllup",
  "Produkt",
  "Reklame",
] as const

interface AdminCategoryFilterProps {
  label?: string
  className?: string
}

export function AdminCategoryFilter({
  label = "Kategori",
  className,
}: AdminCategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") ?? "alle"

  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("page")
    if (tag === "alle") {
      params.delete("category")
    } else {
      params.set("category", tag)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((tag) => {
          const value = tag.toLowerCase()
          const isActive = activeCategory === value
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleTag(value)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all",
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
