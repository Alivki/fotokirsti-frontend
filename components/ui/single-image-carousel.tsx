"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface SingleImageCarouselProps {
  images: string[]
}

const AUTO_INTERVAL = 5000
const HOLD_DURATION = 400

export function SingleImageCarousel({ images }: SingleImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [pauseAuto, setPauseAuto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const step = containerRef.current.offsetWidth + 24
      containerRef.current.scrollTo({
        left: step * currentIndex,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  useEffect(() => {
    if (images.length <= 1) return

    let startTime = Date.now()
    let timer: ReturnType<typeof setInterval> | null = null

    const startTimer = () => {
      timer = setInterval(() => {
        if (!pauseAuto) {
          const elapsed = Date.now() - startTime
          const newProgress = Math.min((elapsed / AUTO_INTERVAL) * 100, 100)
          setProgress(newProgress)

          if (newProgress >= 100) {
            if (timer) clearInterval(timer)
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % images.length)
              setProgress(0)
              startTime = Date.now()
              startTimer()
            }, HOLD_DURATION)
          }
        }
      }, 50)
    }

    if (!pauseAuto) {
      startTimer()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [images.length, currentIndex, pauseAuto])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setProgress(0)
    setPauseAuto(true)
    setTimeout(() => setPauseAuto(false), 2000)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setProgress(0)
    setPauseAuto(true)
    setTimeout(() => setPauseAuto(false), 2000)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return
    const touchEnd = e.touches[0].clientX
    const diff = touchStart - touchEnd

    if (diff > 50) {
      next()
      setTouchStart(null)
    } else if (diff < -50) {
      prev()
      setTouchStart(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  return (
    <div className="relative w-full">
      <div className="flex items-start">
        {images.length > 1 && (
          <>
            <Button
              className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-md bg-white text-black hover:bg-gray-100"
              onClick={prev}
              size="icon-sm-square"
              variant="secondary"
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </Button>
            <Button
              className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-md bg-white text-black hover:bg-gray-100"
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
          className="flex flex-1 gap-6 overflow-hidden pb-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Image carousel"
        >
          {images.map((src, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <div className="relative aspect-video h-auto w-full">
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  className="rounded-md object-cover shadow"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        {images.length > 1 && (
          <div>
            <div className="h-3 w-32 rounded-full overflow-hidden bg-gray-300 md:w-52">
              <div
                className="h-full bg-black"
                style={{
                  width: `${progress}%`,
                  transition: "width 50ms linear",
                }}
              />
            </div>
          </div>
        )}

        {images.length > 1 && (
          <div className="flex flex-row justify-end gap-3">
            {Array.from({ length: images.length }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentIndex(i)
                  setProgress(0)
                  setPauseAuto(true)
                  setTimeout(() => setPauseAuto(false), 1500)
                }}
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

        <div className="hidden w-52 sm:block" />
      </div>
    </div>
  )
}
