import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import {
  createPricelist,
  PRICELIST_QUERY_KEY,
  PRICELIST_HISTORY_QUERY_KEY,
  type CreatePricelistResponse,
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

export function useUploadPricelist() {
  const queryClient = useQueryClient()

  return useMutation<CreatePricelistResponse, Error, File>({
    mutationFn: createPricelist,
    onSuccess: async (data) => {
      toast.success("Prislisten er lastet opp og aktivert")
      const { uploadUrl: _, ...pricelist } = data
      const newItem: PricelistWithUrl = {
        ...pricelist,
        fileUrl: data.fileUrl ?? "#",
      }
      queryClient.setQueryData<PricelistWithUrl>(PRICELIST_QUERY_KEY, newItem)
      queryClient.setQueryData<PricelistWithUrl[]>(
        PRICELIST_HISTORY_QUERY_KEY,
        (old = []) => {
          const rest = old.map((p) =>
            p.isActive ? { ...p, isActive: false } : p
          )
          return [newItem, ...rest]
        }
      )
      await queryClient.refetchQueries({ queryKey: PRICELIST_QUERY_KEY })
      await queryClient.refetchQueries({ queryKey: PRICELIST_HISTORY_QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
