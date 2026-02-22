"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { PhotoWithUrl } from "@/services/photos"
import { Button } from "@/components/ui/button"

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
  const validPhotos = photos.filter((p) => (p.previewUrl ?? p.imageUrl) != null)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setCurrentIndex((prev) =>
      prev !== null ? (prev + 1) % validPhotos.length : 0
    )
  }, [validPhotos.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev !== null ? (prev - 1 + validPhotos.length) % validPhotos.length : 0
    )
  }, [validPhotos.length])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return
    const diff = touchStart - e.touches[0].clientX
    if (diff > 50) {
      next()
      setTouchStart(null)
    } else if (diff < -50) {
      prev()
      setTouchStart(null)
    }
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const preventScroll = (event: TouchEvent) => event.preventDefault()
    el.addEventListener("touchmove", preventScroll, { passive: false })
    return () => el.removeEventListener("touchmove", preventScroll)
  }, [currentIndex])

  if (!validPhotos.length) return null

  const currentPhoto = currentIndex !== null ? validPhotos[currentIndex] : null

  return (
    <>
      <div className="select-none columns-1 gap-4 md:columns-2 lg:columns-3 [&>div]:mb-4 [&_img]:pointer-events-none">
        {validPhotos.map((p, index) => {
          const aspectRatio = getAspectRatio(p)
          const { width, height } = getWidthHeight(p)

          return (
            <div key={p.id} className="break-inside-avoid">
              <div
                className="relative w-full cursor-pointer select-none overflow-hidden rounded-lg"
                style={{ aspectRatio }}
                onClick={() => setCurrentIndex(index)}
                onContextMenu={(e) => e.preventDefault()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setCurrentIndex(index)
                }}
              >
                <Image
                  src={p.previewUrl ?? p.imageUrl!}
                  alt={p.alt ?? p.title ?? ""}
                  width={width}
                  height={height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full select-none object-cover"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          )
        })}
      </div>

      {currentIndex !== null && currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center bg-black/90 p-4"
          onClick={() => setCurrentIndex(null)}
        >
          {/* Close - top right of screen */}
          <Button
            variant="secondary"
            size="icon-sm"
            className="absolute right-4 top-4 z-50 rounded-md bg-white text-black hover:bg-white/90"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(null)
            }}
            aria-label="Lukk"
          >
            <X />
          </Button>

          {/* Desktop: prev - far left of screen */}
          <Button
            variant="secondary"
            size="icon-sm"
            className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-md bg-white text-black hover:bg-white/90 sm:flex"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Forrige"
          >
            <ChevronLeft />
          </Button>

          <div
            className="relative flex flex-shrink-0 flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setTouchStart(null)}
            ref={containerRef}
          >
            {/* Image + counter */}
            <div className="order-2 flex w-full max-w-full flex-col items-center pb-6">
              <div
                className="relative flex max-h-[85dvh] w-full max-w-[90vw] select-none items-center justify-center sm:max-h-[90vh] sm:max-w-[70vw]"
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* Raw img: Next.js Image doesn't support custom srcSet with distinct URLs (medium vs large); we need to serve our CloudFront variants directly. */}
                <img
                  src={currentPhoto.largeUrl ?? currentPhoto.mediumUrl ?? currentPhoto.previewUrl ?? currentPhoto.imageUrl!}
                  srcSet={
                    currentPhoto.mediumUrl && currentPhoto.largeUrl
                      ? `${currentPhoto.mediumUrl} 768w, ${currentPhoto.largeUrl} 1200w`
                      : undefined
                  }
                  sizes={currentPhoto.mediumUrl && currentPhoto.largeUrl ? "(max-width: 768px) 100vw, 70vw" : undefined}
                  alt={currentPhoto.alt ?? currentPhoto.title ?? ""}
                  className="max-h-[85dvh] w-full max-w-[90vw] select-none rounded-md object-contain sm:max-h-[90vh] sm:max-w-[70vw]"
                  style={{ userSelect: "none", pointerEvents: "none" }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              {/* Desktop: counter right under image */}
              <p className="hidden pt-2 text-sm text-white sm:block">
                {currentIndex + 1} / {validPhotos.length}
              </p>
              {/* Mobile: prev, counter, next row - arrows right under image */}
              <div className="flex w-full max-w-[90vw] items-center justify-between pt-2 sm:hidden">
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="shrink-0 rounded-md bg-white text-black hover:bg-white/90"
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  aria-label="Forrige"
                >
                  <ChevronLeft />
                </Button>
                <p className="text-sm text-white">
                  {currentIndex + 1} / {validPhotos.length}
                </p>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="shrink-0 rounded-md bg-white text-black hover:bg-white/90"
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  aria-label="Neste"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop: next - far right of screen */}
          <Button
            variant="secondary"
            size="icon-sm"
            className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-md bg-white text-black hover:bg-white/90 sm:flex"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Neste"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </>
  )
}
