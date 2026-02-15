"use client"

import { useCallback, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AdminFilter, useAdminPhotoFilters } from "@/components/admin/AdminFilter"
import { AdminPhotosHeader } from "./AdminPhotosHeader"
import { PhotosGrid, useAdminPhotosQuery } from "@/components/admin/PhotosGrid"
import {
  batchPublish,
  deleteManyPhotos,
  ADMIN_PHOTOS_QUERY_KEY,
} from "@/services/photos"

export function AdminPhotosClient() {
  const filters = useAdminPhotoFilters()
  const { data: photos, isLoading, isError } = useAdminPhotosQuery(filters)
  const hasPhotos =
    !isLoading && !isError && photos != null && photos.length > 0
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false)
  const queryClient = useQueryClient()

  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => {
      if (prev) setSelectedIds(new Set())
      return !prev
    })
  }, [])

  const queryKey = [...ADMIN_PHOTOS_QUERY_KEY, filters]

  const deleteManyMutation = useMutation({
    mutationFn: deleteManyPhotos,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_PHOTOS_QUERY_KEY })
      const previous = queryClient.getQueryData<{ id: string }[]>(queryKey)
      queryClient.setQueryData(queryKey, (old: { id: string }[] | undefined) =>
        old ? old.filter((p) => !ids.includes(p.id)) : []
      )
      return { previous }
    },
    onSuccess: (_, ids) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
      toast.success(
        ids.length === 1 ? "Bildet ble slettet" : `${ids.length} bilder ble slettet`
      )
    },
    onError: (err, _ids, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      const axiosErr = err as { response?: { data?: { message?: string } } }
      const msg =
        axiosErr?.response?.data?.message ??
        (err instanceof Error ? err.message : "Sletting feilet")
      toast.error(msg)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PHOTOS_QUERY_KEY })
    },
  })

  const batchPublishMutation = useMutation({
    mutationFn: ({ ids, published }: { ids: string[]; published: boolean }) =>
      batchPublish(ids, published),
    onSuccess: (data, { ids, published }) => {
      setSelectedIds(new Set())
      setIsEditing(false)
      const count = data?.count ?? ids.length
      toast.success(
        published
          ? `${count} ${count === 1 ? "bilde" : "bilder"} er publisert`
          : `${count} ${count === 1 ? "bilde" : "bilder"} er avpublisert`
      )
      queryClient.invalidateQueries({ queryKey: ADMIN_PHOTOS_QUERY_KEY })
    },
    onError: (err) => {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      const msg =
        axiosErr?.response?.data?.message ??
        (err instanceof Error ? err.message : "Oppdatering feilet")
      toast.error(msg)
    },
  })

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.size > 0) setShowDeleteConfirm(true)
  }, [selectedIds.size])

  const handleConfirmDeleteSelected = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length > 0) {
      deleteManyMutation.mutate(ids)
      setShowDeleteConfirm(false)
    }
  }, [selectedIds, deleteManyMutation])

  const handlePublishClick = useCallback(() => {
    if (selectedIds.size > 0) setShowPublishConfirm(true)
  }, [selectedIds.size])

  const handleUnpublishClick = useCallback(() => {
    if (selectedIds.size > 0) setShowUnpublishConfirm(true)
  }, [selectedIds.size])

  const handleConfirmPublish = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length > 0) {
      batchPublishMutation.mutate({ ids, published: true })
      setShowPublishConfirm(false)
    }
  }, [selectedIds, batchPublishMutation])

  const handleConfirmUnpublish = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length > 0) {
      batchPublishMutation.mutate({ ids, published: false })
      setShowUnpublishConfirm(false)
    }
  }, [selectedIds, batchPublishMutation])

  const count = selectedIds.size

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="font-medium text-sidebar-primary">Alle bilder</div>
        </div>
        <AdminPhotosHeader
          selectedCount={count}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onDeleteSelected={handleDeleteSelected}
          onPublishSelected={handlePublishClick}
          onUnpublishSelected={handleUnpublishClick}
          isDeleting={deleteManyMutation.isPending}
          isPublishing={batchPublishMutation.isPending}
          hasPhotos={hasPhotos}
        />
      </header>

      <Separator />

      <div className="flex flex-col gap-4 p-4">
        <AdminFilter />
        <PhotosGrid
        filters={filters}
        selectedIds={selectedIds}
        isEditing={isEditing}
        onToggleSelect={handleToggleSelect}
      />
      </div>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Slett {count} {count === 1 ? "bilde" : "bilder"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette{" "}
              {count === 1 ? "dette bildet" : "disse bildene"}? Denne
              handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDeleteSelected}
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Publiser {count} {count === 1 ? "bilde" : "bilder"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bildene vil bli synlige i galleriet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish}>
              Publiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={showUnpublishConfirm}
        onOpenChange={setShowUnpublishConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Avpubliser {count} {count === 1 ? "bilde" : "bilder"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bildene vil ikke lenger vises i galleriet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnpublish}>
              Avpubliser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
