import { Skeleton } from "@/components/ui/skeleton"

interface PricelistHistoryTableSkeletonProps {
  rows?: number
}

export function PricelistHistoryTableSkeleton({
  rows = 5,
}: PricelistHistoryTableSkeletonProps) {
  const items = Array.from({ length: rows })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-9 items-center justify-between gap-4">
        <Skeleton className="h-4 w-40" />
        <div className="h-9" aria-hidden />
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6">
            <Skeleton className="size-4" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex flex-col">
          {items.map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 border-b border-border px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-4 rounded-sm" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Tablet list */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block lg:hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
          <div className="w-4 shrink-0" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex flex-col">
          {items.map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-4 shrink-0 rounded-sm" />
              <div className="flex min-w-0 items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-12 shrink-0" />
              <Skeleton className="h-3 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile list */}
      <div className="overflow-hidden rounded-lg border border-border md:hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2">
          <div className="w-4 shrink-0" />
          <Skeleton className="h-3 w-16" />
          <div className="ml-auto">
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex flex-col">
          {items.map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Skeleton className="size-4 shrink-0 rounded-sm" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="size-4 shrink-0 rounded-sm" />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-6">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
