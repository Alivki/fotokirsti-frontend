"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface MultiImageCarouselProps {
  images: string[]
}

const getItemsPerView = (width: number): number => {
  if (width < 768) return 1
  if (width < 1024) return 2
  return 3
}

export function MultiImageCarousel({ images }: MultiImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => setItemsPerView(getItemsPerView(window.innerWidth))
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    if (containerRef.current && itemsPerView > 1) {
      const step = containerRef.current.offsetWidth / itemsPerView
      containerRef.current.scrollTo({
        left: step * currentIndex,
        behavior: "smooth",
      })
    }
  }, [currentIndex, itemsPerView])

  const maxIndex = images.length - itemsPerView
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  const next = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1)
  }

  const prev = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1)
  }

  const getImageWidth = () => {
    switch (itemsPerView) {
      case 1:
        return "w-[85%] snap-center"
      case 2:
        return "w-[calc(50%-0.5rem)]"
      default:
        return "w-[calc(33.333%-0.67rem)]"
    }
  }

  return (
    <div className="relative w-full">
      {itemsPerView > 1 && (
        <>
          <Button
            className="absolute left-6 top-1/2 z-10 -translate-y-7 rounded-mg bg-white text-black hover:bg-gray-100"
            onClick={prev}
            size="icon-sm-square"
            variant="secondary"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </Button>
          <Button
            className="absolute right-6 top-1/2 z-10 -translate-y-7 rounded-mg bg-white text-black hover:bg-gray-100"
            onClick={next}
            size="icon-sm-square"
            variant="secondary"
            aria-label="Next slide"
          >
            <ChevronRight />
          </Button>
        </>
      )}

      <div
        ref={containerRef}
        className={`flex gap-x-4 px-4 pb-2 sm:px-2 ${
          itemsPerView === 1
            ? "snap-x snap-mandatory overflow-x-auto"
            : "overflow-hidden"
        }`}
        role="region"
        aria-label="Image carousel"
      >
        {images.map((src, i) => (
          <div key={i} className={`flex-shrink-0 ${getImageWidth()}`}>
            <div className="relative aspect-video h-auto w-full">
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                className="rounded-md object-cover shadow"
                sizes={
                  itemsPerView === 1
                    ? "85vw"
                    : itemsPerView === 2
                      ? "50vw"
                      : "33vw"
                }
              />
            </div>
          </div>
        ))}
      </div>

      {itemsPerView > 1 && images.length > itemsPerView && (
        <div
          className="mt-2 flex justify-center gap-3"
          role="tablist"
          aria-label="Carousel pagination"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-3 w-3 cursor-pointer rounded-full transition-colors ${
                currentIndex === i ? "bg-black" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              role="tab"
              aria-selected={currentIndex === i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
