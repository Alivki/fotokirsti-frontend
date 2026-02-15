"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft } from "lucide-react"
import { PricelistHistoryTable } from "@/components/admin/PricelistHistoryTable"
import {
  getPricelistHistory,
  deleteManyPricelists,
  PRICELIST_QUERY_KEY,
  PRICELIST_HISTORY_QUERY_KEY,
  type PricelistWithUrl,
} from "@/services/pricelist"

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

export default function PricelistHistoryPage() {
  const queryClient = useQueryClient()

  const { data: history = [], error } = useQuery({
    queryKey: PRICELIST_HISTORY_QUERY_KEY,
    queryFn: getPricelistHistory,
  })

  useEffect(() => {
    if (error) toast.error(getErrorMessage(error))
  }, [error])

  const deleteManyMutation = useMutation({
    mutationFn: deleteManyPricelists,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: PRICELIST_HISTORY_QUERY_KEY })
      const previous = queryClient.getQueryData<PricelistWithUrl[]>(
        PRICELIST_HISTORY_QUERY_KEY
      )
      queryClient.setQueryData<PricelistWithUrl[]>(
        PRICELIST_HISTORY_QUERY_KEY,
        (old = []) => old.filter((p) => !ids.includes(p.id))
      )
      return { previous }
    },
    onSuccess: () => {
      toast.success("Prislistene er slettet")
    },
    onError: (err, _ids, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(PRICELIST_HISTORY_QUERY_KEY, context.previous)
      }
      toast.error(getErrorMessage(err))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRICELIST_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: PRICELIST_HISTORY_QUERY_KEY })
    },
  })

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Link
            href="/admin/pricelist"
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Tilbake</span>
          </Link>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="font-medium text-sidebar-primary">
            Prislistehistorikk
          </div>
        </div>
      </header>

      <Separator />

      <div className="flex flex-col gap-4 p-4">
        <PricelistHistoryTable
          data={history}
          onDeleteSelected={(ids) => deleteManyMutation.mutate(ids)}
          isDeleting={deleteManyMutation.isPending}
          hasCurrentPricelist
          showSeparator={false}
        />
      </div>
    </>
  )
}
