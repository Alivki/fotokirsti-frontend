"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface GalleryPaginationProps {
  page: number
  totalPages: number
  hasNext: boolean
}

export function GalleryPagination({ page, totalPages, hasNext }: GalleryPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goToPage = (target: number) => {
    const params = new URLSearchParams(searchParams)
    if (target <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(target))
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: true })
  }

  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) goToPage(page - 1)
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            aria-disabled={page <= 1}
          />
        </PaginationItem>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 7) pageNum = i + 1
          else if (page <= 4) pageNum = i + 1
          else if (page >= totalPages - 3) pageNum = totalPages - 6 + i
          else pageNum = page - 3 + i
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  goToPage(pageNum)
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
              if (hasNext) goToPage(page + 1)
            }}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
            aria-disabled={!hasNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
