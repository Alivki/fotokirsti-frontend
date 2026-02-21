"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trophy } from "lucide-react"
import type { CSSProperties } from "react"

import useHistory, { type HistoryEntry } from "@/hooks/useHistory"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface HistoryDaisyProps {
  style?: CSSProperties
}

const GOLD = "#DBB622"

function CardContentMobile({
  item,
  router,
}: {
  item: HistoryEntry
  router: { push: (url: string) => void }
}) {
  return (
    <>
      <h2 className="text-base font-bold">
        {item.title} <span className="font-normal">- {item.date}</span>
      </h2>
      {(item.hasImage || item.hasDescription || item.hasTrophy) && (
        <div className="flex flex-col gap-4 sm:gap-4">
          {item.hasImage && item.url && (
            <div className="relative mt-1 aspect-video w-full">
              <Image
                src={item.url}
                alt={item.imageAlt || item.title}
                fill
                quality={50}
                className="rounded-md object-cover"
              />
            </div>
          )}
          {item.hasDescription && <p>{item.description}</p>}
          {item.hasTrophy && (
            <>
              <div className="-mb-2 flex flex-row self-center">
                <div
                  className="mt-1 h-[6px] w-[10px] rotate-45 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                <div
                  className="ml-1 h-[6px] w-[10px] rotate-90 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                <div
                  className="ml-1 mt-1 h-[6px] w-[10px] -rotate-[35deg] rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
              </div>
              <Trophy className="self-center" color={GOLD} size={64} />
            </>
          )}
        </div>
      )}
      {item.hasButton && item.button.description && (
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(item.button.link)}
          >
            {item.button.description}
          </Button>
        </div>
      )}
    </>
  )
}

function CardContentDesktop({
  item,
  router,
}: {
  item: HistoryEntry
  router: { push: (url: string) => void }
}) {
  return (
    <div className="flex w-full flex-row gap-4">
      <div className="relative flex flex-1 flex-col gap-4">
        <h2 className="text-base font-bold">
          {item.title} <span className="font-normal">- {item.date}</span>
        </h2>
        {item.hasDescription && <p>{item.description}</p>}
        {item.hasButton && item.button.description && (
          <div>
            <Button
              className="w-56 px-4"
              variant="primary"
              onClick={() => router.push(item.button.link)}
              size="sm"
            >
              {item.button.description}
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end">
        {item.hasImage && item.url && (
          <div className="relative aspect-video w-[350px] flex-shrink-0 overflow-hidden rounded-md lg:w-[450px] xl:w-[560px]">
            <Image
              src={item.url}
              alt={item.imageAlt || item.title}
              fill
              quality={50}
              className="rounded-md object-cover"
            />
          </div>
        )}
        {item.hasTrophy && (
          <div className="flex flex-col items-center justify-between pr-5">
            <div className="mb-2 flex flex-row">
              <div
                className="mt-1 h-[6px] w-[10px] rotate-45 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              <div
                className="ml-1 h-[6px] w-[10px] rotate-90 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              <div
                className="ml-1 mt-1 h-[6px] w-[10px] -rotate-[35deg] rounded-full"
                style={{ backgroundColor: GOLD }}
              />
            </div>
            <Trophy color={GOLD} size={64} />
          </div>
        )}
      </div>
    </div>
  )
}

export function HistoryDaisy({ style }: HistoryDaisyProps) {
  const { history, isLoading } = useHistory()
  const router = useRouter()
  const containerRef = useRef<HTMLUListElement>(null)
  const [lineStyle, setLineStyle] = useState<{ top: number; bottom: number } | null>(null)

  useEffect(() => {
    if (isLoading || !history.length) return
    const container = containerRef.current
    if (!container) return

    const updateLine = () => {
      const middles = container.querySelectorAll(".timeline-middle")
      if (middles.length === 0) return
      const first = middles[0] as HTMLElement
      const last = middles[middles.length - 1] as HTMLElement
      const containerRect = container.getBoundingClientRect()
      const firstRect = first.getBoundingClientRect()
      const lastRect = last.getBoundingClientRect()
      const firstCenter = firstRect.top - containerRect.top + firstRect.height / 2
      const lastCenter = lastRect.top - containerRect.top + lastRect.height / 2
      setLineStyle({ top: firstCenter, bottom: containerRect.height - lastCenter })
    }

    updateLine()
    const observer = new ResizeObserver(updateLine)
    observer.observe(container)
    return () => observer.disconnect()
  }, [isLoading, history.length])

  if (isLoading) {
    return (
      <ul
        className="history-timeline timeline timeline-vertical w-full max-w-full"
        style={style}
      >
        {[1, 2, 3, 4].map((i) => (
          <li key={i}>
            <hr />
            <div className="timeline-start" />
            <div className="timeline-middle">
              <div className="skeleton size-5 rounded-full" />
            </div>
            <div className="timeline-end timeline-box">
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <hr />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="relative w-full">
      <ul
        ref={containerRef}
        className="history-timeline timeline timeline-vertical w-full max-w-full px-0"
        style={style}
      >
        {history.map((item, index) => (
        <li key={index} className="w-full">
          {index > 0 && <hr />}
          <div className="timeline-start" />
          <div className="timeline-middle flex shrink-0 items-center justify-center">
            {item.hasTrophy ? (
              <Trophy size={20} color={GOLD} className="bg-background"/>
            ) : (
              <div className="size-3 rounded-full bg-black" />
            )}
          </div>
          <div className="timeline-end min-w-0 flex-1">
            <div className="rounded-md bg-secondary p-5 shadow md:p-6 xl:p-8">
              <div className="flex flex-col gap-4 text-sm md:hidden sm:gap-2">
                <CardContentMobile item={item} router={router} />
              </div>
              <div className="hidden md:block">
                <CardContentDesktop item={item} router={router} />
              </div>
            </div>
          </div>
          {index < history.length - 1 && <hr />}
        </li>
      ))}
      </ul>
      {lineStyle && (
        <div
          className="history-timeline-line"
          style={{
            top: lineStyle.top,
            bottom: lineStyle.bottom,
          }}
          aria-hidden
        />
      )}
    </div>
  )
}
