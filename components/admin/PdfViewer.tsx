"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { Skeleton } from "@/components/ui/skeleton"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  fileUrl: string
  className?: string
}

export function PdfViewer({ fileUrl, className }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [width, setWidth] = useState<number>(400)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateWidth = () => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    const paddingX =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    const contentWidth = rect.width - paddingX
    if (contentWidth > 0) setWidth(Math.floor(contentWidth))
  }

  useLayoutEffect(() => {
    updateWidth()
  }, [fileUrl])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError(null)
  }

  function onDocumentLoadError(err: Error) {
    setError(err.message)
  }

  if (!fileUrl || fileUrl === "#") return null

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Kunne ikke laste PDF: {error}
      </div>
    )
  }

  const minHeightPx = width > 0 ? Math.ceil(width * (297 / 210)) : undefined

  return (
    <div
      ref={containerRef}
      className={`min-w-0 w-full max-w-full overflow-hidden shrink-0 box-border ${className ?? ""}`}
      style={{ width: "100%" }}
    >
      <div
        className="flex min-w-0 max-w-full flex-col items-center gap-4 overflow-hidden"
        style={minHeightPx != null ? { minHeight: minHeightPx } : undefined}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <Skeleton
              className="w-full max-w-full aspect-[210/297] rounded-lg shadow-sm shrink-0"
              aria-label=""
            />
          }
          className="flex max-w-full flex-col items-center gap-4 overflow-hidden"
        >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={width}
            className="shadow-sm"
            renderTextLayer
            renderAnnotationLayer
          />
        ))}
      </Document>
      </div>
    </div>
  )
}
