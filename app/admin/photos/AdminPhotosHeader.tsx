"use client"

import { SquareMousePointer, X, Trash2, Globe, GlobeLock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminPhotosHeaderProps {
  selectedCount: number
  isEditing: boolean
  onEditToggle: () => void
  onDeleteSelected: () => void
  onPublishSelected: () => void
  onUnpublishSelected: () => void
  isDeleting?: boolean
  isPublishing?: boolean
  hasPhotos: boolean
}

export function AdminPhotosHeader({
  selectedCount,
  isEditing,
  onEditToggle,
  onDeleteSelected,
  onPublishSelected,
  onUnpublishSelected,
  isDeleting,
  isPublishing,
  hasPhotos,
}: AdminPhotosHeaderProps) {
  const iconClass = "size-4 shrink-0"
  const editModeResponsive =
    "!min-w-9 !h-9 !w-9 !max-w-9 !rounded-full !p-0 !transition-[box-shadow,transform] sm:!min-w-0 sm:!max-w-none sm:!h-9 sm:!w-auto sm:!rounded-md sm:!px-6 sm:!py-2.5"

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {!isEditing ? (
        <Button
          variant="outline"
          size="icon"
          onClick={onEditToggle}
          disabled={!hasPhotos}
          title={hasPhotos ? "Velg bilder" : "Ingen bilder å velge"}
        >
          <SquareMousePointer className={iconClass} />
        </Button>
      ) : (
        <>
          <Button
            variant="destructiveOutline"
            size="xsm"
            title="Slett valgte bilder"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0 || isDeleting}
            className={cn(editModeResponsive, "!transition-[box-shadow,transform,background-color] duration-200")}
          >
            {isDeleting ? (
              <Loader2 className={cn(iconClass, "animate-spin")} />
            ) : (
              <Trash2 className={iconClass} />
            )}
            <span className="hidden sm:inline">Slett</span>
          </Button>
          <Button
            variant="outline"
            size="xsm"
            title="Publiser valgte bilder"
            onClick={onPublishSelected}
            disabled={selectedCount === 0 || isPublishing}
            className={editModeResponsive}
          >
            {isPublishing ? (
              <Loader2 className={cn(iconClass, "animate-spin")} />
            ) : (
              <Globe className={iconClass} />
            )}
            <span className="hidden sm:inline">Publiser</span>
          </Button>
          <Button
            variant="outline"
            size="xsm"
            title="Avpubliser valgte bilder"
            onClick={onUnpublishSelected}
            disabled={selectedCount === 0 || isPublishing}
            className={editModeResponsive}
          >
            {isPublishing ? (
              <Loader2 className={cn(iconClass, "animate-spin")} />
            ) : (
              <GlobeLock className={iconClass} />
            )}
            <span className="hidden sm:inline">Avpubliser</span>
          </Button>
          <Button
            variant="outline"
            size="xsm"
            onClick={onEditToggle}
            title="Avbryt"
            className={editModeResponsive}
          >
            <X className={iconClass} />
            <span className="hidden sm:inline">Avbryt</span>
          </Button>
        </>
      )}
    </div>
  )
}
