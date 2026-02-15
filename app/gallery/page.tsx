"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { CategoryFilter } from "@/components/CategoryFilter"
import { Skeleton } from "@/components/ui/skeleton"
import { getGalleryPhotos } from "@/services/photos"

function GalleryContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") ?? undefined
  const { data: photos, isLoading } = useQuery({
    queryKey: ["gallery", category],
    queryFn: () => getGalleryPhotos(category),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <CategoryFilter />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <CategoryFilter />
        <p className="text-muted-foreground">Ingen bilder</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <CategoryFilter />
      <div className="grid grid-cols-3 gap-4">
        {photos.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg border">
            <Image
              src={p.imageUrl}
              alt={p.alt ?? p.title ?? "Bilde"}
              width={400}
              height={256}
              className="h-64 w-full object-cover"
              sizes="(max-width: 768px) 33vw, 400px"
            />
            <p className="p-2">{p.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <div className="h-9" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  )
}