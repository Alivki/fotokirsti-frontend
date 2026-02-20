"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PublicCategoryFilter } from "@/components/PublicCategoryFilter"
import { PublicGallery } from "@/components/PublicGallery"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getGalleryPhotosPaginated } from "@/services/photos"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

function capitalizeCategory(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function GalleryContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const category = categoryParam && categoryParam !== "alle"
    ? capitalizeCategory(categoryParam)
    : undefined
  const hasPrize = searchParams.get("hasPrize") === "true"
  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: ["gallery", category, hasPrize, page, limit],
    queryFn: () => getGalleryPhotosPaginated({ category, hasPrize, page, limit }),
  })

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    if (newPage <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(newPage))
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: true })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PublicCategoryFilter />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const photos = data?.data ?? []
  const metadata = data?.metadata
  const totalPages = metadata?.totalPages ?? 1
  const hasNext = metadata?.hasNext ?? false

  if (!photos.length) {
    return (
      <div className="flex flex-col gap-4">
        <PublicCategoryFilter />
        <p className="text-muted-foreground">Ingen bilder</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PublicCategoryFilter />
      <PublicGallery photos={photos} />
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage(page - 1)
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                aria-disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (page <= 4) {
                pageNum = i + 1
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(pageNum)
                    }}
                    isActive={page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (hasNext) setPage(page + 1)
                }}
                className={!hasNext ? "pointer-events-none opacity-50" : ""}
                aria-disabled={!hasNext}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <div className="h-9" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            }
          >
            <GalleryContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
