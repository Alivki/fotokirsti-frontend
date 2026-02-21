"use client"

import { useEffect, useState } from "react"

export interface HistoryEntry {
  title: string
  date: string
  description: string
  hasDescription: boolean
  hasImage: boolean
  hasButton: boolean
  hasTrophy?: boolean
  url: string
  imageAlt: string
  button: { description: string; link: string }
}

interface HistoryData {
  history: Record<string, HistoryEntry>
}

function fixGalleryLink(link: string): string {
  if (link?.includes("premierte") || link?.includes("premierte+bilder")) {
    return "/gallery?hasPrize=true"
  }
  return link || "/"
}

function parseHistory(data: HistoryData | null): HistoryEntry[] {
  if (!data?.history) return []
  return Object.values(data.history)
    .map((entry) => ({
      ...entry,
      button: {
        ...entry.button,
        link: fixGalleryLink(entry.button.link),
      },
    }))
    .sort((a, b) => parseInt(a.date, 10) - parseInt(b.date, 10))
}

export default function useHistory() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/assets/history.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setIsLoading(false)
      })
      .catch(() => {
        setData(null)
        setIsLoading(false)
      })
  }, [])

  const history = parseHistory(data)
  return { history, isLoading }
}
