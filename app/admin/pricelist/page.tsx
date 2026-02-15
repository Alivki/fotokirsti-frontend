"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { CalendarArrowUp, File, FileStack, HardDrive, LoaderCircle, Trash } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/admin/FileUpload"
import { useUploadPricelist } from "@/hooks/useUploadPricelist"
import {
  getCurrentPricelist,
  deletePricelist,
  PRICELIST_QUERY_KEY,
  PRICELIST_HISTORY_QUERY_KEY,
  type PricelistWithUrl,
} from "@/services/pricelist"

const PdfViewer = dynamic(
  () => import("@/components/admin/PdfViewer").then((m) => m.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="min-w-0 w-full max-w-full px-4 py-4">
        <Skeleton
          className="w-full max-w-full aspect-[210/297] rounded-lg shadow-sm"
          aria-label="Laster PDF..."
        />
      </div>
    ),
  }
)

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === "object" && err !== null && "response" in err) {
    const res = (err as AxiosError<{ message?: string }>).response
    if (res?.data?.message) return res.data.message
    if (res?.status === 404) return "Prislisten ble ikke funnet"
    if (res?.status === 500) return "Serverfeil. Prøv igjen senere."
  }
  return "Noe gikk galt"
}

export default function PricelistPage() {
  const queryClient = useQueryClient()
  const uploadMutation = useUploadPricelist()

  const { data: pricelist, isLoading, error } = useQuery({
    queryKey: PRICELIST_QUERY_KEY,
    queryFn: () => getCurrentPricelist(),
    retry: (failureCount, err) => {
      if (typeof err === "object" && err !== null && "response" in err) {
        const res = (err as { response?: { status?: number } }).response
        if (res?.status === 404) return false
      }
      return failureCount < 2
    },
  })

  useEffect(() => {
    if (error) {
      const status = (error as { response?: { status?: number } }).response?.status
      if (status === 404) return
      toast.error(getErrorMessage(error))
    }
  }, [error])

  const deleteMutation = useMutation({
    mutationFn: deletePricelist,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: PRICELIST_QUERY_KEY })
      const previous = queryClient.getQueryData<PricelistWithUrl>(PRICELIST_QUERY_KEY)
      queryClient.setQueryData(PRICELIST_QUERY_KEY, null)
      return { previous }
    },
    onSuccess: () => {
      toast.success("Prislisten er slettet")
    },
    onError: (err, _id, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(PRICELIST_QUERY_KEY, context.previous)
      }
      toast.error(getErrorMessage(err))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRICELIST_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: PRICELIST_HISTORY_QUERY_KEY })
    },
  })

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    if (file.type !== "application/pdf") {
      toast.error("Kun PDF-filer er tillatt")
      return
    }
    uploadMutation.mutate(file)
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteClick = () => {
    if (pricelist) setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (!pricelist) return
    deleteMutation.mutate(pricelist.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="font-medium text-sidebar-primary">Prisliste</div>
        </div>
      </header>

      <Separator />

      <div className="flex min-w-0 flex-col gap-4 p-4">
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-2">
          <p className="text-sm text-muted-foreground">
            Last opp prisliste som en PDF. Du kan kun ha en prisliste om gangen,
            laster du opp en ny vil den erstatte den eksisterende.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[120px] items-center justify-center text-muted-foreground">
            Laster...
          </div>
        ) : pricelist ? (
          <>
            <PricelistCard
              pricelist={pricelist}
              onReplace={handleFileSelect}
              onDelete={handleDeleteClick}
              isDeleting={deleteMutation.isPending}
              isUploading={uploadMutation.isPending}
            />
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Slett prislisten?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Er du sikker på at du vil slette prislisten? Denne handlingen
                    kan ikke angres.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleConfirmDelete}
                  >
                    Slett
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Link
              href="/admin/pricelist-history"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileStack className="size-4" />
              Se prislistehistorikk
            </Link>
            <div className="min-w-0 w-full overflow-x-hidden overflow-y-auto rounded-lg border border-border bg-white">
              <PdfViewer fileUrl={pricelist.fileUrl} className="w-full min-w-0 max-w-full px-4 py-4" />
            </div>
          </>
        ) : (
          <>
            <FileUpload
              type="dropzone"
              variant="pdf"
              onFiles={handleFileSelect}
            />
            <Link
              href="/admin/pricelist-history"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileStack className="size-4" />
              Se prislistehistorikk
            </Link>
          </>
        )}
      </div>
    </>
  )
}

function PricelistCard({
  pricelist,
  onReplace,
  onDelete,
  isDeleting,
  isUploading,
}: {
  pricelist: PricelistWithUrl
  onReplace: (files: File[]) => void | Promise<void>
  onDelete: () => void
  isDeleting: boolean
  isUploading: boolean
}) {
  const uploadDate = pricelist.createdAt
    ? new Date(pricelist.createdAt).toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Opplastingsdato ukjent"

  const fileSizeMb = pricelist.fileSize
    ? (pricelist.fileSize / 1024 / 1024).toFixed(2)
    : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
            {isUploading ? (
              <LoaderCircle size={32} className="animate-spin text-muted-foreground" />
            ) : (
              <File size={32} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <a
              href={pricelist.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {pricelist.originalName}
            </a>
            <div className="flex flex-row gap-2">
              <CalendarArrowUp size={15} className="text-muted-foreground" />
              <p className="text-muted-foreground text-xs">{uploadDate}</p>
            </div>
            {fileSizeMb && (
              <div className="flex flex-row gap-2">
                <HardDrive size={15} className="text-muted-foreground" />
                <p className="text-muted-foreground text-xs">{fileSizeMb} MB</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-row items-stretch gap-2 shrink-0 sm:w-auto">
          <FileUpload
            type="button"
            variant="pdf"
            onFiles={onReplace}
            className="min-w-0 flex-1 sm:flex-initial"
          />
          <Button
            size="icon-sm-square"
            variant="destructiveOutline"
            onClick={onDelete}
            isLoading={isDeleting}
            className="min-w-0 flex-1 sm:flex-initial"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
