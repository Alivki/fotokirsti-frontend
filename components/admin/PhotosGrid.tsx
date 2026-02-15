"use client"

import { useState } from "react"
import Image from "next/image"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AlertCircle, FunnelX, Pencil, Trash2 } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { EditPhotoDialog } from "@/components/admin/EditPhotoDialog"
import {
  deletePhoto,
  getAdminPhotos,
  ADMIN_PHOTOS_QUERY_KEY,
  type AdminPhotosFilters,
  type PhotoWithUrl,
} from "@/services/photos"

const MEDALS = [
  { value: "Gull", label: "🥇" },
  { value: "Sølv", label: "🥈" },
  { value: "Bronse", label: "🥉" },
  { value: "Hederlig omtale", label: "H" },
] as const

export function useAdminPhotosQuery(filters?: AdminPhotosFilters) {
  return useQuery({
    queryKey: [...ADMIN_PHOTOS_QUERY_KEY, filters ?? {}],
    queryFn: () => getAdminPhotos(filters),
  })
}

interface PhotosGridProps {
  filters: AdminPhotosFilters
  selectedIds: Set<string>
  isEditing: boolean
  onToggleSelect: (id: string) => void
}

export function PhotosGrid({
  filters,
  selectedIds,
  isEditing,
  onToggleSelect,
}: PhotosGridProps) {
  const queryClient = useQueryClient()
  const { data: photos = [], isLoading, isError } = useAdminPhotosQuery(filters)
  const [editedPhoto, setEditedPhoto] = useState<PhotoWithUrl | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<PhotoWithUrl | null>(null)

  const deleteMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PHOTOS_QUERY_KEY })
      toast.success("Bildet ble slettet")
      setPhotoToDelete(null)
    },
    onError: (err) => {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      const msg =
        axiosErr?.response?.data?.message ??
        (err instanceof Error ? err.message : "Kunne ikke slette")
      toast.error(msg)
    },
  })

  const skeletons = Array.from({ length: 12 }, (_, i) => i)

  return (
    <>
      <div>
        <div className="select-none grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {isLoading
            ? skeletons.map((idx) => (
                <Skeleton
                  key={idx}
                  className="aspect-square w-full rounded-lg"
                />
              ))
            : isError ? (
              <div className="col-span-full">
                <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/40 via-muted/20 to-background p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_70%)] opacity-50" />
                  <div className="relative flex flex-col items-center gap-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 ring-4 ring-destructive/5">
                      <AlertCircle
                        className="size-10 text-destructive/70"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold tracking-tight">
                        Kunne ikke laste bilder
                      </h3>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        Det oppstod en feil ved lasting av bildene. Prøv å
                        oppdatere siden eller sjekk tilkoblingen din.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : photos.length === 0 ? (
              <div className="col-span-full">
                <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/40 via-muted/20 to-background p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_70%)] opacity-50" />
                  <div className="relative flex flex-col items-center gap-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/5">
                      <FunnelX
                        className="size-10 text-primary/70"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold tracking-tight">
                        Ingen bilder funnet
                      </h3>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        Prøv å endre filterne eller last opp nye bilder.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : photos.map((photo) => (
                <ContextMenu key={photo.id}>
                  <ContextMenuTrigger asChild disabled={isEditing}>
                    <div
                      className="group relative aspect-square w-full select-none overflow-hidden rounded-lg bg-muted shadow transition-all duration-200 hover:scale-[1.05] hover:shadow-lg"
                      onClick={() => isEditing && onToggleSelect(photo.id)}
                    >
                      {isEditing && (
                        <div
                          className="absolute top-2 left-2 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedIds.has(photo.id)}
                            onCheckedChange={() => onToggleSelect(photo.id)}
                            className="size-5 shrink-0 rounded-full border-2 border-white/80 bg-black/50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=indeterminate]:border-blue-500 data-[state=indeterminate]:bg-blue-500"
                          />
                        </div>
                      )}
                      <Image
                        src={photo.imageUrl}
                        alt={photo.alt ?? photo.title ?? "Bilde"}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/5 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-white">
                          {photo.title && (
                            <p className="w-full truncate text-[14px] font-semibold leading-tight">
                              {photo.title}
                            </p>
                          )}
                          {photo.hasPrize && photo.prizeMedal && (
                            <p className="mt-2 inline-block max-w-full truncate rounded bg-white px-2 py-[0.5px] text-[12px] text-muted-foreground">
                              {MEDALS.find((m) => m.value === photo.prizeMedal)
                                ?.label}{" "}
                              {photo.prizeTitle}
                            </p>
                          )}
                        </div>
                      </div>
                      {photo.hasPrize && photo.prizeMedal && (
                        <p className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px]">
                          {MEDALS.find((m) => m.value === photo.prizeMedal)
                            ?.label ?? ""}
                        </p>
                      )}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-auto">
                    <ContextMenuItem
                      className="gap-2 pl-2 pr-4 [&_svg]:!text-black"
                      onClick={() => {
                        setEditedPhoto(photo)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil size={13} />
                      Rediger bilde informasjon
                    </ContextMenuItem>
                    <ContextMenuItem
                      variant="destructive"
                      className="gap-2 pl-2 pr-4"
                      onClick={() => setPhotoToDelete(photo)}
                    >
                      <Trash2 size={13} />
                      Slett bildet
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
        </div>
      </div>

      <EditPhotoDialog
        photo={editedPhoto}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditedPhoto(null)
        }}
      />

      <AlertDialog
        open={photoToDelete != null}
        onOpenChange={(open) => !open && setPhotoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett bildet?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette dette bildet? Denne handlingen kan
              ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (photoToDelete) {
                  deleteMutation.mutate(photoToDelete.id)
                  setPhotoToDelete(null)
                }
              }}
              disabled={deleteMutation.isPending}
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
