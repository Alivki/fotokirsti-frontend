"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PublicCategoryFilter } from "@/components/PublicCategoryFilter"
import { PublicGallery } from "@/components/PublicGallery"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ImageIcon } from "lucide-react"
import { getGalleryPhotosPaginated } from "@/services/photos"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { FadeContent } from "@/components/ui/fade-content"

function capitalizeCategory(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const GALLERY_DESCRIPTIONS: Record<string, string> = {
  alle:
    "Se gjennom bildene mine. Bruk filteret under for å velge kategori eller se premierte bilder.",
  barn: "Bilde av barn – naturlige portretter og øyeblikk som varer.",
  familie: "Familiebilder – portretter og minner med de nærmeste.",
  portrett: "Portrettfotografering – fra headshots til kunstneriske portretter.",
  konfirmant: "Konfirmasjonsbilder – spesielle bilder fra store dag.",
  bryllup: "Bryllupsfotografering – dokumenterer den store dagen deres.",
  produkt: "Produktfotografering – profesjonelle bilder for varepresentasjon.",
  reklame: "Reklamer og kampanjer – visuelt innhold for markedføring.",
  premierte:
    "Premierte bilder – nominerte og prisbelønte fotografier fra NFF.",
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
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ["gallery", category, hasPrize, page, pageSize],
    queryFn: () => getGalleryPhotosPaginated({ category, hasPrize, page, pageSize }),
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

  const photos = data?.data ?? []
  const totalPages = data?.pages ?? 1
  const hasNext = data?.nextPage != null

  const filterKey = hasPrize ? "premierte" : (categoryParam || "alle")
  const description =
    GALLERY_DESCRIPTIONS[filterKey] ?? GALLERY_DESCRIPTIONS.alle

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <FadeContent>
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-extrabold lg:text-4xl xl:text-5xl">
              Galleri
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </FadeContent>
        <FadeContent duration={1000}>
          <div className="flex w-full flex-col gap-4">
            <PublicCategoryFilter />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-64 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </FadeContent>
      </div>
    )
  }

  if (!photos.length) {
    return (
      <div className="flex flex-col gap-8">
        <FadeContent>
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-extrabold lg:text-4xl xl:text-5xl">
              Galleri
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </FadeContent>
        <FadeContent duration={1000}>
          <div className="flex w-full flex-col gap-6">
            <PublicCategoryFilter />
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-secondary/50 py-16 px-6 text-center sm:py-24">
              <div className="mb-4 rounded-full bg-muted p-4">
                <ImageIcon className="size-12 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold sm:text-2xl">
                Ingen bilder i denne kategorien
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Det er ingen bilder å vise for dette valget. Prøv en annen kategori eller se alle bilder.
              </p>
            </div>
          </div>
        </FadeContent>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <FadeContent>
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl font-extrabold lg:text-4xl xl:text-5xl">
            Galleri
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </FadeContent>
      <FadeContent duration={1000}>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-4">
            <PublicCategoryFilter />
          <PublicGallery photos={photos} />
        </div>
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
      </FadeContent>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-24">
        <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <div className="h-9" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="skeleton h-64 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            }
          >
            <GalleryContent />
          </Suspense>
      </main>
      <Footer />
    </div>
  )
}
