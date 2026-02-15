"use client"

import { useSearchParams } from "next/navigation"
import { CategoryFilter } from "@/components/CategoryFilter"
import { TristateFilter } from "@/components/TristateFilter"
import type { AdminPhotosFilters } from "@/services/photos"

/**
 * Hook to read admin photo filters from URL search params.
 * Used by AdminPhotosClient / PhotosGrid for fetching.
 */
export function useAdminPhotoFilters(): AdminPhotosFilters {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const publishedParam = searchParams.get("published")
  const hasPrizeParam = searchParams.get("hasPrize")

  const filters: AdminPhotosFilters = {}
  if (category && category !== "alle") filters.category = category
  if (publishedParam === "true") filters.published = true
  if (publishedParam === "false") filters.published = false
  if (hasPrizeParam === "true") filters.hasPrize = true
  if (hasPrizeParam === "false") filters.hasPrize = false

  return filters
}

export function AdminFilter() {
  return (
    <div className="flex flex-col gap-4">
      <CategoryFilter />
      <div className="flex flex-wrap gap-6">
        <TristateFilter
          param="hasPrize"
          label="Har pris"
          trueLabel="Ja"
          falseLabel="Nei"
          allLabel="Alle"
        />
        <TristateFilter
          param="published"
          label="Publisert"
          trueLabel="Ja"
          falseLabel="Nei"
          allLabel="Alle"
        />
      </div>
    </div>
  )
}
