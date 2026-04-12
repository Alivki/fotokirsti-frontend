"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const PdfViewer = dynamic(
  () => import("@/components/admin/PdfViewer").then((m) => m.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full px-4 py-8">
        <Skeleton
          className="mx-auto aspect-[210/297] w-full max-w-2xl rounded-lg"
          aria-label="Laster prisliste..."
        />
      </div>
    ),
  }
)

export function PdfViewerClient({ fileUrl }: { fileUrl: string }) {
  return <PdfViewer fileUrl={fileUrl} className="w-full px-4 py-6" />
}
