"use client"

import { useState } from "react"
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
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table"
import { File, FileStack, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { PricelistWithUrl } from "@/services/pricelist"
import { cn } from "@/lib/utils"

interface PricelistHistoryTableProps {
  data: PricelistWithUrl[]
  onDeleteSelected: (ids: string[]) => void
  isDeleting: boolean
  hasCurrentPricelist?: boolean
  showSeparator?: boolean
}

export function PricelistHistoryTable({
  data,
  onDeleteSelected,
  isDeleting,
  hasCurrentPricelist = true,
  showSeparator = true,
}: PricelistHistoryTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const columns: ColumnDef<PricelistWithUrl>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Velg alle"
          className="translate-y-0.5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white data-[state=indeterminate]:bg-blue-500 data-[state=indeterminate]:border-blue-500 data-[state=indeterminate]:text-white"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Velg rad"
          className="translate-y-0.5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          disabled={row.original.isActive}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "originalName",
      header: "Filnavn",
      cell: ({ row }) => (
        <a
          href={row.original.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-foreground hover:underline"
        >
          <File className="size-4 shrink-0 text-muted-foreground" />
          {row.original.originalName ?? "—"}
        </a>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex items-center rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
            Aktiv
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Tidligere
          </span>
        ),
    },
    {
      accessorKey: "fileSize",
      header: "Størrelse",
      cell: ({ row }) => {
        const size = row.original.fileSize
        if (size == null) return "—"
        const mb = (size / 1024 / 1024).toFixed(2)
        return `${mb} MB`
      },
    },
    {
      accessorKey: "createdAt",
      header: "Lastet opp",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("nb-NO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: (row) => !row.original.isActive,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((r) => r.original.id)
  const hasSelection = selectedIds.length > 0

  const handleDeleteClick = () => {
    if (hasSelection) setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (!hasSelection) return
    onDeleteSelected(selectedIds)
    setRowSelection({})
    setShowDeleteConfirm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {showSeparator && <Separator />}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Slett {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "prisliste" : "prislister"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette{" "}
              {selectedIds.length === 1
                ? "denne prislisten"
                : "disse prislistene"}
              ? Denne handlingen kan ikke angres.
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
      <div className="flex min-h-9 items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-foreground">
          Tidligere prislister
        </h3>
        {hasSelection ? (
          <Button
            variant="destructiveOutline"
            size="xsm"
            className="min-w-auto"
            onClick={handleDeleteClick}
            isLoading={isDeleting}
          >
            <Trash2 size={14} />
            Slett valgte ({selectedIds.length})
          </Button>
        ) : (
          <div className="h-9" aria-hidden />
        )}
      </div>

      {data.length === 0 ? (
        <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/40 via-muted/20 to-background p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_70%)] opacity-50" />
          <div className="relative flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/5">
              <FileStack
                className="size-10 text-primary/70"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                Ingen tidligere prislister
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                {hasCurrentPricelist
                  ? "Når du laster opp en ny prisliste vil den gamle vises her."
                  : "Last opp en prisliste for å komme i gang."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-border bg-muted/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-border transition-colors last:border-b-0",
                      row.getIsSelected() && "bg-blue-500/10",
                      row.original.isActive && "bg-muted/30"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet list (compact rows with header) */}
          <div className="hidden overflow-hidden rounded-lg border border-border md:block lg:hidden">
            <div className="flex flex-col">
              {/* Tablet header */}
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-border bg-muted/50 px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                <div className="w-4 shrink-0" />
                <span>Filnavn</span>
                <span>Status</span>
                <span>Størrelse</span>
                <span>Lastet opp</span>
              </div>
              {table.getRowModel().rows.map((row) => {
                const item = row.original
                const sizeMb =
                  item.fileSize != null
                    ? (item.fileSize / 1024 / 1024).toFixed(2)
                    : null
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("nb-NO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
                const canSelect = !item.isActive

                return (
                  <div
                    key={row.id}
                    className={cn(
                      "grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0",
                      row.getIsSelected() && "bg-blue-500/10",
                      item.isActive && "bg-muted/30"
                    )}
                  >
                    {canSelect ? (
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) =>
                          row.toggleSelected(!!value)
                        }
                        aria-label="Velg"
                        className="translate-y-0 shrink-0 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                    ) : (
                      <div className="w-4 shrink-0" />
                    )}
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-2 font-medium text-foreground hover:underline"
                    >
                      <File className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {item.originalName ?? "—"}
                      </span>
                    </a>
                    {item.isActive ? (
                      <span className="inline-flex shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                        Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Tidligere
                      </span>
                    )}
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {sizeMb != null ? `${sizeMb} MB` : "—"}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {dateStr}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile (connected list with header) */}
          <div className="overflow-hidden rounded-lg border border-border md:hidden">
            <div className="flex flex-col">
              {/* Mobile header */}
              <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                <div className="w-4 shrink-0" />
                <span className="min-w-0 flex-1">Filnavn</span>
                <span className="shrink-0">Status · Størrelse · Lastet opp</span>
              </div>
              {table.getRowModel().rows.map((row) => {
                const item = row.original
                const sizeMb =
                  item.fileSize != null
                    ? (item.fileSize / 1024 / 1024).toFixed(2)
                    : null
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("nb-NO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
                const canSelect = !item.isActive

                return (
                  <div
                    key={row.id}
                    className={cn(
                      "flex flex-col gap-2 border-b border-border px-4 py-3 last:border-b-0",
                      row.getIsSelected() && "bg-blue-500/10",
                      item.isActive && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-w-0 flex-1 items-center gap-2 font-medium text-foreground hover:underline"
                      >
                        <File className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {item.originalName ?? "—"}
                        </span>
                      </a>
                      {canSelect && (
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                          }
                          aria-label="Velg"
                          className="translate-y-0.5 shrink-0 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-6 text-xs text-muted-foreground">
                      {item.isActive ? (
                        <span className="inline-flex rounded-full bg-green-500/15 px-2 py-0.5 font-medium text-green-700 dark:text-green-400">
                          Aktiv
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          Tidligere
                        </span>
                      )}
                      {sizeMb != null && <span>{sizeMb} MB</span>}
                      <span>{dateStr}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
