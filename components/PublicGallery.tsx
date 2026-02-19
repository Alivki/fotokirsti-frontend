"use client"

import Image from "next/image"
import type { PhotoWithUrl } from "@/services/photos"

interface PublicGalleryProps {
  photos: PhotoWithUrl[]
}

function getAspectRatio(photo: PhotoWithUrl): number {
  if (photo.aspectRatio != null && photo.aspectRatio > 0) {
    return photo.aspectRatio
  }
  if (photo.width != null && photo.height != null && photo.height > 0) {
    return photo.width / photo.height
  }
  return 4 / 3
}

function getWidthHeight(photo: PhotoWithUrl): { width: number; height: number } {
  if (photo.width != null && photo.height != null && photo.width > 0 && photo.height > 0) {
    return { width: photo.width, height: photo.height }
  }
  const ratio = getAspectRatio(photo)
  return { width: 800, height: Math.round(800 / ratio) }
}

export function PublicGallery({ photos }: PublicGalleryProps) {
  const validPhotos = photos.filter((p) => p.imageUrl)
  if (!validPhotos.length) return null

  return (
    <div className="columns-1 gap-4 md:columns-2 lg:columns-3 [&>div]:mb-4">
      {validPhotos.map((p) => {
        const aspectRatio = getAspectRatio(p)
        const { width, height } = getWidthHeight(p)

        return (
          <div
            key={p.id}
            className="break-inside-avoid"
          >
            <div
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio }}
            >
              <Image
                src={p.imageUrl}
                alt={p.alt ?? p.title ?? ""}
                width={width}
                height={height}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
