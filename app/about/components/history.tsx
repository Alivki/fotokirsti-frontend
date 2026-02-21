"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trophy } from "lucide-react"
import type { CSSProperties } from "react"

import useHistory from "@/hooks/useHistory"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface HistoryProps {
  style?: CSSProperties
}

const GOLD = "#DBB622"

export function History({ style }: HistoryProps) {
  const { history, isLoading } = useHistory()
  const router = useRouter()

  return (
    <div
      style={style}
      className="flex w-full flex-row px-2 md:gap-2"
    >
      <div className="mr-3 w-[6px] flex-shrink-0 bg-black" />

      {isLoading ? (
        <div className="my-3 flex w-full flex-col gap-6">
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-[125px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          <div className="my-3 flex flex-col gap-6 md:hidden">
            {history.map((item, index) => (
              <div
                key={index}
                className="relative flex w-full flex-col gap-4 rounded-md bg-secondary p-5 text-sm sm:gap-2"
              >
                <div className="-left-[21px] top-6 absolute h-[13px] w-[14px] rounded-full bg-black" />
                <h2 className="text-base font-bold">
                  {item.title}{" "}
                  <span className="font-normal">- {item.date}</span>
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
                        <Trophy
                          className="self-center"
                          color={GOLD}
                          size={64}
                        />
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
              </div>
            ))}
          </div>

          <div className="my-2 hidden w-full flex-col gap-6 md:flex">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex flex-row gap-4 rounded-md bg-secondary p-6 shadow xl:p-8"
              >
                <div className="relative flex flex-1 flex-col gap-4">
                  <div className="-left-[56px] top-1 absolute h-[17px] w-[18px] rounded-full bg-black xl:-left-[63px]" />
                  <h2 className="text-base font-bold">
                    {item.title}{" "}
                    <span className="font-normal">- {item.date}</span>
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
            ))}
          </div>
        </>
      )}
    </div>
  )
}
